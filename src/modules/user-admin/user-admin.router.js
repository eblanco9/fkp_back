import userAdminController from "./user-admin.controller.js";
import { Router } from 'express';
import { crearUserAdminSchema } from './user-admin.schema.js'
import { validateRequest } from '../../middleware/validateRequestHandle.js';
import { authenticate } from "../../middleware/auth.js";
import { checkPermissionByRoles } from "../../middleware/checkPermission.js";
const router = Router();

router.use(authenticate)
router.use(checkPermissionByRoles(["superAdmin"]))

router.post(
    '/',
    validateRequest(crearUserAdminSchema),
    userAdminController.crearUserAdmin
);

export default router;