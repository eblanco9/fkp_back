import HttpError from '../../errors/httpError.js';
import prisma from '../../prisma-client.js';
import { checkPassword } from '../../utils/auth.js';
import { generateJWT } from '../../utils/jwt.js';

const login = async (username, password) => {
    const userAdmin = await prisma.userAdmin.findUnique({
        where: {
            username: username
        }
    })

    if(!userAdmin){
        throw HttpError.notFound("No se encontro el usuario");
    }

    //check password
    const isPasswordCorrect = await checkPassword(password, userAdmin.password);
    if (!isPasswordCorrect) {
        throw HttpError.unauthorized("Contraseña incorrecta");
    }

    const token = generateJWT({
        id: userAdmin.id
    }); 
    
    return token

}

export default { 
    login 
}