// account.router.ts
import express from 'express';
import { loginAccount, changePassword } from '../services/account.service.js';

const accountRouter = express.Router();

accountRouter.post('/login', loginAccount);

accountRouter.put('/change-password', changePassword);

export default accountRouter;
