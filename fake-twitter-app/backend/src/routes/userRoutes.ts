// src/routes/userRoutes.ts
import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { isAuthenticated, isAdmin } from '../utils/authMiddleware';

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
        if (req.user && (req.user as any)._id.toString() !== req.params.id && (req.user as any).role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user){
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
