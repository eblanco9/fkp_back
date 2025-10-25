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

const router = Router();

router.get(
    '/obtener-usuario-antiguo/:id_usuario',
    validateRequest(obtenerUsuarioAntiguoSchema),
    usuarioController.obtenerUsuarioAntiguo
);
router.get(
    '/obtener-usuario-nuevo/:id_usuario', 
    validateRequest(obtenerUsuarioNuevoSchema),
    usuarioController.obtenerUsuarioNuevo
);

router.get(
    '/obtener-usuarios',
    validateRequest(obtenerUsuariosSchema), 
    usuarioController.obtenerUsuarios
);

router.get(
    '/obtener-cantidad-de-usuarios-segun-estado', 
    validateRequest(aprobarUsuarioSchema),
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
    validateRequest(crearUsuarioSchema),
    usuarioController.crearUsuario
);


export default router;
