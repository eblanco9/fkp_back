import { crearUserAdminSchema } from "./user-admin.schema.js";
import userAdminService from "./user-admin.service.js";

const crearUserAdmin = async (req, res, next) => {
    try {
        const body = crearUserAdminSchema.body.parse(req.body);
        const user = await userAdminService.crearUserAdmin(body);
        res.status(201).json(user);
    } catch (error) {
        next(error)
    }
};

export default {
    crearUserAdmin,
};