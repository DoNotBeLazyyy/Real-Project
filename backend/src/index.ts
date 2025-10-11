import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { authMiddleware } from './middlewares/logger.middleware.js';
import accountRouter from './routes/account.route.js';
import courseRouter from './routes/course.route.js';
import courseworkRouter from './routes/coursework.route.js';
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

const publicRoutes = ['/api/account/login', '/api/account/change-password'];
app.use((req, res, next) => {
    if (publicRoutes.includes(req.path)) return next();
    authMiddleware(req, res, next);
});

// Routes
app.use('/api/student', studentRouter)
app.use('/api/faculty', facultyRouter)
app.use('/api/schedule', scheduleRouter)
app.use('/api/course', courseRouter)
app.use('/api/department', departmentRouter)
app.use('/api/program', programRouter)
app.use('/api/account', accountRouter)
app.use('/api/coursework', courseworkRouter)

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
