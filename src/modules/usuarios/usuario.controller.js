import usuarioService from './usuario.service.js';
import { 
    obtenerUsuariosSchema,
    crearUsuarioSchema
} from './usuario.schema.js';


const obtenerUsuarioAntiguo = async (req, res, next) => {
    try {
        const id_usuario = req.params.id_usuario;
        const result = await usuarioService.obtenerUsuarioAntiguo(id_usuario);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const obtenerUsuarioNuevo = async (req, res, next) => {
    try {
        const id_usuario = req.params.id_usuario;
        const result = await usuarioService.obtenerUsuarioNuevo(id_usuario);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const obtenerUsuarios = async (req, res, next) => {
    try {
        const query = obtenerUsuariosSchema.query.parse(req.query)
        const result = await usuarioService.obtenerUsuarios(query);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const obtenerCantidadDeUsuariosSegunEstado = async (req, res, next) => {
    try {
        const result = await usuarioService.obtenerCantidadDeUsuariosSegunEstado();
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const aprobarUsuario = async (req, res, next) => {
    try {
        const id_usuario = req.params.id_usuario;
        const result = await usuarioService.aprobarUsuario(id_usuario);
        // registrar en el historial?
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const rechazarUsuario = async (req, res, next) => {
    try {
        const id_usuario = req.params.id_usuario;
        const result = await usuarioService.rechazarUsuario(id_usuario);
        //registrar en el historial?
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const crearUsuario = async (req, res, next) => {
    try {
        const body = crearUsuarioSchema.body.parse(req.body);
        const result = await usuarioService.crearUsuario(body);
        // registrar en el historial?
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export default {
    obtenerUsuarioAntiguo,
    obtenerUsuarioNuevo,
    obtenerUsuarios,
    obtenerCantidadDeUsuariosSegunEstado,
    aprobarUsuario,
    rechazarUsuario,
    crearUsuario
};
