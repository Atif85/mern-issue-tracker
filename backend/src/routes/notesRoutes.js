import express from "express";
import { getAllNotes, getNote, createNote, updateNote, deleteNote } from "../controllers/notesController.js";

const router = express.Router();

export default router;

// Define a route for GET requests to the root URL
router.get('/', getAllNotes);

router.get('/:id', getNote);

router.post('/', createNote);

router.put('/:id', updateNote); 

router.delete('/:id', deleteNote); 
