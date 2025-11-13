import { ErrorAutenticacion } from "../utils/error.js";

export const verificarIdMiddleware = (req, res, next) => {
    // req.auth.id es inyectado por express-jwt (payload modificado)
    const tokenId = req.auth.id;
    const requestedId = req.params.id;
    
    if (tokenId !== requestedId) {
        throw new ErrorAutenticacion("Acceso denegado: No está autorizado para gestionar este perfil.");
    }
    
    next();
};