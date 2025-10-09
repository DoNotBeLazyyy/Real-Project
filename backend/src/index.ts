import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import accountRouter from './routes/account.route.js';
import courseRouter from './routes/course.route.js';
import departmentRouter from './routes/department.route.js';
import facultyRouter from './routes/faculty.route.js';
import programRouter from './routes/program.route.js';
import scheduleRouter from './routes/schedule.route.js';
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
app.use('/api/schedule', scheduleRouter)
app.use('/api/course', courseRouter)
app.use('/api/department', departmentRouter)
app.use('/api/program', programRouter)
app.use('/api/account', accountRouter)

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
