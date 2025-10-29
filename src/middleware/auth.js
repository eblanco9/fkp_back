import { verifyAndDecodeJWT } from "../utils/jwt.js";
import prisma from "../prisma-client.js";


export const authenticate = async(req, res, next) => {
    const bearer = req.headers.authorization;
    if(!bearer) {
        const error = new Error("Token no encontrado");
        return res.status(401).json({message: error.message});
    }

    const [, token] = bearer.split(" ");

    if(!token) {
        const error = new Error("Token no encontrado");
        return res.status(401).json({message: error.message});
    }

    try {
        const { id } = verifyAndDecodeJWT(token);
        
        const userAdmin = await prisma.userAdmin.findUnique({
            where:{
                id
            }
        })

        if(!userAdmin){
            return res.status(401).json({message: "Token no valido"});
        }

        const { id: userAdminId, role } = userAdmin;
        
        req.userAdminId = userAdminId;
        req.userAdminRole = role;
        return next();
    } catch (error) {
       return res.status(500).json({message: "Token no valido"})
    }
}
