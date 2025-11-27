import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import { fetcher } from "@/lib/api/client";
import { Note } from "@/lib/types";

export function useNotes() {
    const { userId, isLoaded } = useAuth();

    const { data, error, mutate } = useSWR(
        isLoaded && userId ? "/api/v1/notes" : null,
        (url) => fetcher<{ data: Note[] }>(url, userId!)
    );

    const createNote = async (noteData: Partial<Note>) => {
        if (!userId) throw new Error("Not authenticated");
        return fetcher<{ data: Note }>("/api/v1/notes", userId, {
            method: "POST",
            body: JSON.stringify(noteData),
        });
    };

    const updateNote = async (id: string, noteData: Partial<Note>) => {
        if (!userId) throw new Error("Not authenticated");
        return fetcher<{ data: Note }>(`/api/v1/notes/${id}`, userId, {
            method: "PATCH",
            body: JSON.stringify(noteData),
        });
    };

    const deleteNote = async (id: string) => {
        if (!userId) throw new Error("Not authenticated");
        await fetcher(`/api/v1/notes/${id}`, userId, {
            method: "DELETE",
        });
        mutate();
    };

    return {
        notes: data?.data || [],
        isLoading: !data && !error,
        isError: error,
        createNote,
        updateNote,
        deleteNote,
        mutate,
    };
}
