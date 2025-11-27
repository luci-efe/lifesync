import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const healthRouter = Router();

healthRouter.get('/', async (req, res, next) => {
    try {
        const detail = req.query.detail === 'true';

        const health: any = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };

        if (detail) {
            try {
                await prisma.$queryRaw`SELECT 1`;
                health.database = 'connected';
            } catch (error) {
                health.database = 'disconnected';
                health.status = 'degraded';
            }
        }

        res.json(health);
    } catch (error) {
        next(error);
    }
});
