import HttpError from '../../errors/httpError.js';
import prisma from '../../prisma-client.js';
import s3Service from '../../services/s3.service.js';
import { obtenerExtensionArchivo } from '../../utils/archivo.js';

const obtenerUsuarioAntiguo = async (id_usuario) => {
    const usuario = await prisma.usuarioAntiguo.findUnique({
        where: {
            numero_documento: Number(id_usuario)
        }
    })

    if(!usuario){
        throw new HttpError(404, "No se encontro el usuario antiguo");
    }
    return usuario
}

const obtenerUsuarioNuevo = async (id_usuario) => {
    const usuario = await prisma.usuario.findUnique({
        where: {
            numero_documento: Number(id_usuario)
        }
    })

    if(!usuario){
        throw new HttpError(404, "No se encontro el usuario");
    }

    //buscar las imagenes del usuario
    const imagenes = await s3Service.getFilesToS3('usuarios', id_usuario)
    console.log(imagenes)
    const {id, ...resto_usuario} = usuario
    const response = {
        ...resto_usuario,
        imagenes: imagenes.map(imagen => {
            return {
                key: imagen.key,
                name: imagen.name,
                url: imagen.url
            }
        })

    }
    return response
}

const obtenerUsuarios = async (query) => {
    const { page = 1, limit = 10, estado } = query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const usuarios = await prisma.usuario.findMany({
        where: estado ? { estado: estado } : {}, // filtrar por estado si viene
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: { id: "desc" } 
    });

    const total = await prisma.usuario.count({
        where: estado ? { estado: estado } : {}
    });

    return {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        usuarios: usuarios
    };
}

const obtenerCantidadDeUsuariosSegunEstado = async () => {
    const grouped = await prisma.usuario.groupBy({
        by: ['estado'],
        _count: { _all: true },
        having: {
            estado: {
                notIn: ["NONE"]
            }
        }
    });
    if(grouped.length === 0){
        return {
            "NONE": 0,
            "APPROVE": 0,
            "REJECT": 0,
            "PENDING": 0
        }
    }

    const response = grouped.reduce((acc, curr) => {
        acc[curr.estado] = curr._count._all
        return acc
    },{})
    return response
}

const aprobarUsuario = async (id_usuario) => {
    const usuario = await obtenerUsuarioNuevo(id_usuario)
    const usuarioActualizado = await prisma.usuario.update({
      where: {
        numero_id: Number(usuario.numero_id)
      },
      data: {
        estado: "APPROVE"
      }
    })
    return usuarioActualizado
}

const rechazarUsuario = async (id_usuario) => {
    const usuario = await obtenerUsuarioNuevo(id_usuario)
    const usuarioActualizado = await prisma.usuario.update({
      where: {
        numero_id: Number(usuario.numero_id)
      },
      data: {
        estado: "REJECT"
      }
    })
    return usuarioActualizado
}

const crearUsuario = async (usuario) => {
    const {
        nombre,
        apellido,
        fecha_de_nacimiento,
        numero_documento,
        domicilio,
        email,
        celular
    } = usuario

    const usuarioExistente = await prisma.usuario.findUnique({
        where: {
            numero_documento: Number(numero_documento)
        }
    })

    if (usuarioExistente) {
        throw new HttpError(409, "El usuario ya existe");
    }
    
    const usuarioCreado = await prisma.usuario.create({
        data: {
            nombre,
            apellido,
            fecha_de_nacimiento: new Date(fecha_de_nacimiento).toISOString(),
            numero_documento: Number(numero_documento),
            domicilio,
            email,
            celular,
            estado: "PENDING"
        }
    })
    return usuarioCreado
}

const eliminarUsuario = async (id_usuario) => {
    await prisma.usuario.delete({
        where: {
            numero_documento: Number(id_usuario)
        }
    })
}
const agregarImagenAUnUsuario = async(file,nro_documento) => {
    const tipo_de_archivo = obtenerExtensionArchivo(file)
    const nombre_archivo_dni_frente = `${file.fieldname}.${tipo_de_archivo}`
    await s3Service.uploadToS3(
        file.buffer,
        nombre_archivo_dni_frente,
        file.mimetype,
        'usuarios',
        nro_documento
    ) 
};

const eliminarImagenDeUnUsuario = async(key_imagen) => {
    await s3Service.deleteFromS3(key_imagen)
}

export default {
    obtenerUsuarioAntiguo,
    obtenerUsuarioNuevo,
    obtenerUsuarios,
    obtenerCantidadDeUsuariosSegunEstado,
    aprobarUsuario,
    rechazarUsuario,
    crearUsuario,
    eliminarUsuario,
    agregarImagenAUnUsuario,
    eliminarImagenDeUnUsuario
};
