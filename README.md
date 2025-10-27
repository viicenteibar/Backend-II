# Backend II - Entrega N° 1

Este repositorio corresponde a la primera entrega del proyecto del curso de Backend. El objetivo principal es implementar sobre el proyecto e-commerce un sistema de **Autenticación y Autorización** robusto, migrando el manejo de sesiones a **JSON Web Tokens (JWT)**.

## Características Implementadas

Cumpliendo con la consigna, este proyecto incluye:

* **Modelo de Usuario:** Creación del modelo `User` en Mongoose con los campos:
    * `first_name`
    * `last_name`
    * `email` (único)
    * `age`
    * `password`
    * `cart` (referencia a Carts)
    * `role` (default: 'user')

* **Encriptación de Contraseña:** Se utiliza `bcrypt` para hashear la contraseña del usuario antes de guardarla en la base de datos, implementado a través de un *pre-hook* de Mongoose (usando `bcrypt.hashSync`).

* **Estrategia de Passport (JWT):** Se configuró una estrategia `passport-jwt` para la autenticación de usuarios. La estrategia está configurada para extraer el token JWT desde una **cookie** (`httpOnly`).

* **Sistema de Login con JWT:** Se implementó el endpoint `POST /api/sessions/login`, el cual:
    1.  Valida las credenciales del usuario.
    2.  Compara la contraseña usando `bcrypt.compareSync` (a través del método `isValidPassword` del modelo).
    3.  Genera un token JWT firmado (`jsonwebtoken`).
    4.  Envía el token al cliente de forma segura en una cookie `httpOnly`.

* **Ruta de Validación (`/current`):** Se agregó el endpoint `GET /api/sessions/current`.
    1.  Utiliza el middleware `passport.authenticate('jwt', ...)` para proteger la ruta.
    2.  Si el token en la cookie es válido, extrae los datos del usuario y los devuelve en la respuesta.
    3.  Si el token es inválido o no existe, Passport devuelve un error 401 (Unauthorized).

## Instalación

Para correr este proyecto en un entorno local, sigue estos pasos:

1.  Clonar el repositorio:
    ```bash
    git clone [https://github.com/viicenteibar/Backend-II.git](https://github.com/viicenteibar/Backend-II.git)
    ```

2.  Navegar a la carpeta del proyecto:
    ```bash
    cd Backend-II
    ```

3.  Instalar las dependencias de Node.js:
    ```bash
    npm install
    ```

## Configuración

Es necesario crear un archivo `.env` en la raíz del proyecto para definir las variables de entorno.