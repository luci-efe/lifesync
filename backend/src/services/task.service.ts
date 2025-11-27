import { prisma } from '../lib/prisma';
import { Task, TaskStatus, TaskPriority, Prisma } from '@prisma/client';

export class TaskService {
    static async listTasks(userId: string): Promise<Task[]> {
        return prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async createTask(userId: string, data: { title: string; description?: string; priority?: TaskPriority; dueDate?: Date }): Promise<Task> {
        return prisma.task.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    static async updateTask(userId: string, id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
        // Verify ownership first
        await this.getTask(userId, id);

        return prisma.task.update({
            where: { id },
            data,
        });
    }

    static async deleteTask(userId: string, id: string): Promise<Task> {
        // Verify ownership first
        await this.getTask(userId, id);

        return prisma.task.delete({
            where: { id },
        });
    }

    static async getTask(userId: string, id: string): Promise<Task> {
        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task || task.userId !== userId) {
            throw new Error('Task not found'); // Should be handled as 404 by controller/middleware
        }

        return task;
    }
}
