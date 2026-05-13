import express from "express"

const app = express();
const port = 8080;

// Define a route for GET requests to the root URL
app.get('/api/notes', (req, res) => {
  res.status(200).send("You have some notes");
});

app.post('/api/notes', (req, res) => {
  res.status(201).json({message:"Post created successfully!"});
});

app.put('/api/notes:id', (req, res) => {
  res.status(201).json({message:"Post updated successfully!"});
}); 

app.delete('/api/notes:id', (req, res) => {
  res.status(201).json({message:"Post deleted successfully!"});
}); 



// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); 