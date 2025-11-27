import { Request, Response, NextFunction } from 'express';
import { AppError } from './error';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
        throw new AppError('Unauthorized: Missing x-user-id header', 401);
    }

    // In a real app, we would validate this ID with Clerk here
    req.userId = userId;
    next();
};
