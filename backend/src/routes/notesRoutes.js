import express from "express";
import { createNote, deleteNote, getAllNotes, updateNote } from "../controllers/notesController.js";

const router = express.Router();

export default router;

// Define a route for GET requests to the root URL
router.get('/', getAllNotes);

router.post('/', createNote );

router.put('/:id', updateNote); 

router.delete('/:id', deleteNote); 
