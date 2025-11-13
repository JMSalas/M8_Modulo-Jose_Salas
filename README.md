# API RESTful: Gestión de Usuarios y Archivos

## Descripción del Proyecto

Este proyecto es una API RESTful desarrollada con **Node.js y Express** que ofrece servicios de **autenticación** (Registro y Login) y gestión de recursos, incluyendo un **CRUD básico para usuarios** y un servicio de **subida de archivos**.

La API está protegida mediante **JSON Web Tokens (JWT)**, utilizando *middleware* personalizado para la validación y el manejo de errores HTTP apropiados.

## Tecnologías Utilizadas

  * **Node.js & Express:** Framework principal para el servidor.
  * **express-jwt:** Middleware para la protección de rutas mediante JWT.
  * **express-fileupload:** Middleware para manejar la carga de archivos.
  * **bcryptjs:** Librería para el *hashing* seguro de contraseñas.
  * **jsonwebtoken:** Para la creación de JSON Web Tokens (JWT).
  * **dotenv:** Para la gestión de variables de entorno.
  * **Simulación de Base de Datos:** Se utiliza un archivo local (`database/usuarios.json`) simulando una base de datos.

## Instalación y Ejecución

Sigue estos pasos para configurar y ejecutar la aplicación localmente:

### 1\. Clona el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2\. Variables de Entorno

Crea un archivo llamado **`.env`** en la raíz del proyecto y añade la siguiente variable. Asegúrate de reemplazar el valor con una clave secreta fuerte:

```env
SECRET_KEY=%Clave_Secreta_Fuerte_Aqui%
```

### 3\. Instalación de Dependencias

Ejecuta el siguiente comando para instalar todas las dependencias del proyecto:

```bash
npm install
```

### 4\. Ejecución del Servidor

Inicia el servidor en modo desarrollo. La API se ejecutará en el puerto `8080`.

```bash
npm start # O el comando definido en package.json (e.g., node server.js)
```

## Estructura del Proyecto

```
.
├── controller/
│   ├── files.controller.js       # Lógica para manejo de archivos
│   └── users.controller.js       # Lógica de autenticación y CRUD de usuarios
├── middleware/
│   ├── error.middleware.js       # Manejador de errores final
│   ├── errorToken.middleware.js  # Maneja errores de JWT (UnauthorizedError)
│   ├── upload.middleware.js      # Validación de tipo y tamaño de archivo
│   ├── validacion.middleware.js  # Validación de datos de usuario (registro/login/update)
│   ├── verificarId.middleware.js # Asegura que el usuario solo acceda a su propio perfil
│   └── verificarUsuarioToken.middleware.js # Verifica que el ID del token exista en la DB
├── routes/
│   ├── files.router.js           # Rutas para archivos (/api/files)
│   └── users.router.js           # Rutas para usuarios (/api/users)
├── utils/
│   ├── buscarUsuario.js          # Utilidad para simular consultas a la 'DB'
│   ├── error.js                  # Clases de Error HTTP personalizadas (400, 401, 404, etc.)
│   ├── fileUtils.js              # Utilidades de I/O para archivos locales (simulación DB)
│   ├── generarId.js              # Utilidad para generar ID incremental
│   └── validadores.js            # Funciones de validación de formato de datos
├── .env                          # Variables de entorno
└── server.js                     # Archivo principal de Express y configuración
```

## Endpoints de la API

| Recurso | Método | Ruta | Descripción | Seguridad |
| :--- | :--- | :--- | :--- | :--- |
| **Autenticación** | `POST` | `/api/users/register` | Crea un nuevo usuario. | Pública |
| **Autenticación** | `POST` | `/api/users/login` | Inicia sesión y devuelve el **JWT**. | Pública |
| **Usuarios** | `GET` | `/api/users/:id` | Obtiene el perfil del usuario con ID `:id`. | **Protegida** |
| **Usuarios** | `PUT` | `/api/users/:id` | Actualiza el perfil del usuario con ID `:id`. | **Protegida** |
| **Usuarios** | `DELETE` | `/api/users/:id` | Elimina el perfil del usuario con ID `:id`. | **Protegida** |
| **Archivos** | `POST` | `/api/files/upload` | Sube un archivo (key: `archivo`). | **Protegida** |

### Notas de Seguridad y Buenas Prácticas

Todas las rutas **protegidas** requieren el **JWT** en el encabezado `Authorization: Bearer <token>`.

> **Aclaración sobre la Generación del Token:**
>
> La implementación actual solo genera y devuelve el JWT en el *Login* (`/api/users/login`). Desde una **perspectiva de buena práctica y seguridad**, esta es la aproximación **preferida**, ya que un usuario que se registra no necesariamente quiere iniciar sesión inmediatamente, y evita la sobrecarga de generar tokens en el proceso de registro.

¡Claro! Regenero la sección de pruebas para el `README.md`, haciéndola más detallada y precisa, incluyendo los datos y las expectativas de respuesta.

## Pruebas Detalladas con Postman

La API sigue un flujo estricto de autenticación. Las pruebas deben ejecutarse en el siguiente orden para obtener el token necesario para las rutas protegidas.

### 1. Registro de Usuario (Pública)

| Detalle | Especificación |
| :--- | :--- |
| **Método** | `POST` |
| **Ruta** | `/api/users/register` |
| **Body** | `JSON` |
| **Ejemplo de Body** | `{"email": "prueba@mail.com", "nombre": "Usuario Prueba", "password": "Password123"}` |
| **Código Esperado** | `201 Created` |
| **Respuesta Esperada** | `{"mensaje": "Usuario registrado exitosamente"}` |

### 2. Inicio de Sesión (Pública)

Este paso es crucial para obtener el JWT y realizar las pruebas protegidas.

| Detalle | Especificación |
| :--- | :--- |
| **Método** | `POST` |
| **Ruta** | `/api/users/login` |
| **Body** | `JSON` |
| **Ejemplo de Body** | `{"email": "prueba@mail.com", "password": "Password123"}` |
| **Código Esperado** | `200 OK` |
| **Respuesta Esperada** | Objeto que contiene el **`token`** (JWT) y el **`id`** del usuario. |

> ** NOTA IMPORTANTE:** Copia el valor del campo **`token`** de esta respuesta. Deberás usarlo en el encabezado `Authorization: Bearer <token>` para todas las siguientes pruebas.

### 3. Subida de Archivo (Protegida)

Este *endpoint* valida el tipo y tamaño del archivo (`< 5MB`, tipos: JPEG, PNG, PDF, TXT).

| Detalle | Especificación |
| :--- | :--- |
| **Método** | `POST` |
| **Ruta** | `/api/files/upload` |
| **Headers** | `Authorization: Bearer <token>` |
| **Body** | `form-data` |
| **Key** | `archivo` (Tipo: **File**) |
| **Código Esperado** | `200 OK` |
| **Respuesta Esperada** | `{"mensaje": "Archivo subido exitosamente.", "archivoUrl": "/uploads/nombre-unico.ext"}` |

### 4. Obtener Perfil (Protegida)

Utiliza el **`id`** obtenido en el Login para construir la ruta.

| Detalle | Especificación |
| :--- | :--- |
| **Método** | `GET` |
| **Ruta** | `/api/users/:id` |
| **Headers** | `Authorization: Bearer <token>` |
| **Código Esperado** | `200 OK` |
| **Respuesta Esperada** | Objeto con los datos del usuario, **sin el campo `password`**. |

### 5. Actualizar Perfil (Protegida)

La implementación requiere todos los campos (`email`, `nombre`, `password`) para actualizar, simulando una actualización total.

| Detalle | Especificación |
| :--- | :--- |
| **Método** | `PUT` |
| **Ruta** | `/api/users/:id` |
| **Headers** | `Authorization: Bearer <token>` |
| **Body** | `JSON` |
| **Ejemplo de Body** | `{"email": "nuevo@mail.com", "nombre": "Nuevo Nombre", "password": "NewPassword123"}` |
| **Código Esperado** | `200 OK` |
| **Respuesta Esperada** | `{"mensaje": "Usuario con ID [id] actualizado exitosamente."}` |

### 6. Eliminar Perfil (Protegida)

Este paso revocará el token actual (al eliminar el usuario), por lo que debe ser la última prueba.

| Detalle | Especificación |
| :--- | :--- |
| **Método** | `DELETE` |
| **Ruta** | `/api/users/:id` |
| **Headers** | `Authorization: Bearer <token>` |
| **Código Esperado** | `200 OK` |
| **Respuesta Esperada** | `{"mensaje": "Usuario con ID [id] eliminado exitosamente."}` |

### 7. Manejo de Errores (Ejemplo de Fallo)

| Escenario | Método | Ruta | Headers/Body | Código Esperado | Mensaje de Error (Parcial) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Token Inválido** | `GET` | `/api/users/1` | `Authorization: Bearer xyz` | `401 Unauthorized` | `"Token no válido o no proporcionado."` |
| **Acceso Denegado** | `GET` | `/api/users/99` | `Authorization: Bearer <token_usuario_1>` | `401 Unauthorized` | `"No está autorizado para gestionar este perfil."` |
| **Validación de Email** | `POST` | `/api/users/register` | `{"email": "invalido" ...}` | `400 Bad Request` | `"El correo ingresado no tiene un formato válido"` |
| **Recurso Inexistente** | `GET` | `/ruta/inexistente` | (Cualquiera) | `404 Not Found` | `"Recurso no encontrado: La ruta /ruta/inexistente no existe."` |