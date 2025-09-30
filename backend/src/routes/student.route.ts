import express from 'express';
import { addStudents, deleteStudent, getStudents, updateStudents } from '../services/student.service.js';

const studentRouter = express.Router();

studentRouter.get('/get', getStudents);
studentRouter.post('/add', addStudents);
studentRouter.put('/update', updateStudents);
studentRouter.delete('/delete', deleteStudent);

export default studentRouter;
