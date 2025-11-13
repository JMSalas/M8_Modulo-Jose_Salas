import { fileURLToPath } from "url";
import path from "path";
import 'dotenv/config';
import { ErrorServidor } from '../utils/error.js';

const __filename = fileURLToPath(import.meta.url);
const UPLOADS_DIR = path.join(path.dirname(__filename), '..', 'uploads');

// Manejo Archivos
export const subirArchivo = async (req, res) => {
    try{
        const archivo = req.files.archivo;
        const id = req.auth.id

        // Generar nombre de archivo único
        // Agregar fecha actual en milisegundos entre el nombre y extension del archivo
        const extension = path.extname(archivo.name);
        const nombreArchivo = `${path.basename(archivo.name, extension)}-${id}-${Date.now()}${extension}`;
        const rutaCompleta = path.join(UPLOADS_DIR, nombreArchivo);
        const archivoUrl = `/uploads/${nombreArchivo}`; // URL pública para servir

        // Mover el archivo al directorio uploads
        await archivo.mv(rutaCompleta);

        res.status(200).json({ 
            mensaje: "Archivo subido exitosamente.", 
            archivoUrl: archivoUrl 
        });    
    } catch(error) {
        throw new ErrorServidor("Error interno al guardar el archivo.");
    }
};