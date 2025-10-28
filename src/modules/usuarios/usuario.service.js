import HttpError from '../../errors/httpError.js';
import prisma from '../../prisma-client.js';
import s3Service from '../../services/s3.service.js';
import { obtenerExtensionArchivo } from '../../utils/archivo.js';

const obtenerUsuarioAntiguo = async (id_usuario) => {
    const usuario = await prisma.usersOriginal.findUnique({
        where: {
            documentNumber: id_usuario
        }
    })

    if(!usuario){
        throw new HttpError(404, "No se encontro el usuario antiguo");
    }
    return usuario
}

const obtenerUsuarioNuevo = async (id_usuario) => {
    const usuario = await prisma.users.findUnique({
        where: {
            documentNumber: id_usuario
        }
    })

    if(!usuario){
        throw new HttpError(404, "No se encontro el usuario");
    }

    // //buscar las imagenes del usuario
    // const imagenes = await s3Service.getFilesToS3('usuarios', id_usuario)
    // console.log(imagenes)
    // const {id, ...resto_usuario} = usuario
    // const response = {
    //     ...resto_usuario,
    //     imagenes: imagenes.map(imagen => {
    //         return {
    //             key: imagen.key,
    //             name: imagen.name,
    //             url: imagen.url
    //         }
    //     })

    // }
    const {id, ...response} = usuario
    return response
}

const obtenerUsuarios = async (query) => {
    const { page = 1, limit = 10, estado } = query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const usuarios = await prisma.users.findMany({
        where: estado ? { status: estado } : {}, // filtrar por estado si viene
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: { id: "desc" } 
    });

    const total = await prisma.users.count({
        where: estado ? { status: estado } : {}
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
    const grouped = await prisma.users.groupBy({
        by: ['estado'],
        _count: { _all: true },
    });
    if(grouped.length === 0){
        return {
            "approved": 0,
            "rejected": 0,
            "pending": 0
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
    const usuarioActualizado = await prisma.users.update({
      where: {
        documentNumber: id_usuario
      },
      data: {
        status: "approved"
      }
    })
    return usuarioActualizado
}

const rechazarUsuario = async (id_usuario) => {
    const usuario = await obtenerUsuarioNuevo(id_usuario)
    const usuarioActualizado = await prisma.users.update({
      where: {
        documentNumber: id_usuario
      },
      data: {
        status: "rejected"
      }
    })
    return usuarioActualizado
}

const crearUsuario = async (usuario,documentBackImage,documentFrontImage) => {
    const {
        nombre,
        apellido,
        fecha_de_nacimiento,
        numero_documento,
        domicilio,
        email,
        celular,
        gender,
        maritalStatus,
        whatsapp,
        wants_to_buy,

    } = usuario



    const usuarioExistente = await prisma.users.findUnique({
        where: {
            documentNumber: numero_documento
        }
    })

    if (usuarioExistente) {
        throw new HttpError(409, "El usuario ya existe");
    }
    

    const usuarioCreado = await prisma.users.create({
        data: {
            firstName: nombre,
            lastName: apellido,
            birthDate: new Date(fecha_de_nacimiento).toISOString(),
            documentNumber: numero_documento,
            address: domicilio,
            email,
            cellphone: celular,
            gender,
            maritalStatus,
            whatsapp,
            wants_to_buy,
            documentFrontImage,
            documentBackImage
        }
    })
    return usuarioCreado
}

const eliminarUsuario = async (id_usuario) => {
    await prisma.users.delete({
        where: {
            documentNumber: id_usuario
        }
    })
}
const agregarImagenAUnUsuario = async(file,nro_documento) => {
    const tipo_de_archivo = obtenerExtensionArchivo(file)
    const nombre_archivo_dni_frente = `${file.fieldname}.${tipo_de_archivo}`
    return await s3Service.uploadToS3(
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
