"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useNotes } from "@/lib/hooks/use-notes";
import { NoteEditor } from "@/components/notes/note-editor";
import { Note } from "@/lib/types";

export default function EditNotePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { notes, isLoading, isError } = useNotes();
    const [note, setNote] = useState<Note | null>(null);

    useEffect(() => {
        if (notes.length > 0) {
            const foundNote = notes.find((n) => n.id === id);
            if (foundNote) {
                setNote(foundNote);
            } else if (!isLoading && !isError) {
                // If loaded but not found, redirect
                router.push("/notes");
            }
        }
    }, [notes, id, router, isLoading, isError]);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!note) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <NoteEditor initialData={note || undefined} />
        </div>
    );
}
