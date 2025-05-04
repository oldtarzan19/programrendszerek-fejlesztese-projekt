// src/routes/userRoutes.ts
import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { isAuthenticated, isAdmin } from '../utils/authMiddleware';
import {Tweet} from "../models/Tweet";
import {Follow} from "../models/Follow";
import {Comment} from "../models/Comment";

const router = Router();

// Összes felhasználó lekérése (csak admin)
router.get('/', isAuthenticated, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Add return type and make sure all paths return void
router.get('/:id', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v');
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Felhasználó felfüggesztése (admin)
router.patch('/:id/suspend', isAuthenticated, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isSuspended: true }, { new: true });
        if (!user){
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json({ message: 'User suspended', user });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.patch('/:id/unsuspend', isAuthenticated, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isSuspended: false }, { new: true  });
        if (!user){
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json({ message: 'User unsuspended', user });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Felhasználó adatainak frissítése (saját)
router.patch('/:id', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        if (req.user && (req.user as any)._id.toString() !== req.params.id) {
            res.status(403).send('Forbidden');
            return;
        }
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!user){
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Felhasználó törlése (saját vagy admin)
router.delete('/:id', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        // 1) Töröljük a usert
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // 2) Töröljük a user által posztolt tweet-eket
        const tweets = await Tweet.find({ user: userId }, '_id');
        const tweetIds = tweets.map(t => t._id);
        await Tweet.deleteMany({ user: userId });

        // 3) Töröljük az összes kommentet, amit a user írt,
        //    illetve azokat, amelyek a user tweetjeihez tartoztak
        await Comment.deleteMany({
            $or: [
                { user: userId },
                { tweet: { $in: tweetIds } }
            ]
        });

        // 4) Töröljük a follow-relációkat is
        await Follow.deleteMany({
            $or: [
                { follower: userId },
                { following: userId }
            ]
        });
        res.status(200).json({ message: 'User and all related data deleted' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
        return;
    }
});

export default router;
