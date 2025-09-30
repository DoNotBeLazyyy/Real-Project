import express from 'express';
import { addStudents, deleteStudent, getAllStudents, updateStudents } from '../services/student.service.js';

const studentRouter = express.Router();

studentRouter.get('/get', getAllStudents);
studentRouter.post('/add', addStudents);
studentRouter.put('/update', updateStudents);
studentRouter.delete('/delete', deleteStudent);

export default studentRouter;
