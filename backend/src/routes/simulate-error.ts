import { Router } from 'express';
import { AppError } from '../middleware/error';

const router = Router();

router.get('/', (req, res) => {
    throw new Error('Simulated synchronous error');
});

router.get('/async', async (req, res) => {
    throw new Error('Simulated asynchronous error');
});

router.get('/app-error', (req, res) => {
    throw new AppError('Simulated AppError', 400);
});

router.get('/slow', async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    res.json({ message: 'Slow response simulated' });
});

export const simulateErrorRouter = router;
