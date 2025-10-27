import { Router } from 'express';
import historialController from './historial.controller.js';
import { validateRequest } from '../../middleware/validateRequestHandle.js';

const router = Router({ mergeParams: true }); // 👈 para acceder a :id_usuario

router.get(
    '/',
    historialController.obtenerHistorialDeUnUsuario
);

router.post(
    '/',
    historialController.agregarHistorialAUnUsuario
)
export default router;