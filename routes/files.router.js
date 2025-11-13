import { Router } from "express";
import { uploadMiddleware } from "../middleware/upload.middleware.js";
import { subirArchivo } from "../controller/files.controller.js";

export const filesRouter = Router();

filesRouter.route('/upload')
    .post(uploadMiddleware, subirArchivo);