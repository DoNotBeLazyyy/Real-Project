import express from 'express';
import { addSchedules, deleteSchedule, getSchedules, updateSchedules } from '../services/schedule.service.js';

const scheduleRouter = express.Router();

scheduleRouter.get('/get', getSchedules);
scheduleRouter.post('/add', addSchedules);
scheduleRouter.put('/update', updateSchedules);
scheduleRouter.delete('/delete', deleteSchedule);

export default scheduleRouter;
