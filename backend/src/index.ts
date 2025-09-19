import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
// src/index.ts
import express, { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (_req: Request, res: Response) => {
    res.send('Backend is running!');
});

// Example: get all students
app.get('/students', (_req: Request, res: Response) => {
    const dummyStudents = [
        { id: 'S001', firstName: 'Alice', lastName: 'Johnson' },
        { id: 'S002', firstName: 'Bob', lastName: 'Brown' }
    ];
    res.json(dummyStudents);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
