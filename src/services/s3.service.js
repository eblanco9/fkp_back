import {
    DeleteObjectCommand,
    HeadObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import HttpError from '../errors/httpError.js';
import path from "path";


const getS3Config = () => {
    return {
        bucket: process.env.AWS_BUCKET_NAME,
        bucketUrl: process.env.AWS_BUCKET_URL,
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };

};

const uploadToS3 = async (buffer, filename, mimetype, modulo, dni) => {
    try {
        const { bucket, bucketUrl, region, accessKeyId, secretAccessKey } = getS3Config();

        const s3 = new S3Client({
            region,
            credentials: { accessKeyId, secretAccessKey },
        });

        const folder = dni ? `${modulo}/${dni}` : `${modulo}`;

        const key = `${folder}/${filename}`;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
            ACL: "public-read",
        });

        await s3.send(command);

        return {
            url: `${bucketUrl}/${key}`,
            key,
        };
    } catch (error) {
        console.error("Error al subir archivo a S3:", error);
        throw HttpError.internal();
    }
};

const getFilesToS3 = async ( modulo, dni) => {
    try {
        const { bucket, bucketUrl, region, accessKeyId, secretAccessKey } = getS3Config();

        const s3 = new S3Client({
            region,
            credentials: { accessKeyId, secretAccessKey },
        });

        const folder = dni ? `${modulo}/${dni}` : `${modulo}`;

        const command = new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: folder,
        });

        const respuesta = await s3.send(command);
        const archivos = respuesta.Contents || [];

        return archivos.map((archivo) => ({
            key: archivo.Key,
            name: path.basename(archivo.Key),
            url: `${bucketUrl}/${archivo.Key}`,
            size: archivo.Size,
            lastModified: archivo.LastModified,
        }));
    } catch (error) {
        console.error("Error al obtener archivos de S3:", error);
        throw HttpError.internal()
    }
};

const deleteFromS3 = async (key) => {
    try {
        const { bucket, region, accessKeyId, secretAccessKey } = getS3Config();

        const s3 = new S3Client({
            region,
            credentials: { accessKeyId, secretAccessKey },
        });

        // Verificar si el archivo existe antes de eliminarlo
        try {
            const headCommand = new HeadObjectCommand({
                Bucket: bucket,
                Key: key,
            });
            await s3.send(headCommand);
        } catch (headError) {
            // Si el archivo no existe (404), lanzar error
            if (headError.name === "NotFound" || headError.$metadata?.httpStatusCode === 404) {
                throw HttpError.notFound("El archivo no existe en S3");
            }
            // Si es otro error, propagarlo
            throw headError;
        }

        // Si llegamos aquí, el archivo existe, procedemos a eliminarlo
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        await s3.send(deleteCommand);

        return {
            message: "Archivo eliminado exitosamente",
            key,
        };
    } catch (error) {
        // Si ya es un error customizado (404), propagarlo
        if (error.statusCode === 404) {
            throw error;
        }
        console.error("Error al eliminar archivo de S3:", error);
        throw HttpError.internal();
    }
};

export default { uploadToS3, getFilesToS3, deleteFromS3 };
