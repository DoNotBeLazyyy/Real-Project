import express from 'express';
import { addFaculties, deleteFaculties, getFaculties, updateFaculties } from '../services/faculty.service.js';

const facultyRouter = express.Router();

facultyRouter.get('/get', getFaculties);
facultyRouter.post('/add', addFaculties);
facultyRouter.put('/update', updateFaculties);
facultyRouter.delete('/delete', deleteFaculties);

export default facultyRouter;
