import HttpError from '../../errors/httpError.js';
import prisma from '../../prisma-client.js';


//seria historial/auditoria
const obtenerHistorialDeUnUsuario = async (id_usuario) => {
    const usuario = await prisma.users.findUnique({
        where: {
            documentNumber: id_usuario
        },
        include: {
            historial: true
        }    
    })

    if(!usuario){
        throw HttpError.notFound("No se encontro el usuario");
    }
    console.log(usuario)
    return usuario.historial
}

const agregarHistorialAUnUsuario = async (id_usuario, historial_body) => {
    const {
        titulo,
        motivo 
    } = historial_body
    const historial = await prisma.historial.create({
        data: {
            titulo,
            motivo,
            usuario_afectado_id: id_usuario
        }
    })
    return historial
}

export default {
    obtenerHistorialDeUnUsuario,
    agregarHistorialAUnUsuario
}