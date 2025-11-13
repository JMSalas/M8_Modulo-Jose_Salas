// Middleware de manejo de errores
export const errorTokenMiddleware = (err, req, res, next) => {
    // Verificar si el error es de express-jwt
    if (err.name === 'UnauthorizedError') {
        err.statusCode = 401;
        err.message = 'Token no válido o no proporcionado.';
    }

    // Otros errores
    next(err);
}