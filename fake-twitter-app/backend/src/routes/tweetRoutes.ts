// src/routes/tweetRoutes.ts
import { Router, Request, Response } from 'express';
import { Tweet } from '../models/Tweet';
import { isAuthenticated, isAdmin } from '../utils/authMiddleware';

const router = Router();

// Összes tweet lekérése
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const tweets = await Tweet.find({}).populate('user', 'username email');
        res.status(200).json(tweets);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Egy tweet lekérése
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const tweet = await Tweet.findById(req.params.id).populate('user', 'username email');
        if (!tweet) {
            res.status(404).send('Tweet not found');
            return;
        }
        res.status(200).json(tweet);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Új tweet létrehozása (csak bejelentkezett)
router.post('/', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const { content } = req.body;
        const tweet = new Tweet({
            user: (req.user as any)._id,
            content,
        });
        await tweet.save();
        res.status(201).json(tweet);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Tweet módosítása (csak tulajdonos vagy admin)
router.patch('/:id', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) {
            res.status(404).send('Tweet not found');
            return;
        }
        if ((req.user as any)._id.toString() !== tweet.user.toString() && (req.user as any).role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }
        tweet.content = req.body.content || tweet.content;
        await tweet.save();
        res.status(200).json(tweet);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Tweet törlése (csak tulajdonos vagy admin)
router.delete('/:id', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) {
            res.status(404).send('Tweet not found');
            return;
        }
        if ((req.user as any)._id.toString() !== tweet.user.toString() && (req.user as any).role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }
        await Tweet.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Tweet deleted' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Tweet like művelet
router.post('/:id/like', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) {
            res.status(404).send('Tweet not found');
            return;
        }
        if (!tweet.likes.includes((req.user as any)._id)) {
            tweet.likes.push((req.user as any)._id);
            await tweet.save();
        }
        res.status(200).json(tweet);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Tweet unlike művelet
router.post('/:id/unlike', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) {
            res.status(404).send('Tweet not found');
            return;
        }
        tweet.likes = tweet.likes.filter(id => id.toString() !== (req.user as any)._id.toString());
        await tweet.save();
        res.status(200).json(tweet);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Retweet létrehozása
router.post('/:id/retweet', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const originalTweet = await Tweet.findById(req.params.id);
        if (!originalTweet) {
            res.status(404).send('Original Tweet not found');
            return;
        }
        const retweet = new Tweet({
            user: (req.user as any)._id,
            content: originalTweet.content,
            retweetOf: originalTweet._id,
        });
        await retweet.save();
        res.status(201).json(retweet);
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
