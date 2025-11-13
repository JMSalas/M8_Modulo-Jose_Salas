import { ErrorValidacion } from "./error.js";

export const validarBody = (usuario) => {
    // Verificar si se ha ingresado informacion de usuario existe
    if (!usuario || typeof usuario !== 'object') {
        throw new ErrorValidacion("No se ha ingresado información de usuario en el body de la solicitud");
    }
}

export const validarCorreo = (email) => {
    // Verificar propiedad 'email' existe y es string
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
        throw new ErrorValidacion("El correo del usuario es obligatorio o no es un string.");
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(!regexCorreo.test(email)){
        throw new ErrorValidacion("El correo ingresado no tiene un formato válido");
    }
}

export const validarNombre = (nombre) => {
    // Verificar propiedad 'nombre' existe y es string
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        throw new ErrorValidacion("El nombre del usuario es obligatorio o no es un string.");
    }
}

export const validarPassword = (password) => {
    // Verificar propiedad 'email' existe y es string
    if (!password || typeof password !== 'string' || password.trim().length === 0) {
        throw new ErrorValidacion("El password del usuario es obligatorio o no es un string.");
    }
}