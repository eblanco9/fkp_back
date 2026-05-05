
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
        families: datos.familiares,
        documents: datos.documentos
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

export default { 
    agregarUsuarioComprador, 
    agregarArchivoDelUsuarioDelComprador, 
    eliminarArchivoDelUsuarioDelComprador,
    agregarArchivoAlFamiliarDelUsuarioDelComprador,
    eliminarArchivoDelFamiliarDelComprador
}