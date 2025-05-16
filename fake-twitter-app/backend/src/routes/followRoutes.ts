import { Router, Request, Response } from 'express';
import { Follow } from '../models/Follow';
import { isAuthenticated } from '../utils/authMiddleware';

const router = Router();

// Követési kapcsolat létrehozása
router.post('/', isAuthenticated, async (req: Request, res: Response) => {
    try {
        const { following } = req.body;
        const follow = new Follow({
            follower: (req.user as any)._id,
            following,
        });
        await follow.save();
        res.status(201).json(follow);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Egy felhasználó követőinek lekérése
router.get('/:userId/followers', async (req: Request, res: Response) => {
    try {
        const followers = await Follow.find({ following: req.params.userId }).populate('follower', 'username email');
        res.status(200).json(followers);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Egy felhasználó által követett felhasználók lekérése
router.get('/:userId/following', async (req: Request, res: Response) => {
    try {
        const following = await Follow.find({ follower: req.params.userId }).populate('following', 'username email');
        res.status(200).json(following);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Követési kapcsolat megszüntetése
router.delete('/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
        await Follow.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
