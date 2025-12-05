import { initAppInsights } from './lib/appInsights';
// Initialize App Insights before anything else
initAppInsights();

import express from 'express';
import { env } from './config/env';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/error';
import { healthRouter } from './routes/health';
import { tasksRouter } from './routes/tasks';
import { notesRouter } from './routes/notes';
import { simulateErrorRouter } from './routes/simulate-error';

import { clerkAuth } from './middleware/auth';

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(clerkAuth); // Add Clerk middleware

// Routes
app.use('/api/health', healthRouter);
app.use('/api/v1/tasks', tasksRouter);
app.use('/api/v1/notes', notesRouter);
app.use('/api/simulate-error', simulateErrorRouter);

// Error handling (must be last)
app.use(errorHandler);

const port = env.PORT;

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port} in ${env.NODE_ENV} mode`);
});
