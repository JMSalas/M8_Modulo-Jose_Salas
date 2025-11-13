import { compare } from "bcryptjs";
import { buscarUsuario } from "../utils/buscarUsuario.js";
import { ErrorRegistro, ErrorAutenticacion } from "../utils/error.js";
import * as Validadores from "../utils/validadores.js"

export const validacionRegistroUsuario = async(req,res,next) => {
    Validadores.validarBody(req.body);

    const { email, nombre, password } = req.body;
        
    Validadores.validarCorreo(email);
    Validadores.validarNombre(nombre)
    Validadores.validarPassword(password);
    
    const [index, usuarios]= await buscarUsuario('email', email);

    if (index !== -1)
        throw new ErrorRegistro("Usuario ya registrado");

    req.usuarios = usuarios;
    next();
}

const autenticarUsuario = async (email, password) => {
    const [index, usuarios] = await buscarUsuario('email',email);

    if (index === -1)
        throw new ErrorAutenticacion("Credenciales Acceso Inválidas");

    const passwordIsValid = await compare(password, usuarios[index].password);
        
    if (!passwordIsValid)
        throw new ErrorAutenticacion("Credenciales Acceso Inválidas");

    return usuarios[index];
}

export const validacionLoginUsuario = async(req,res,next) => {
    Validadores.validarBody(req.body);
        
    const { email, password } = req.body;
        
    Validadores.validarCorreo(email);
    Validadores.validarPassword(password);
    
    const usuarioAutenticado = await autenticarUsuario(email, password);
    
    // Adjuntar el objeto completo del usuario para que el controlador pueda obtener el ID
    req.usuarioAutenticado = usuarioAutenticado;
    next();
}

export const validacionActualizarUsuario = async(req,res,next) => {
    // Actualización Total exije que esten presentes todos los valores actualizables
    Validadores.validarBody(req.body);

    const { email, nombre, password } = req.body;
    
    const idUsuarioActual = req.auth.id;

    Validadores.validarCorreo(email);

    // Comprobar unicidad del nuevo email
    const [index, usuarios] = await buscarUsuario('email', email);
        
    // Si el email ya existe (index !== -1) y si el usuario encontrado NO es el usuario actual (usando ID del token)
    if (index !== -1 && usuarios[index].id !== idUsuarioActual) {
        throw new ErrorRegistro("El correo ya está registrado por otro usuario.");
    }

    Validadores.validarNombre(nombre)
    Validadores.validarPassword(password);

    next();
}