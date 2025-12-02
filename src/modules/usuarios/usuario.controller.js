import usuarioService from './usuario.service.js';
import { 
    obtenerUsuariosSchema,
    crearUsuarioSchema,
    agregarDiferenciasSchema,
    rechazarUsuarioSchema,
    actualizarImagenDniFrenteSchema
} from './usuario.schema.js';
import { enviarEmailDeAprobacion, enviarEmailDeRechazo } from '../../services/email.service.js';




const obtenerUsuarioAntiguo = async (req, res, next) => {
    try {
        const id_usuario = req.params.id_usuario;
        const result = await usuarioService.obtenerUsuarioAntiguo(id_usuario);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const verificarExistenciaDeUsuario = async (req, res, next) => {
    try {
        const id_usuario = req.params.id_usuario;
        const result = await usuarioService.verificarExistenciaDeUsuario(id_usuario);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

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
        const usuario = await usuarioService.obtenerUsuarioNuevo(id_usuario);
        // intento enviar email
        await enviarEmailDeAprobacion(usuario.email,usuario.firstName)

        const result = await usuarioService.aprobarUsuario(id_usuario);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const rechazarUsuario = async (req, res, next) => {
    try {
        const id_usuario = req.params.id_usuario;
        const body = rechazarUsuarioSchema.body.parse(req.body);
        const usuario = await usuarioService.obtenerUsuarioNuevo(id_usuario);
        // intento enviar email
        await enviarEmailDeRechazo(usuario.email,usuario.firstName,body.motivo)
        const result = await usuarioService.rechazarUsuario(id_usuario);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const crearUsuario = async (req, res, next) => {
    const compensations = [];
    try {
        const body = crearUsuarioSchema.body.parse(req.body);
        const files = crearUsuarioSchema.files.parse(req.files);
        //agrego las imagenes al usuario
        const result_imagen_dni_frente = await usuarioService.agregarImagenAUnUsuario(files.dni_frente[0],body.numero_documento)
        compensations.push(() => usuarioService.eliminarImagenDeUnUsuario(result_imagen_dni_frente.key) )
        /* const result_imagen_dni_dorso = await usuarioService.agregarImagenAUnUsuario(files.dni_dorso[0],body.numero_documento)
        compensations.push(() => usuarioService.eliminarImagenDeUnUsuario(result_imagen_dni_dorso.key) ) */

        //creo el usuario en la db
        //falta agregar las url de las imagenes
        const usuario_creado = await usuarioService.crearUsuario(body,result_imagen_dni_frente.url);
        // // un poco innecesario
        // compensations.push(() => usuarioService.eliminarUsuario(usuario_creado.numero_documento))
        // registrar en el historial?
        res.json(usuario_creado);
    } catch (err) {
        //si falla alguna de las acciones, se ejecutan las compensaciones (como un rollback)
        //a futuro crear una funcion para esto
        try {
            for (const compensation of compensations.reverse()){
                console.log("ejecuto compensacion")
                await compensation();
                console.log("fin de compensacion")
            }
        } catch (error) {
            console.log(error)
        }

        next(err);
    }
};

const agregarDiferencias = async (req, res, next) => {
    try {
        const id_usuario = req.params.id_usuario;
        const {diferencias} = agregarDiferenciasSchema.body.parse(req.body);
        const result = await usuarioService.agregarDiferencias(id_usuario,diferencias);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const obtenerUsuarioNuevoYAntiguo = async (req, res, next) => {
    try {
        const id_usuario = req.params.id_usuario;
        const result = await usuarioService.obtenerUsuarioNuevoYAntiguo(id_usuario);
        res.json(result);
    } catch (error) {
        next(error)
    }
}

const obtenerTodosLosUsuariosConDiferencias = async (req, res, next) => {
    try {
        const result = await usuarioService.obtenerTodosLosUsuariosConDiferencias();
        res.json(result);
    } catch (error) {
        next(error)
    }   
}

const obtenerUsuariosParaSorteo = async (req, res, next) => {
    try {
        const result = await usuarioService.obtenerUsuariosParaSorteo();
        res.json(result);
    } catch (error) {
        next(error)
    }
}

const actualizarImagenDniFrente = async (req, res, next) => {
    try {
        const nro_documento = req.params.id_usuario;
        //verifico que el usuario exista
        obtenerUsuarioNuevo(nro_documento)
        const files = actualizarImagenDniFrenteSchema.files.parse(req.files);
        //la imagen nueva debe pisar la anterior
        const result_imagen_dni_frente = await usuarioService.agregarImagenAUnUsuario(files.dni_frente[0], nro_documento);
        const result = await usuarioService.updateImagenFrenteAUnUsuario(result_imagen_dni_frente.url , nro_documento);
        console.log('Se edito el ID de un user' , result);
        const response = {
            "message": "Imagen actualizada exitosamente",
            "imageUrl": result_imagen_dni_frente.url
        }
        res.json(response);
    } catch (error) {
        next(error)
    }
}

export const obtenerTodosLosUsuariosConInteresEnComprar = async (req, res, next) => {
    try {
        const result = await usuarioService.obtenerTodosLosUsuariosConInteresEnComprar()
        res.json(result);
    } catch (error) {
        next(error)
    }
}

export default {
    obtenerUsuarioAntiguo,
    obtenerUsuarioNuevo,
    obtenerUsuarios,
    obtenerCantidadDeUsuariosSegunEstado,
    aprobarUsuario,
    rechazarUsuario,
    crearUsuario,
    agregarDiferencias,
    obtenerUsuarioNuevoYAntiguo,
    obtenerTodosLosUsuariosConDiferencias,
    verificarExistenciaDeUsuario,
    obtenerUsuariosParaSorteo,
    actualizarImagenDniFrente,
    obtenerTodosLosUsuariosConInteresEnComprar
};
