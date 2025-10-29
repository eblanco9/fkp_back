import jwt  from "jsonwebtoken";

export const generateJWT = (payload) =>{
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
    return token
}

export const verifyAndDecodeJWT = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)

}
