"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Note } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface NoteCardProps {
    note: Note;
    onDelete: (note: Note) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
    return (
        <div className="group relative flex flex-col justify-between rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md h-64">
            <Link href={`/notes/${note.id}`} className="flex-1 overflow-hidden">
                <h3 className="font-semibold leading-none tracking-tight mb-2">
                    {note.title || "Untitled Note"}
                </h3>
                <div className="prose prose-sm dark:prose-invert line-clamp-6 text-muted-foreground text-sm">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>
            </Link>
            <div className="flex items-center justify-between pt-4 mt-auto border-t">
                <span className="text-xs text-muted-foreground">
                    {format(new Date(note.updatedAt), "MMM d, yyyy")}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete(note);
                    }}
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
        </div>
    );
}
