import { loginSchema } from "./auth.schema.js";
import authService from "./auth.service.js";

const login = async (req, res,next) => {
    try {
        const body = loginSchema.body.parse(req.body);
        const result = await authService.login(body.username, body.password);
        return res.json(result);
    } catch (error) {
        next(error)
    }
}

export default { login }
