import { Router } from 'express';
import usuarioController from './usuario.controller.js';
import { 
    obtenerUsuarioAntiguoSchema,
    obtenerUsuarioNuevoSchema,
    obtenerUsuariosSchema,
    aprobarUsuarioSchema,
    rechazarUsuarioSchema,
    crearUsuarioSchema,
    agregarDiferenciasSchema,
    obtenerUsuarioNuevoYAntiguoSchema,
    actualizarImagenDniFrenteSchema
} from './usuario.schema.js';
import { validateRequest } from '../../middleware/validateRequestHandle.js';
import historialRouter from '../historial/historial.router.js'
import multer from "multer";
import { authenticate } from '../../middleware/auth.js';
import { checkPermissionByRoles } from '../../middleware/checkPermission.js';

const upload = multer({
    storage: multer.memoryStorage(), // o donde guardes los archivos temporalmente
    limits: { fileSize: 5 * 1024 * 1024 }, // ejemplo: 5MB máximo
});

const router = Router();

//rutas publicas
router.post(
    '/crear-usuario', 
    upload.fields([
        { name: "dni_frente", maxCount: 1 },
        { name: "dni_dorso", maxCount: 1 },
    ]),
    validateRequest(crearUsuarioSchema),
    usuarioController.crearUsuario
);

router.get(
    '/antiguo/:id_usuario',
    validateRequest(obtenerUsuarioAntiguoSchema),
    // cambio de controlador para verificar la existencia del usuario
    usuarioController.verificarExistenciaDeUsuario
);

router.get(
    '/participantes',
    usuarioController.obtenerUsuariosParaSorteo
);

router.get(
    '/cantidad-de-usuarios-segun-estado', 
    usuarioController.obtenerCantidadDeUsuariosSegunEstado
)

//rutas privadas

router.use(authenticate)
router.use(checkPermissionByRoles(["superAdmin","admin"]))


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
    '/agregar-diferencias/:id_usuario',
    validateRequest(agregarDiferenciasSchema),
    usuarioController.agregarDiferencias
)

router.get(
    '/obtener-usuario-nuevo-y-antiguo/:id_usuario',
    validateRequest(obtenerUsuarioNuevoYAntiguoSchema),
    usuarioController.obtenerUsuarioNuevoYAntiguo
)

router.get(
    '/obtener-todos-los-usuarios-con-diferencias',
    checkPermissionByRoles(["superAdmin"]), //aseguro que solo superAdmin pueda ver esto
    usuarioController.obtenerTodosLosUsuariosConDiferencias
)

router.post(
    '/actualizar-imagen-dni/:id_usuario',
    upload.fields([
        { name: "dni_frente", maxCount: 1 },
    ]),
    validateRequest(actualizarImagenDniFrenteSchema),
    usuarioController.actualizarImagenDniFrente
)

router.get(
    '/obtener-todos-los-usuarios-con-interes-en-comprar',
    usuarioController.obtenerTodosLosUsuariosConInteresEnComprar
)

router.get(
    '/obtener-todos-los-usuarios',
    usuarioController.obtenerTodosLosUsuarios
)

router.use('/:id_usuario/historial', historialRouter)

export default router;
