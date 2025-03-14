// src/utils/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === 'admin') {
        return next();
    }
    res.status(403).send('Forbidden');
};
