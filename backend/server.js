import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json());

import kunderRoutes from './routes/kunder.js';
import bestallningarRoutes from './routes/bestallningar.js';
import bockerRoutes from './routes/bocker.js';
import rapportRoutes from './routes/rapport.js';

app.use('/kunder', kunderRoutes);
app.use('/bestallningar', bestallningarRoutes);
app.use('/bocker', bockerRoutes);
app.use('/bestallning', rapportRoutes);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontEnd/public')));

app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});


// Graceful Shutdown
process.on('SIGINT', () => {
  console.log("Initiating graceful shutdown...");
  app.close(() => {
    console.log("Server shut down gracefully.");
    process.exit(0); // Exit with success code
  });
});