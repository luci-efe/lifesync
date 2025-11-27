"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import { Note } from "@/lib/types";
import { useNotes } from "@/lib/hooks/use-notes";
import { Button } from "@/components/ui/button";
import { NoteList } from "@/components/notes/note-list";

export default function NotesPage() {
    const { notes, isLoading, deleteNote } = useNotes();

    const handleDelete = async (note: Note) => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        try {
            await deleteNote(note.id);
            toast.success("Note deleted successfully");
        } catch {
            toast.error("Failed to delete note");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
                <Link href="/notes/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Note
                    </Button>
                </Link>
            </div>

            <NoteList notes={notes} isLoading={isLoading} onDelete={handleDelete} />
        </div>
    );
}
