import { Router } from 'express';
import { z } from 'zod';
import { NoteService } from '../services/note.service';
import { requireAuth } from '../middleware/auth';
import { AppError } from '../middleware/error';

const router = Router();

// Validation schemas
const createNoteSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
});

const updateNoteSchema = createNoteSchema.partial();

// Apply auth middleware
router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const notes = await NoteService.listNotes(req.userId!);
        res.json({ data: notes, meta: { total: notes.length } });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const data = createNoteSchema.parse(req.body);
        const note = await NoteService.createNote(req.userId!, data);
        res.status(201).json({ data: note });
    } catch (error) {
        next(error);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = updateNoteSchema.parse(req.body);

        try {
            const note = await NoteService.updateNote(req.userId!, id, data);
            res.json({ data: note });
        } catch (error: any) {
            if (error.message === 'Note not found') {
                throw new AppError('Note not found', 404);
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        try {
            await NoteService.deleteNote(req.userId!, id);
            res.status(204).send();
        } catch (error: any) {
            if (error.message === 'Note not found') {
                throw new AppError('Note not found', 404);
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
});

export const notesRouter = router;
