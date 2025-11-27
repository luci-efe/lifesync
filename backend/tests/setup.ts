import { jest } from '@jest/globals';

// Mock Application Insights
jest.mock('../src/lib/appInsights', () => ({
    initAppInsights: jest.fn(),
    defaultClient: {
        trackException: jest.fn(),
    },
}));

// Mock Prisma
jest.mock('../src/lib/prisma', () => ({
    prisma: {
        task: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
        },
        note: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
        },
        $queryRaw: jest.fn(),
    },
}));

// Mock Clerk
jest.mock('@clerk/express', () => ({
    clerkMiddleware: () => (req: any, res: any, next: any) => {
        req.auth = {
            userId: req.headers['x-user-id'] || null,
            sessionId: 'test_session',
            getToken: async () => 'test_token',
        };
        next();
    },
    getAuth: (req: any) => req.auth,
}));
