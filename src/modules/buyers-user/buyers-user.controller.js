import { enviarEmailDeAprobacionUsuarioComprador, enviarEmailDeRechazoUsuarioComprador } from "../../services/email.service.js";
import buyersUserService from "./buyers-user.service.js";

const agregarUsuarioComprador = async (req, res, next) => {
    const compensations = [];
    try {
        const archivos_user = req.parsedFiles.user;
        const data = JSON.parse(req.body.payload);

        const crib_number = data?.persona?.cribNumber;
        if(!crib_number){
            return res.status(400).json({ message: "cribNumber es requerido" });
        }
        const archivos_fam = req.parsedFiles.families || {};

        const documentos_user = {};
        const documentos_fam = [];
        //por todos los archivos del user
        for (const [docType, files] of Object.entries(archivos_user)) {
            documentos_user[docType] = [];

            for (const file of files) {
                const result = await buyersUserService.agregarArchivoDelUsuarioDelComprador(
                    crib_number,
                    file
                );

                compensations.push(() =>
                    buyersUserService.eliminarArchivoDelUsuarioDelComprador(result.key)
                );

                documentos_user[docType].push(result.url);
            }
        }
        //por todos los archivos del familiar
        for (const [familyId, files] of Object.entries(archivos_fam || {})) {
            const documentos_fam_family = {};

            for (const [docType, docs] of Object.entries(files)) {
                documentos_fam_family[docType] = [];

                for (const file of docs) {
                    // Si luego querés subir archivos acá, este es el lugar correcto:
                    const result = await buyersUserService.agregarArchivoAlFamiliarDelUsuarioDelComprador(crib_number,file);
                    compensations.push(() => buyersUserService.eliminarArchivoDelFamiliarDelComprador(result.key));

                    documentos_fam_family[docType].push(result.url);
                }
            }

            documentos_fam.push(documentos_fam_family);
        }
        //agrego los archivos del user a la data

        data.documents = documentos_user;
        
        //agrego los archivos de los familiares a la data
        //lo agrego segun el orden que llego

        data.familiares = data?.familiares?.map((fam, index) => ({
            ...fam,
            documents: documentos_fam[index] || []
        }));


        const user = await buyersUserService.agregarUsuarioComprador(data);
        res.status(201).json(user);
    } catch (error) {
        //si falla alguna de las acciones, se ejecutan las compensaciones (como un rollback)
        //a futuro crear una funcion para esto
        try {
            for (const compensation of compensations.reverse()) {
                console.log("ejecuto compensacion")
                await compensation();
                console.log("fin de compensacion")
            }
        } catch (error) {
            console.log(error)
        }
        next(error)
    }
};

const obtenerUsuariosCompradores = async (req, res, next) => {
    try {
        const data = await buyersUserService.obtenerUsuariosCompradores(req.query);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const obtenerUsuarioCompradorPorCribNumber = async (req, res, next) => {
    try {
        const data = await buyersUserService.obtenerUsuarioCompradorPorCribNumber(req.params.crib_number);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const aprobarUsuarioComprador = async (req, res, next) => {
    try {
        const id_usuario = req.params.crib_number;
        const usuario = await buyersUserService.obtenerUsuarioCompradorPorCribNumber(id_usuario);
        // intento enviar email
        await enviarEmailDeAprobacionUsuarioComprador(usuario.email, usuario.full_name)

        const result = await buyersUserService.aprobarUsuarioComprador(id_usuario);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const rechazarUsuarioComprador = async (req, res, next) => {
    try {
        const id_usuario = req.params.crib_number;
        const body =  req.body
        const usuario = await buyersUserService.obtenerUsuarioCompradorPorCribNumber(id_usuario);
        // intento enviar email
        await enviarEmailDeRechazoUsuarioComprador(usuario.email, usuario.full_name, body.motivo)
        
        const result = await buyersUserService.rechazarUsuarioComprador(id_usuario);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const obtenerCantidadDeUsuariosPorEstado = async (req, res, next) => {
    try {
        const data = await buyersUserService.obtenerCantidadDeUsuariosPorEstado();
        res.json(data);
    } catch (error) {
        next(error);
    }
};


export default { 
    agregarUsuarioComprador,
    obtenerUsuariosCompradores,
    obtenerUsuarioCompradorPorCribNumber,
    aprobarUsuarioComprador,
    rechazarUsuarioComprador,
    obtenerCantidadDeUsuariosPorEstado

};