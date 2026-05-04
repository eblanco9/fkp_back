
import HttpError from '../../errors/httpError.js';
import prisma from '../../prisma-client.js';
import s3Service from '../../services/s3.service.js';

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

    //estructura que recibo del controller
    const dato_prueba = {
        "persona": {
            "nombre": "Juan Perez",
            "fechaNacimiento": "1990-05-10",
            "direccion": "Calle 123",
            "cribNumber": "12345",
            "telefono": "1122334455",
            "email": "juan@email.com",
            "viveConOtraPersona": true,
        },
        "documentos": [
            {
                "tipo": "declaracion_empleador",
                "archivos": ["url_o_id_archivo"]
            },
            {
                "tipo": "recibo_sueldo",
                "archivos": ["url1", "url2", "url3"]
            },
            {
                "tipo": "extracto_bancario",
                "archivos": ["url1", "url2", "url3"]
            }
        ],
        "familiares": [
            {
                "nombre": "Maria Perez",
                "fechaNacimiento": "1992-08-15",
                "esHijoMenor21": false,
                "documentos": [
                    {
                        "tipo": "recibo_sueldo",
                        "archivos": ["url1", "url2", "url3"]
                    },
                    {
                        "tipo": "extracto_bancario",
                        "archivos": ["url1", "url2", "url3"]
                    }
                ]
            },
            {
                "nombre": "una prueba",
                "fechaNacimiento": "2020-02-02",
                "esHijoMenor21": false,
                "documentos": [
                    {
                        "tipo": "acta_nacimiento",
                        "archivos": ["url1"]
                    },
                    {
                        "tipo": "declaracion_escuela",
                        "archivos": ["url1"]
                    }
                ]
            }
        ],

    }

    const buyerUserData = extractBuyerUserData(dato_prueba);

    const data =  {
        ...buyerUserData,
        families: dato_prueba.familiares,
        documents: dato_prueba.documentos
    }
    console.log(data)

    return data

    // const user = await prisma.buyerUser.create({ data });

    // return user
}

const agregarArchivoDelUsuarioDelComprador = async ( nro_documento, file) => {
    const tipo_de_archivo = obtenerExtensionArchivo(file)
    const nombre_archivo = `${nro_documento}-${crypto.randomUUID()}-${file.fieldname}.${tipo_de_archivo}`
    return await s3Service.uploadFileToS3Generic(
        file.buffer,
        nombre_archivo,
        file.mimetype,
        `buyers-user`
    )
}

// const agregarArchivoAlFamiliarDelUsuarioDelComprador = async ( nro_documento, file) => {
//     const tipo_de_archivo = obtenerExtensionArchivo(file)
//     const nombre_archivo = `${nro_documento}-${crypto.randomUUID()}-${file.fieldname}.${tipo_de_archivo}`
//     return await s3Service.uploadFileToS3Generic(
//         file.buffer,
//         nombre_archivo,
//         file.mimetype,
//         `buyers-user`
//     )
// }

const eliminarArchivoDelUsuarioDelComprador = async (key) => {
    await s3Service.deleteFromS3(key)
}

export default { agregarUsuarioComprador, agregarArchivoDelUsuarioDelComprador, eliminarArchivoDelUsuarioDelComprador }