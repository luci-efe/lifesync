"use client";

import { Note } from "@/lib/types";
import { NoteCard } from "./note-card";

interface NoteListProps {
    notes: Note[];
    onDelete: (note: Note) => void;
    isLoading: boolean;
}

export function NoteList({ notes, onDelete, isLoading }: NoteListProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
                    />
                ))}
            </div>
        );
    }

    if (notes.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <h3 className="text-lg font-medium">No notes found</h3>
                <p className="text-sm text-muted-foreground">
                    Create a new note to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
                <NoteCard key={note.id} note={note} onDelete={onDelete} />
            ))}
        </div>
    );
}
