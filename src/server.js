// src/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errors } from 'celebrate';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import noteRouter from "./routes/notesRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;


app.use(express.json());
app.use(cors());
app.use(logger);
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});
app.use(noteRouter);

// app.get('/notes', (req, res) => {
//   res.status(200).json({  message: "Retrieved all notes"  });
// });
// app.get('/notes/:noteId', (req, res) => {
//   const { noteId } = req.params;
//   res.status(200).json({ message: `Retrieved note with ID: ${noteId} `});
// });


app.use(notFoundHandler);

app.use(errors());

// Middleware для обробки помилок
app.use(errorHandler);

await connectMongoDB();

// Решта коду файла
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
