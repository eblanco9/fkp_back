export const checkPermissionByRoles = (roles) => {
    return (req, res, next) => {
        const userAdminRole = req.userAdminRole;
        console.log(userAdminRole)
        const includesRole = roles.includes(userAdminRole);
        if (includesRole) {
            next();
        } else {
            res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
        }
    }
}