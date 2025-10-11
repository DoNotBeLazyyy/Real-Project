import express from 'express';
import { addCoursework, deleteCoursework, getCourseworks, updateCoursework, upload } from '../services/coursework.service.js';

const courseworkRouter = express.Router();

courseworkRouter.post('/add', upload.array('files'), addCoursework);
courseworkRouter.get('/get', getCourseworks);
courseworkRouter.put('/update', updateCoursework);
courseworkRouter.delete('/delete', deleteCoursework);

export default courseworkRouter;
