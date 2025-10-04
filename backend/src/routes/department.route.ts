import express from 'express';
import { addDepartments, deleteDepartment, getDepartments, updateDepartments } from '../services/department.service.js';

const departmentRouter = express.Router();

departmentRouter.get('/get', getDepartments);
departmentRouter.post('/add', addDepartments);
departmentRouter.put('/update', updateDepartments);
departmentRouter.delete('/delete', deleteDepartment);

export default departmentRouter;
