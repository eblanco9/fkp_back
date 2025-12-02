import HttpError from '../../errors/httpError.js';
import prisma from '../../prisma-client.js';
import s3Service from '../../services/s3.service.js';
import { obtenerExtensionArchivo } from '../../utils/archivo.js';
import { Estado } from '../../generated/prisma/index.js';
import crypto from "crypto";

const obtenerUsuarioAntiguo = async (id_usuario) => {
    const usuario = await prisma.usersOriginal.findUnique({
        where: {
            documentNumber: id_usuario
        }
    })

    if (!usuario) {
        throw new HttpError(404, "No se encontro el usuario antiguo");
    }
    return {
        ...usuario,
        birthDate: usuario.birthDate.toISOString().split('T')[0]
    }
}

const obtenerUsuarioNuevo = async (id_usuario) => {
    const usuario = await prisma.users.findUnique({
        where: {
            documentNumber: id_usuario
        }
    })

    if (!usuario) {
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
    return {
        ...usuario,
        birthDate: usuario.birthDate.toISOString().split('T')[0]
    }
}

const obtenerUsuarios = async (query) => {
    const { page = 1, limit = 10, estado } = query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const usuarios = await prisma.users.findMany({
        where: estado ? { status: estado } : {}, // filtrar por estado si viene
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "asc" }
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
        by: ['status'],
        _count: { _all: true },
    });

    const response = Object.values(Estado).reduce((acc, curr) => {
        acc[curr] = grouped.find(group => group.status === curr)?._count._all || 0
        return acc
    }, {})
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

const agregarDiferencias = async (id_usuario, diferencias) => {
    const usuario = await obtenerUsuarioNuevo(id_usuario)
    const usuarioActualizado = await prisma.users.update({
        where: {
            documentNumber: id_usuario
        },
        data: {
            has_differences: true,
            differences: diferencias
        }
    })
    return usuarioActualizado
}

const crearUsuario = async (usuario, documentFrontImage) => {
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

    const datos_usuario = {
        firstName: nombre,
        lastName: apellido,
        birthDate: new Date(fecha_de_nacimiento).toISOString(),
        address: domicilio,
        email,
        cellphone: celular,
        gender,
        maritalStatus,
        whatsapp,
        wants_to_buy,
        documentFrontImage
    }

    const usuarioCreado = await prisma.users.upsert({
        where: {
            documentNumber: numero_documento
        },
        create: {
            documentNumber: numero_documento,
            ...datos_usuario
        },
        update: {
            status: "pending",
            ...datos_usuario
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
const agregarImagenAUnUsuario = async (file, nro_documento) => {
    const tipo_de_archivo = obtenerExtensionArchivo(file)
    const nombre_archivo_dni_frente = `${crypto.randomUUID()}-${file.fieldname}.${tipo_de_archivo}`
    return await s3Service.uploadToS3(
        file.buffer,
        nombre_archivo_dni_frente,
        file.mimetype,
        'usuarios',
        nro_documento
    )
};

const eliminarImagenDeUnUsuario = async (key_imagen) => {
    await s3Service.deleteFromS3(key_imagen)
}

const obtenerUsuarioNuevoYAntiguo = async (id_usuario) => {
    const usuario_nuevo = await obtenerUsuarioNuevo(id_usuario)
    const usuario_antiguo = await obtenerUsuarioAntiguo(id_usuario)
    return {
        usuario_nuevo: {
            ...usuario_nuevo
        },
        usuario_antiguo: {
            ...usuario_antiguo
        }
    }
}

export const obtenerTodosLosUsuariosConDiferencias = async () => {
    const usuarios = await prisma.users.findMany({
        where: {
            has_differences: true
        }
    })

    const response = usuarios.map((usuario) => {
        return {
            id: usuario.id,
            documentNumber: usuario.documentNumber,
            firstName: usuario.firstName,
            lastName: usuario.lastName,
            birthDate: usuario.birthDate,
            address: usuario.address,
            email: usuario.email,
            cellphone: usuario.cellphone,
            whatsapp: usuario.whatsapp,
            wants_to_buy: usuario.wants_to_buy,
            has_differences: usuario.has_differences,
            differences: usuario.differences
        }
    })

    return response

}

const obtenerUsuariosParaSorteo = async () => {
    const usuarios = await prisma.users.findMany({
        where: {
            status: "approved",
        },
        orderBy: {
            createdAt: "asc", // orden estable para numeración
        },
        select: {
            documentNumber: true,
            firstName: true,
            lastName: true,
            email: true,
            cellphone: true,
            address: true,
            createdAt: true,
        },
    });

    const participantes = usuarios.map((u, index) => ({
        numero: index + 1,                          // autoincremental
        nombre: u.firstName ?? "",
        apellido: u.lastName ?? "",
        email: u.email ?? "",
        telefono: u.cellphone ?? "",
        direccion: u.address ?? "",
        id: u.documentNumber ?? "",                // 10 dígitos según tu validación
    }));

    return participantes;
};


const verificarExistenciaDeUsuario = async (id_usuario) => {
    const usuarioAntiguo = await prisma.usersOriginal.findUnique({
        where: {
            documentNumber: id_usuario
        }
    })

    if (!usuarioAntiguo) {
        throw HttpError.notFound("No se encontro el usuario");
    }

    // verifico que el usuario esta en la nueva tabla
    const usuarioNuevo = await prisma.users.findUnique({
        where: {
            documentNumber: id_usuario
        }
    })

    const response = {
        "documentNumber": id_usuario,
    }

    if (usuarioNuevo) {
        response["status"] = usuarioNuevo.status
    }

    return response

}

const obtenerTodosLosUsuariosConInteresEnComprar = async () => {
    const usuarios = await prisma.users.findMany({
        where:{
            wants_to_buy: true
        }
    })

    const response = usuarios.map((usuario) => {
        return {
            id: usuario.id,
            documentNumber: usuario.documentNumber,
            firstName: usuario.firstName,
            lastName: usuario.lastName,
            birthDate: usuario.birthDate,
            address: usuario.address,
            email: usuario.email,
            cellphone: usuario.cellphone,
            whatsapp: usuario.whatsapp,
            wants_to_buy: usuario.wants_to_buy,
            has_differences: usuario.has_differences,
            differences: usuario.differences
        }
    })

    return response
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
    eliminarImagenDeUnUsuario,
    agregarDiferencias,
    obtenerUsuarioNuevoYAntiguo,
    obtenerTodosLosUsuariosConDiferencias,
    verificarExistenciaDeUsuario,
    obtenerUsuariosParaSorteo,
    obtenerTodosLosUsuariosConInteresEnComprar
};
