import { Router } from 'express';
import usuarioController from './usuario.controller.js';
import { 
    obtenerUsuarioAntiguoSchema,
    obtenerUsuarioNuevoSchema,
    obtenerUsuariosSchema,
    aprobarUsuarioSchema,
    rechazarUsuarioSchema,
    crearUsuarioSchema
} from './usuario.schema.js';
import { validateRequest } from '../../middleware/validateRequestHandle.js';
import historialRouter from '../historial/historial.router.js'
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(), // o donde guardes los archivos temporalmente
    limits: { fileSize: 5 * 1024 * 1024 }, // ejemplo: 5MB máximo
});

const router = Router();

router.get(
    '/antiguo/:id_usuario',
    validateRequest(obtenerUsuarioAntiguoSchema),
    usuarioController.obtenerUsuarioAntiguo
);
router.get(
    '/nuevo/:id_usuario', 
    validateRequest(obtenerUsuarioNuevoSchema),
    usuarioController.obtenerUsuarioNuevo
);

router.get(
    '/',
    validateRequest(obtenerUsuariosSchema), 
    usuarioController.obtenerUsuarios
);

router.get(
    '/cantidad-de-usuarios-segun-estado', 
    usuarioController.obtenerCantidadDeUsuariosSegunEstado
)

router.post(
    '/aprobar-usuario/:id_usuario', 
    validateRequest(aprobarUsuarioSchema),
    usuarioController.aprobarUsuario
);

router.post('/rechazar-usuario/:id_usuario', 
    validateRequest(rechazarUsuarioSchema),
    usuarioController.rechazarUsuario
);

router.post(
    '/crear-usuario', 
    upload.fields([
        { name: "dni_frente", maxCount: 1 },
        { name: "dni_dorso", maxCount: 1 },
    ]),
    validateRequest(crearUsuarioSchema),
    usuarioController.crearUsuario
);

router.use('/:id_usuario/historial', historialRouter)


export default router;
