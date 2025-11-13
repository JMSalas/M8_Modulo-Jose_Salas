import path from "path";
import { fileURLToPath } from "url";
import { readLocalFile } from "./fileUtils.js";

const __filename = fileURLToPath(import.meta.url);
const DATABASE_LOCAL_PATH = 'database/usuarios.json';
const DATABASE_FULL_PATH = path.join(path.dirname(__filename), '..' , DATABASE_LOCAL_PATH);

export const buscarUsuario = async(atributo, valor) => {
    const usuarios = await readLocalFile(DATABASE_FULL_PATH);
    const index = usuarios.findIndex(usuario => usuario[atributo] === valor);

    return [index, usuarios];
}