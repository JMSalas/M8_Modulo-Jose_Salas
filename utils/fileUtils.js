import { readFile, writeFile } from 'fs/promises';
import { ErrorServidor } from './error.js';

export const readLocalFile = async (path) => {
    try {
        const content = await readFile(path, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        // Se devuelve 'null' para indicar que la operación falló de forma controlada
        throw new ErrorServidor(`No se pudo leer el archivo de la ruta ${path}`);
    }
};

export const writeLocalFile = async (path, data) => {
    try {
        await writeFile(path, JSON.stringify(data, null, 2));   
        return true; 
    } catch (error) {
        // Manejo de errores (por ejemplo, ruta inválida o permisos insuficientes)
        throw new ErrorServidor(`No se pudo escribir en el archivo de la ruta ${path}`);
    }
};
