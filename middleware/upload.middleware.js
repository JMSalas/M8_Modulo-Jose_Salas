import { ErrorValidacion, ErrorTamañoArchivo } from "../utils/error.js";

const ALLOWED_MIMETYPE = ['image/jpeg','image/png','application/pdf','text/text'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB;

export const uploadMiddleware = (req, res, next) => {
    // Verificar si se subió un file en key 'archivo'
    // El error de límite de 5MB es manejado por express-fileupload en server.js
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        throw new ErrorValidacion('No se ha subido ningún archivo o el campo "archivo" está ausente.');
    }

    const archivo = req.files.archivo;

    // Obtener solo el MIME type base en caso que existan parametros agregados
    const mimeType = archivo.mimetype.split(';')[0].trim();
    
    // Validar tipo de archivo usando la variable global
    if (!ALLOWED_MIMETYPE.includes(mimeType)) {
        
        // Generar un mensaje de error listando los tipos permitidos
        const allowedTypes = ALLOWED_MIMETYPE.map(mimeType => mimeType.split('/')[1].toUpperCase()).join(', ');
        
        throw new ErrorValidacion(`Tipo de archivo no válido. Solo se permiten: ${allowedTypes}.`);
    }

    // Validar tamaño de archivo (JPEG o PNG)
    if (archivo.size > MAX_SIZE){
        const maxSizeMB = (MAX_SIZE / (1024 * 1024)).toFixed(2);
        throw new ErrorTamañoArchivo(`Tamaño archivo '${archivo.name}' excede el tamaño máximo (${maxSizeMB} MB)`);
    }

    next();
};