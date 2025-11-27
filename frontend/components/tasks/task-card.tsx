"use client";

import { format } from "date-fns";
import { Trash2, Edit } from "lucide-react";
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskCardProps {
    task: Task;
    onToggleStatus: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

export function TaskCard({
    task,
    onToggleStatus,
    onEdit,
    onDelete,
}: TaskCardProps) {
    const isCompleted = task.status === "COMPLETED";

    const priorityColor = {
        LOW: "success",
        MEDIUM: "warning",
        HIGH: "destructive",
    } as const;

    return (
        <div className="flex items-start justify-between rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start gap-3">
                <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => onToggleStatus(task)}
                    className="mt-1"
                />
                <div className="space-y-1">
                    <h3
                        className={`font-medium leading-none ${isCompleted ? "text-muted-foreground line-through" : ""
                            }`}
                    >
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 pt-2">
                        <Badge variant={priorityColor[task.priority]}>{task.priority}</Badge>
                        {task.dueDate && (
                            <span className="text-xs text-muted-foreground">
                                Due: {format(new Date(task.dueDate), "PPP")}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                    <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(task)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
        </div>
    );
}
