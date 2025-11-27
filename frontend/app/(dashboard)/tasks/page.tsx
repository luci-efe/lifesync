"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import { Task } from "@/lib/types";
import { useTasks } from "@/lib/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/tasks/task-list";
import { TaskForm } from "@/components/tasks/task-form";

export default function TasksPage() {
    const { tasks, isLoading, createTask, updateTask, deleteTask, mutate } = useTasks();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    const handleCreate = async (taskData: Partial<Task>) => {
        try {
            await createTask(taskData);
            toast.success("Task created successfully");
        } catch {
            toast.error("Failed to create task");
        }
    };

    const handleUpdate = async (taskData: Partial<Task>) => {
        if (!editingTask) return;
        try {
            await updateTask(editingTask.id, taskData);
            toast.success("Task updated successfully");
            setEditingTask(undefined);
        } catch {
            toast.error("Failed to update task");
        }
    };

    const handleToggleStatus = async (task: Task) => {
        try {
            const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
            // Optimistic update
            mutate(
                {
                    data: tasks.map((t) =>
                        t.id === task.id ? { ...t, status: newStatus } : t
                    ),
                },
                false
            );
            await updateTask(task.id, { status: newStatus });
        } catch {
            toast.error("Failed to update task status");
            mutate(); // Revert on error
        }
    };

    const handleDelete = async (task: Task) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await deleteTask(task.id);
            toast.success("Task deleted successfully");
        } catch {
            toast.error("Failed to delete task");
        }
    };

    const openCreateModal = () => {
        setEditingTask(undefined);
        setIsFormOpen(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </div>

            <TaskList
                tasks={tasks}
                isLoading={isLoading}
                onToggleStatus={handleToggleStatus}
                onEdit={openEditModal}
                onDelete={handleDelete}
            />

            <TaskForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={editingTask ? handleUpdate : handleCreate}
                initialData={editingTask}
            />
        </div>
    );
}
