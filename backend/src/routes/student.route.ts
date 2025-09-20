import express from 'express';
import { addStudents, deleteStudent, getAllStudents, updateStudent } from '../services/student.service.js';

const studentRouter = express.Router();

studentRouter.get('/', getAllStudents);
studentRouter.post('/add', addStudents);
studentRouter.put('/:id', updateStudent);
studentRouter.delete('/:id', deleteStudent);

export default studentRouter;
