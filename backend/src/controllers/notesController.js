export function getAllNotes(req, res) {
  res.status(200).send("You fetched the notes");
}

export function createNote(req, res) {
  res.status(201).json({message:"You created note successfully!"});
}

export function updateNote(req, res) {
    res.status(201).json({message:"You updated note successfully!"});
}

export function deleteNote(req, res) {
    res.status(201).json({message:"You deleted note successfully!"});
}