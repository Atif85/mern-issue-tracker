import express from "express"
import notesRoutes from "./routes/notesRoutes.js"

const app = express();
const port = 8080;

app.use("/api/notes", notesRoutes)

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); 