import request from 'supertest';
import express from 'express';
import { tasksRouter } from '../src/routes/tasks';
import { prisma } from '../src/lib/prisma';
import { errorHandler } from '../src/middleware/error';
import { clerkAuth } from '../src/middleware/auth';

const app = express();
app.use(express.json());
app.use(clerkAuth);
app.use('/api/v1/tasks', tasksRouter);
app.use(errorHandler);

describe('Tasks Endpoints', () => {
    const mockUserId = 'user_123';
    const mockTask = {
        id: 'task_1',
        title: 'Test Task',
        status: 'PENDING',
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should list tasks', async () => {
        (prisma.task.findMany as jest.Mock).mockResolvedValue([mockTask]);

        const res = await request(app)
            .get('/api/v1/tasks')
            .set('x-user-id', mockUserId);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(prisma.task.findMany).toHaveBeenCalledWith({
            where: { userId: mockUserId },
            orderBy: { createdAt: 'desc' },
        });
    });

    it('should create a task', async () => {
        (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

        const res = await request(app)
            .post('/api/v1/tasks')
            .set('x-user-id', mockUserId)
            .send({ title: 'New Task' });

        expect(res.status).toBe(201);
        expect(res.body.data.title).toBe('Test Task');
    });

    it('should return 401 if user is unauthenticated', async () => {
        const res = await request(app).get('/api/v1/tasks');
        expect(res.status).toBe(401);
    });
});
