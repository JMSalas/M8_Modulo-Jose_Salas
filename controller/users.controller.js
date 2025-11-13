import { fileURLToPath } from "url";
import path from "path";
import { hash } from "bcryptjs";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { writeLocalFile } from "../utils/fileUtils.js";
import { generarID } from "../utils/generarId.js";

const __filename = fileURLToPath(import.meta.url);
const DATABASE_LOCAL_PATH = 'database/usuarios.json';
const DATABASE_FULL_PATH = path.join(path.dirname(__filename), '..' , DATABASE_LOCAL_PATH);

// --- Funcionalidades Base (Registro y Login) ---
export const registrarUsuario = async(req, res) => {
    const { email, nombre, password } = req.body;
    const usuarios = req.usuarios;

    const hashedPassword = await hash(password, 10);
    const newId = generarID(usuarios);

    usuarios.push({
        id : newId,
        email : email,
        nombre: nombre,
        password : hashedPassword,
    });
    
    await writeLocalFile(DATABASE_FULL_PATH, usuarios );
    
    res.status(201).json({mensaje:"Usuario registrado exitosamente"});    
}

export const iniciarSesionUsuario = async (req, res) => {
    // El usuario fue validado y adjuntado en validacionLoginMiddleware
    const usuario = req.usuarioAutenticado;
    
    // Generar Token con el 'id' y 'email'
    const token = jwt.sign({ id: usuario.id },process.env.SECRET_KEY,{ expiresIn: '1h' });
    
    return res.status(200).json({ 
        mensaje: `Sesión usuario '${usuario.email}' iniciada exitosamente.`, 
        id: usuario.id, // Devolver la ID para que el cliente la use en las rutas :id
        token: token
    });
}

// --- Funcionalidades CRUD ---
export const mostrarUsuario = async (req, res) => {
    const usuarioEncontrado = req.usuarios[req.index];
    
    delete usuarioEncontrado.password; 
    res.status(200).json({ usuario: usuarioEncontrado });
}

export const actualizarUsuario = async (req, res) => {
    const id = req.params.id;
    const { email, nombre, password } = req.body;
    const usuarioActualizar = req.usuarios[req.index];

    Object.assign(usuarioActualizar, { email:email, nombre:nombre });
    usuarioActualizar.password = await hash(password, 10);
    
    await writeLocalFile(DATABASE_FULL_PATH, req.usuarios);
    
    res.status(200).json({ 
        mensaje: `Usuario con ID ${id} actualizado exitosamente.`
    });
};

export const eliminarUsuario = async(req, res) => {
    const id = req.params.id;
    const indexEliminar = req.index;
    const usuarios = req.usuarios;

    usuarios.splice(indexEliminar,1);

    // Guardar la nueva lista de usuarios
    await writeLocalFile(DATABASE_FULL_PATH, usuarios);

    res.status(200).json({ mensaje: `Perfil de usuario ${id} eliminado exitosamente.` });
}