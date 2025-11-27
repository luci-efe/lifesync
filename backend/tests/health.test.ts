import request from 'supertest';
import express from 'express';
import { healthRouter } from '../src/routes/health';
import { prisma } from '../src/lib/prisma';

const app = express();
app.use('/api/health', healthRouter);

describe('Health Endpoint', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('healthy');
    });

    it('should return database status when detail=true', async () => {
        (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([1]);

        const res = await request(app).get('/api/health?detail=true');
        expect(res.status).toBe(200);
        expect(res.body.database).toBe('connected');
    });

    it('should handle database errors gracefully', async () => {
        (prisma.$queryRaw as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

        const res = await request(app).get('/api/health?detail=true');
        expect(res.status).toBe(200);
        expect(res.body.database).toBe('disconnected');
        expect(res.body.status).toBe('degraded');
    });
});
