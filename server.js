import express from "express";
import fileUpload from 'express-fileupload'
import { expressjwt } from "express-jwt";
import 'dotenv/config';
import { usersRouter } from "./routes/users.router.js";
import { filesRouter } from "./routes/files.router.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { errorTokenMiddleware } from "./middleware/errorToken.middleware.js";
import { ErrorRecursoNoEncontrado } from "./utils/error.js";
import { verificarUsuarioTokenMiddleware } from "./middleware/verificarUsuarioToken.middleware.js";

// Configuraciones
const app = express();
const PORT = 8080;

app.use(express.json()); // Middleware para parsear JSON
app.use('/uploads', express.static('uploads')); // Servir archivos estáticos (imágenes)

// Configuración de express-fileupload
app.use(fileUpload({
  createParentPath: true, // Crea el directorio 'uploads/' si no existe
}));

//Proteccion de rutas
app.use(
  expressjwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'] }).unless({ path: [
    { url: '/api/users/register', methods: ['POST'] },      // Registro (POST /usuarios)
    { url: '/api/users/login', methods: ['POST'] }          // Login (POST /usuarios/login)
  ]})
);

app.use(verificarUsuarioTokenMiddleware);

app.use("/api/users", usersRouter);
app.use("/api/files", filesRouter);

app.all("/{*ruta}", (req, res) => {
  const ruta = req.originalUrl;
  throw new ErrorRecursoNoEncontrado(`Endpoint (${req.method})${ruta} no encontrado`);
});

app.use(errorTokenMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server iniciado http://localhost:${PORT}.`);
});
