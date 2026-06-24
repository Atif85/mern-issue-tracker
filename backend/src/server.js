import dns from "dns";
dns.setServers(['1.1.1.1', '1.0.0.1']); 

import express from "express"
import dotenv from "dotenv"
import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

// middleware
app.use(express.json());

app.use("/api/notes", notesRoutes)

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
}); 