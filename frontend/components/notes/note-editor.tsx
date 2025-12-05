"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

import { Note } from "@/lib/types";
import { useNotes } from "@/lib/hooks/use-notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NoteEditorProps {
    initialData?: Note;
}

export function NoteEditor({ initialData }: NoteEditorProps) {
    const router = useRouter();
    const { createNote, updateNote } = useNotes();
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [isPreview, setIsPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        setIsSaving(true);
        try {
            if (initialData) {
                await updateNote(initialData.id, { title, content });
                toast.success("Note updated");
            } else {
                await createNote({ title, content });
                toast.success("Note created");
                router.push("/notes");
            }
        } catch {
            toast.error("Failed to save note");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Note Title"
                        className="text-lg font-semibold border-none bg-transparent focus-visible:ring-0 px-0 h-auto"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsPreview(!isPreview)}
                        title={isPreview ? "Edit" : "Preview"}
                    >
                        {isPreview ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-lg border bg-card">
                {isPreview ? (
                    <div className="h-full overflow-auto p-4 prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                ) : (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing..."
                        className="h-full w-full resize-none bg-transparent p-4 focus:outline-none"
                    />
                )}
            </div>
        </div>
    );
}
