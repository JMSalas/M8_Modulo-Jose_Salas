import { buscarUsuario } from "../utils/buscarUsuario.js";
import { ErrorAutenticacion } from "../utils/error.js";

export const verificarUsuarioTokenMiddleware = async (req, res, next) => {
    // Verifica si express-jwt inyectó el payload (req.auth) ruta protegida
    if (!req.auth || !req.auth.id) {
        // La ruta fue saltada por .unless() o el token falló en express-jwt (manejado por errorTokenMiddleware)
        // Continuar al siguiente middleware/router sin hacer la verificación de DB.
        return next();
    }

    // req.auth.id es inyectado por express-jwt (payload)
    const tokenId = req.auth.id;

    // Buscar el usuario por su ID
    const [index, usuarios] = await buscarUsuario('id', tokenId); 

    // Si el índice es -1, significa que el usuario fue eliminado
    if (index === -1) {
        // Lanzar Error para revocar el token
        throw new ErrorAutenticacion("Acceso denegado: El usuario asociado al token ya no existe.");
    }
    
    // Adjuntar req.index y req.usuarios si la ruta es de usuario (ej: /api/users/X).
    // req.originalUrl porque contiene la ruta completa (/api/users/...)
    if (req.originalUrl.startsWith('/api/users/')) {
        req.index = index;
        req.usuarios = usuarios; 
    }

    next();
};