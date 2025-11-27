"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Note } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface NoteCardProps {
    note: Note;
    onDelete: (note: Note) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative flex flex-col justify-between rounded-md border border-border bg-card p-4 hover:bg-accent/50 transition-colors h-48"
        >
            <Link href={`/notes/${note.id}`} className="flex-1 overflow-hidden">
                <h3 className="font-medium leading-none tracking-tight mb-2 text-foreground">
                    {note.title || "Untitled"}
                </h3>
                <div className="prose prose-sm dark:prose-invert line-clamp-5 text-muted-foreground text-xs">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>
            </Link>
            <div className="flex items-center justify-between pt-3 mt-auto">
                <span className="text-[10px] text-muted-foreground">
                    {format(new Date(note.updatedAt), "MMM d")}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete(note);
                    }}
                >
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </Button>
            </div>
        </motion.div>
    );
}
