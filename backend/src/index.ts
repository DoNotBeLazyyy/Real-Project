import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import facultyRouter from './routes/faculty.route.js';
import studentRouter from './routes/student.route.js';

dotenv.config();

const port = process.env.PORT;

if (!port) {
    throw new Error("PORT is not defined in the environment variables!");
}

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/student', studentRouter)
app.use('/api/faculty', facultyRouter)

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
