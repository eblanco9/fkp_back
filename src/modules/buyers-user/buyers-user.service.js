
import { es } from 'zod/locales';
import HttpError from '../../errors/httpError.js';
import prisma from '../../prisma-client.js';
import s3Service from '../../services/s3.service.js';
import { obtenerExtensionArchivo } from '../../utils/archivo.js';

function extractBuyerUserData(payload) {
  const { persona, ...rest } = payload;

  return {
    full_name: persona.nombre,
    date_of_birth: new Date(persona.fechaNacimiento).toISOString(),
    address: persona.direccion,
    phone: persona.telefono,
    email: persona.email,
    lives_with_someone: persona.viveConOtraPersona,
    crib_number: persona.cribNumber,
  };
}

const agregarUsuarioComprador = async (datos) => {

    const buyerUserData = extractBuyerUserData(datos);

    

    const finalData =  {
        ...buyerUserData,
        status: "pending",
        families: datos.familiares,
        documents: datos.documents
    }

    const user = await prisma.buyerUser.create({ data: finalData });

    return user
}

const agregarArchivoDelUsuarioDelComprador = async ( crib_number, file) => {
    const tipo_de_archivo = obtenerExtensionArchivo(file)
    const nombre_archivo = `${crib_number}-${crypto.randomUUID()}-${file.fieldname}.${tipo_de_archivo}`
    return await s3Service.uploadFileToS3Generic(
        file.buffer,
        nombre_archivo,
        file.mimetype,
        `buyers-user/${crib_number}`
    )
}

const agregarArchivoAlFamiliarDelUsuarioDelComprador = async ( crib_number, file) => {
    const tipo_de_archivo = obtenerExtensionArchivo(file)
    const nombre_archivo = `${crib_number}-${crypto.randomUUID()}-${file.fieldname}.${tipo_de_archivo}`
    return await s3Service.uploadFileToS3Generic(
        file.buffer,
        nombre_archivo,
        file.mimetype,
        `buyers-user/${crib_number}`
    )
}

const eliminarArchivoDelUsuarioDelComprador = async (key) => {
    await s3Service.deleteFromS3(key)
}

const eliminarArchivoDelFamiliarDelComprador = async (key) => {
    await s3Service.deleteFromS3(key)
}

const obtenerUsuariosCompradores = async (query) => {
    const { page = 1, limit = 10, estado } = query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    let where = {};

    // filtro por estado si viene en query
    if (estado) {
        where.status = estado.trim().toLowerCase();
    }

    const usuarios = await prisma.buyerUser.findMany({
        where,
        select: {
            id: true,
            full_name: true,
            date_of_birth: true,
            address: true,
            phone: true,
            email: true,
            lives_with_someone: true,
            crib_number: true
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: "desc" }
    });

    const total = await prisma.buyerUser.count({
        where
    });

    return {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        usuarios
    };
};

const obtenerUsuarioCompradorPorId = async (id) => {
    const user = await prisma.buyerUser.findUnique({
        where: {
            id: Number(id)
        }
    })
    if (!user) {
        throw new HttpError(404, "No se encontro el usuario")
    }
    
    return user
    
}

const obtenerUsuarioCompradorPorCribNumber = async (crib_number) => {
    const user = await prisma.buyerUser.findFirst({
        where: {
            crib_number
        }
    })
    if (!user) {
        throw new HttpError(404, "No se encontro el usuario")
    }
    
    return user
    
}

const aprobarUsuarioComprador = async (id_usuario) => {
    const usuario = await obtenerUsuarioCompradorPorCribNumber(id_usuario)
    const usuarioActualizado = await prisma.buyerUser.update({
        where: {
            crib_number: id_usuario
        },
        data: {
            status: "approved"
        }
    })
    return usuarioActualizado
}

const obtenerCantidadDeUsuariosPorEstado = async () => {
    const usuariosPorEstado = await prisma.buyerUser.groupBy({
        by: ['status'],
        _count: {
            status: true
        }
    });

    // estados base (los que querés siempre)
    const resultado = {
        pending: 0,
        approved: 0,
        rejected: 0
    };

    usuariosPorEstado.forEach(item => {
        resultado[item.status] = item._count.status;
    });

    return resultado;
};

const rechazarUsuarioComprador = async (id_usuario) => {
    const usuario = await obtenerUsuarioCompradorPorCribNumber(id_usuario)
    const usuarioActualizado = await prisma.buyerUser.update({
        where: {
            crib_number: id_usuario
        },
        data: {
            status: "rejected"
        }
    })
    return usuarioActualizado
}



export default { 
    agregarUsuarioComprador, 
    agregarArchivoDelUsuarioDelComprador, 
    eliminarArchivoDelUsuarioDelComprador,
    agregarArchivoAlFamiliarDelUsuarioDelComprador,
    eliminarArchivoDelFamiliarDelComprador,
    obtenerUsuariosCompradores,
    obtenerUsuarioCompradorPorCribNumber,
    aprobarUsuarioComprador,
    rechazarUsuarioComprador,
    obtenerCantidadDeUsuariosPorEstado
}