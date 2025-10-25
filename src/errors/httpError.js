class HttpError extends Error {
    constructor(statusCode, message, content = null) {
        super(message);
        this.status = statusCode;
        this.content = content;
    }

    // 400 - Bad Request
    static badRequest(message = 'Solicitud incorrecta', data = null) {
        return new HttpError(400, message, data);
    }

    // 401 - Unauthorized
    static unauthorized(message = 'No autorizado', data = null) {
        return new HttpError(401, message, data);
    }

    // 403 - Forbidden
    static forbidden(message = 'Acceso prohibido', data = null) {
        return new HttpError(403, message, data);
    }

    // 404 - Not Found
    static notFound(message = 'Recurso no encontrado', data = null) {
        return new HttpError(404, message, data);
    }

    // 409 - Conflict
    static conflict(message = 'Conflicto', data = null) {
        return new HttpError(409, message, data);
    }

    // 500 - Internal Server Error
    static internal(message = 'Error interno del servidor', data = null) {
        return new HttpError(500, message, data);
    }
}

export default HttpError;
