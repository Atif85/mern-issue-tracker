import dns from 'dns';
dns.setServers(['1.1.1.1', '1.0.0.1']);

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import issuesRoutes from './routes/issuesRoutes.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// middleware
if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: 'http://localhost:5173/',
    })
  );
}

app.use(express.json());
app.use('/api/issues', issuesRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
  });
});
