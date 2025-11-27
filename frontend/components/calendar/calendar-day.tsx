"use client";

import { format, isSameDay, isToday } from "date-fns";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CalendarDayProps {
    date: Date;
    tasks: Task[];
    isCurrentMonth: boolean;
    onClick: () => void;
}

export function CalendarDay({
    date,
    tasks,
    isCurrentMonth,
    onClick,
}: CalendarDayProps) {
    const dayTasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        return isSameDay(new Date(task.dueDate), date);
    });

    const priorityColor = {
        LOW: "bg-green-500",
        MEDIUM: "bg-yellow-500",
        HIGH: "bg-red-500",
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative flex h-32 flex-col gap-1 border-b border-r p-2 transition-colors hover:bg-accent/50",
                !isCurrentMonth && "bg-muted/50 text-muted-foreground",
                isToday(date) && "bg-primary/5"
            )}
        >
            <span
                className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                    isToday(date) && "bg-primary text-primary-foreground"
                )}
            >
                {format(date, "d")}
            </span>
            <div className="flex flex-col gap-1 overflow-y-auto">
                {dayTasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center gap-1 rounded px-1 py-0.5 text-xs font-medium bg-secondary truncate"
                        title={task.title}
                    >
                        <div
                            className={`h-1.5 w-1.5 rounded-full ${priorityColor[task.priority]
                                }`}
                        />
                        <span className="truncate">{task.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
