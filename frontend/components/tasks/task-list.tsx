"use client";

import { Task } from "@/lib/types";
import { TaskCard } from "./task-card";

interface TaskListProps {
    tasks: Task[];
    onToggleStatus: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    isLoading: boolean;
}

export function TaskList({
    tasks,
    onToggleStatus,
    onEdit,
    onDelete,
    isLoading,
}: TaskListProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
                ))}
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <h3 className="text-lg font-medium">No tasks found</h3>
                <p className="text-sm text-muted-foreground">
                    Create a new task to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
