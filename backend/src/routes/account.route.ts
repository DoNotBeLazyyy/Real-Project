// account.router.ts
import { login } from '@services/account/account.service.js';
import { changePassword } from '@services/account/change-password.service.js';
import express from 'express';

const accountRouter = express.Router();

accountRouter.post('/login', login);
accountRouter.put('/change-password', changePassword);

export default accountRouter;