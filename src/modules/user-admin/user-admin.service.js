import prisma from "../../prisma-client.js";
import { hashPassword } from "../../utils/auth.js";


const crearUserAdmin = async (datos) => {
    const {username, email, password, role} = datos
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