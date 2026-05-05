import { Router } from 'express';
import buyersUserController from './buyers-user.controller.js';
import { validateRequest } from '../../middleware/validateRequestHandle.js';
import multer from 'multer';
import parseUploadedFiles from '../../middleware/uploadFiles.js';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(), // o donde guardes los archivos temporalmente
    limits: { fileSize: 15 * 1024 * 1024 }, // ejemplo: 5MB máximo
});


router.post(
    '/',
    upload.any(),
    parseUploadedFiles(),
    buyersUserController.agregarUsuarioComprador
)

export default router