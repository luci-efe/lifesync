export interface Task {
    id: string;
    title: string;
    description?: string;
    status: "PENDING" | "COMPLETED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface ApiResponse<T> {
    data: T;
    error?: string;
}
