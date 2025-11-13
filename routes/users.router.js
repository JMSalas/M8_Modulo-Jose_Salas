import { Router } from "express";
import { verificarIdMiddleware } from "../middleware/verificarId.middleware.js";
import * as mdw from "../middleware/validacion.middleware.js"
import * as controller from "../controller/users.controller.js";

export const usersRouter = Router();

usersRouter.route('/register')
    .post(mdw.validacionRegistroUsuario, controller.registrarUsuario);

usersRouter.route('/login')
    .post(mdw.validacionLoginUsuario, controller.iniciarSesionUsuario)    

usersRouter.route('/:id')
    .get(verificarIdMiddleware, controller.mostrarUsuario)
    .put(verificarIdMiddleware, mdw.validacionActualizarUsuario,controller.actualizarUsuario)
    .delete(verificarIdMiddleware, controller.eliminarUsuario);
