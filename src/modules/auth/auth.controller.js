import { loginSchema } from "./auth.schema.js";
import authService from "./auth.service.js";

const login = async (req, res,next) => {
    try {
        const body = loginSchema.body.parse(req.body);
        const token = await authService.login(body.username, body.password);
        return res.json({token: token});
    } catch (error) {
        next(error)
    }
}

export default { login }
