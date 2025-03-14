// src/routes/commentRoutes.ts
import { Router, Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { isAuthenticated, isAdmin } from '../utils/authMiddleware';

const router = Router();

// Egy tweethez tartozó kommentek lekérése
router.get('/tweet/:tweetId', async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await Comment.find({ tweet: req.params.tweetId }).populate('user', 'username email');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Új komment létrehozása (bejelentkezett user)
router.post('/', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const { tweet, content } = req.body;
        const comment = new Comment({
            user: (req.user as any)._id,
            tweet,
            content,
        });
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Komment módosítása (csak tulajdonos vagy admin)
router.patch('/:id', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).send('Comment not found');
            return;
        }
        if ((req.user as any)._id.toString() !== comment.user.toString() && (req.user as any).role !== 'admin') {
             res.status(403).send('Forbidden');
             return;
        }
        comment.content = req.body.content || comment.content;
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Komment törlése (csak tulajdonos vagy admin)
router.delete('/:id', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).send('Comment not found');
            return;
        }
        if ((req.user as any)._id.toString() !== comment.user.toString() && (req.user as any).role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
