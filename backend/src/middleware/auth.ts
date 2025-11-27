import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { AppError } from './error';

declare global {
    namespace Express {
        interface Request {
            auth: {
                userId: string | null;
                sessionId: string | null;
                getToken: () => Promise<string | null>;
            };
            userId?: string; // Keep for backward compatibility/ease of use
        }
    }
}

// Global Clerk middleware
export const clerkAuth = clerkMiddleware();

// Middleware to require authentication
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);

    if (!auth.userId) {
        throw new AppError('Unauthorized: Unauthenticated', 401);
    }

    // Set userId on request for convenience
    req.userId = auth.userId;
    req.auth = auth;

    next();
};
