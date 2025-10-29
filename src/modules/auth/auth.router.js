import authController from "./auth.controller.js";
import { Router } from 'express';
import { loginSchema } from './auth.schema.js';
import { validateRequest } from '../../middleware/validateRequestHandle.js';

const router = Router();

router.post('/login',validateRequest(loginSchema),authController.login);

export default router;