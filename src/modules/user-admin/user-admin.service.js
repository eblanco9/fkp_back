import prisma from "../../prisma-client.js";
import HttpError from "../../errors/httpError.js";
import { hashPassword } from "../../utils/auth.js";


const crearUserAdmin = async (datos) => {
    const {username, email, password, role} = datos

    // verificar si el usuario ya existe
    const userAdmin = await prisma.userAdmin.findFirst({
        where: {
            OR: [
                { username: username },
                { mail: email }
            ]
        }
    })

    if(userAdmin) {
        throw HttpError.conflict("El usuario ya existe (username o email)");
    }
    const passwordHash = await hashPassword(password);
    const user = await prisma.userAdmin.create({
        data: {
            username,
            mail: email,
            password: passwordHash,
            role
        }
    })
    const  {password: _, ...resto} = user
    return resto;
};

export default { 
    crearUserAdmin 
};