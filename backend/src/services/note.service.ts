import { prisma } from '../lib/prisma';
import { Note, Prisma } from '@prisma/client';

export class NoteService {
    static async listNotes(userId: string): Promise<Note[]> {
        return prisma.note.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }

    static async createNote(userId: string, data: { title: string; content: string }): Promise<Note> {
        return prisma.note.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    static async updateNote(userId: string, id: string, data: Prisma.NoteUpdateInput): Promise<Note> {
        // Verify ownership
        await this.getNote(userId, id);

        return prisma.note.update({
            where: { id },
            data,
        });
    }

    static async deleteNote(userId: string, id: string): Promise<Note> {
        // Verify ownership
        await this.getNote(userId, id);

        return prisma.note.delete({
            where: { id },
        });
    }

    static async getNote(userId: string, id: string): Promise<Note> {
        const note = await prisma.note.findUnique({
            where: { id },
        });

        if (!note || note.userId !== userId) {
            throw new Error('Note not found');
        }

        return note;
    }
}
