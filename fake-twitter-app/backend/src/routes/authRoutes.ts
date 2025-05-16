import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import {IUser, User} from '../models/User';
import {IVerifyOptions} from "passport-local";

const router = Router();

// Regisztráció
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Bejelentkezés
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error | null, user: IUser | false, info?: IVerifyOptions) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info?.message || 'Login failed' });

        // Ellenőrizzük a felfüggesztést
        if (user.isSuspended) {
            return res.status(403).json({ message: 'Your account is suspended' });
        }

        req.logIn(user, err => {
            if (err) return next(err);
            return res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next);
});

// Kijelentkezés
router.post('/logout', (req: Request, res: Response) => {
    req.logout(err => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

export default router;
