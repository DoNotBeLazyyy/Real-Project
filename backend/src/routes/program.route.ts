import express from 'express';
import { addPrograms, deleteProgram, getPrograms, updatePrograms } from '../services/program.service.js';

const programRouter = express.Router();

programRouter.get('/get', getPrograms);
programRouter.post('/add', addPrograms);
programRouter.put('/update', updatePrograms);
programRouter.delete('/delete', deleteProgram);

export default programRouter;