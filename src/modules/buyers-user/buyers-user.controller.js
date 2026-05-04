import buyersUserService from "./buyers-user.service.js";

const agregarUsuarioComprador = async (req, res, next) => {
    const compensations = [];
    try {
        const archivos_user = req.parsedFiles.user;
        const archivos_fam = req.parsedFiles.families || {};

        const documentos_user = [];
        const documentos_fam = [];
        //por todos los archivos del user
        Object.entries(archivos_user).forEach(([docType, files]) => {
            //por cada tipo de documento (extracto bancario, recibo de sueldo, declaracion empleador)
            documentos_user[docType] = [];
            files.forEach(file => {
                //por cada archivo, agregar logica de agregar y eliminar
                // const result = buyersUserService.agregarArchivoDelUsuarioDelComprador(file);
                // compensations.push(() => buyersUserService.eliminarArchivoDelUsuarioDelComprador(result.key))
                //aca guardar el link del archivo
                documentos_user[docType].push(file.fieldname);
            });
        });
        //por todos los archivos del familiar
        Object.entries(archivos_fam).forEach(([familyId, files]) => {
            const documentos_fam_family = {};
            Object.entries(files).forEach(([docType, files]) => {
                documentos_fam_family[docType] = [];
                files.forEach(file => {
                    // const result = buyersUserService.agregarArchivoDelFamiliarDelComprador(file);
                    // compensations.push(() => buyersUserService.eliminarArchivoDelFamiliarDelComprador(result.key))
                    //aca guardar el link del archivo
                    documentos_fam_family[docType].push(file.fieldname);
                });
            })
            documentos_fam.push(documentos_fam_family);
            
        });


        console.log("archivos subidos del user")
        console.log(documentos_user)
        console.log("archivos subidos de los familiares")
        console.log(documentos_fam)
        
        //falta agregar las url de los archivos
        //para los datos de comprador
        //para el usuario es facil para familiar, hay que agregarlo en orden



        const user = await buyersUserService.agregarUsuarioComprador();
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



export default { agregarUsuarioComprador };