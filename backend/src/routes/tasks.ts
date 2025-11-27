import { Router } from 'express';
import { z } from 'zod';
import { TaskService } from '../services/task.service';
import { requireAuth } from '../middleware/auth';
import { AppError } from '../middleware/error';

const router = Router();

// Validation schemas
const createTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().datetime().optional().transform(str => str ? new Date(str) : undefined),
});

const updateTaskSchema = createTaskSchema.partial().extend({
    status: z.enum(['PENDING', 'COMPLETED']).optional(),
});

// Apply auth middleware to all routes
router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const tasks = await TaskService.listTasks(req.userId!);
        res.json({ data: tasks, meta: { total: tasks.length } });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const data = createTaskSchema.parse(req.body);
        const task = await TaskService.createTask(req.userId!, data);
        res.status(201).json({ data: task });
    } catch (error) {
        next(error);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = updateTaskSchema.parse(req.body);

        try {
            const task = await TaskService.updateTask(req.userId!, id, data);
            res.json({ data: task });
        } catch (error: any) {
            if (error.message === 'Task not found') {
                throw new AppError('Task not found', 404);
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        try {
            await TaskService.deleteTask(req.userId!, id);
            res.status(204).send();
        } catch (error: any) {
            if (error.message === 'Task not found') {
                throw new AppError('Task not found', 404);
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
});

export const tasksRouter = router;
