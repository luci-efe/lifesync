import request from 'supertest';
import express from 'express';
import { notesRouter } from '../src/routes/notes';
import { prisma } from '../src/lib/prisma';
import { errorHandler } from '../src/middleware/error';
import { clerkAuth } from '../src/middleware/auth';

const app = express();
app.use(express.json());
app.use(clerkAuth);
app.use('/api/v1/notes', notesRouter);
app.use(errorHandler);

describe('Notes Endpoints', () => {
    const mockUserId = 'user_123';
    const mockNote = {
        id: 'note_1',
        title: 'Test Note',
        content: 'Content',
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should list notes', async () => {
        (prisma.note.findMany as jest.Mock).mockResolvedValue([mockNote]);

        const res = await request(app)
            .get('/api/v1/notes')
            .set('x-user-id', mockUserId);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
    });

    it('should create a note', async () => {
        (prisma.note.create as jest.Mock).mockResolvedValue(mockNote);

        const res = await request(app)
            .post('/api/v1/notes')
            .set('x-user-id', mockUserId)
            .send({ title: 'New Note', content: 'Content' });

        expect(res.status).toBe(201);
        expect(res.body.data.title).toBe('Test Note');
    });
});
