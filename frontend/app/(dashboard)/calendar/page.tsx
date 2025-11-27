"use client";

import { useTasks } from "@/lib/hooks/use-tasks";
import { CalendarGrid } from "@/components/calendar/calendar-grid";

export default function CalendarPage() {
    const { tasks, isLoading } = useTasks();

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <CalendarGrid tasks={tasks} />
        </div>
    );
}
