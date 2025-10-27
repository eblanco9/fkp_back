import historialService from './historial.service.js';


const obtenerHistorialDeUnUsuario = async (req, res, next) => {
    try {
        const id_usuario = req.params.id_usuario;
        const result = await historialService.obtenerHistorialDeUnUsuario(id_usuario);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const agregarHistorialAUnUsuario = async (req, res, next) => {
    try {
        const id_usuario = req.params.id_usuario;
        const body = req.body;
        const result = await historialService.agregarHistorialAUnUsuario(id_usuario,body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export default {
    obtenerHistorialDeUnUsuario,
    agregarHistorialAUnUsuario
}
