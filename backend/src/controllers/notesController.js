import Note from '../models/Note.js';

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error when getting all notes', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getNote(req, res) {
  try {
    const id = req.params.id;
    const note = await Note.findById(id);

    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json(note);
  } catch (error) {
    console.error('Error when getting note', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content });

    await newNote.save();
    res.status(201).json({ message: 'Note created successfully' });
  } catch (error) {
    console.error('Error when creating note', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const id = req.params.id;

    const updatedNote = await Note.findByIdAndUpdate(id, { title, content });

    if (!updatedNote)
      return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error when updating note', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteNote(req, res) {
  try {
    const id = req.params.id;

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote)
      return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error when deleting note', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
