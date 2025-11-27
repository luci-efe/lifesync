import cors from 'cors';
import { env } from '../config/env';

export const corsMiddleware = cors({
    origin: env.ALLOWED_ORIGINS === '*' ? '*' : env.ALLOWED_ORIGINS.split(','),
    credentials: true,
});
