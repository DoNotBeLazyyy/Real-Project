import { addPrograms, deleteProgram, getPrograms, updatePrograms } from '../services/program.service.js';
import express from 'express';
const programRouter = express.Router();
programRouter.get('/get', getPrograms);
programRouter.post('/add', addPrograms);
programRouter.put('/update', updatePrograms);
programRouter.delete('/delete', deleteProgram);
export default programRouter;
