export const errorHandler = (err, req, res, next) => {
    console.log(err)
    const status = err.status || 500;
    const message = status === 500 ? 'Error interno del servidor' : err.message;
    res.status(status).json({ code: status, message: message });
};
