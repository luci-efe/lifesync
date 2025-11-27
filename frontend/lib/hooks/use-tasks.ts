import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import { fetcher } from "@/lib/api/client";
import { Task } from "@/lib/types";

export function useTasks() {
    const { userId, isLoaded } = useAuth();

    const { data, error, mutate } = useSWR(
        isLoaded && userId ? "/api/v1/tasks" : null,
        (url) => fetcher<{ data: Task[] }>(url, userId!)
    );

    const createTask = async (taskData: Partial<Task>) => {
        if (!userId) throw new Error("Not authenticated");
        await fetcher("/api/v1/tasks", userId, {
            method: "POST",
            body: JSON.stringify(taskData),
        });
        mutate();
    };

    const updateTask = async (id: string, taskData: Partial<Task>) => {
        if (!userId) throw new Error("Not authenticated");
        await fetcher(`/api/v1/tasks/${id}`, userId, {
            method: "PATCH",
            body: JSON.stringify(taskData),
        });
        mutate();
    };

    const deleteTask = async (id: string) => {
        if (!userId) throw new Error("Not authenticated");
        await fetcher(`/api/v1/tasks/${id}`, userId, {
            method: "DELETE",
        });
        mutate();
    };

    return {
        tasks: data?.data || [],
        isLoading: !data && !error,
        isError: error,
        createTask,
        updateTask,
        deleteTask,
        mutate,
    };
}
