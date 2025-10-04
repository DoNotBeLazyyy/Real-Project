import express from 'express';
import { addCourses, deleteCourse, getCourses, updateCourses } from '../services/course.service.js';

const courseRouter = express.Router();

courseRouter.get('/get', getCourses);
courseRouter.post('/add', addCourses);
courseRouter.put('/update', updateCourses);
courseRouter.delete('/delete', deleteCourse);

export default courseRouter;
