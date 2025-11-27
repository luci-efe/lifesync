"use client";

import { format } from "date-fns";
import { Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
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

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="group flex items-start justify-between rounded-md border border-border bg-card p-3 hover:bg-accent/50 transition-colors"
        >
            <div className="flex items-start gap-3">
                <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => onToggleStatus(task)}
                    className="mt-1 rounded-sm"
                />
                <div className="space-y-1">
                    <h3
                        className={`text-sm font-medium leading-none transition-all ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"
                            }`}
                    >
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                            {task.priority.toLowerCase()}
                        </Badge>
                        {task.dueDate && (
                            <span className="text-[10px] text-muted-foreground">
                                {format(new Date(task.dueDate), "MMM d")}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(task)}>
                    <Edit className="h-3 w-3 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(task)}>
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </Button>
            </div>
        </motion.div>
    );
}
