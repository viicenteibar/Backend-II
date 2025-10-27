// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser'; // 1. Importamos cookie-parser
import { initializePassport } from './config/passport.config.js'; // 2. Importamos nuestra config de Passport
import sessionsRouter from './routes/sessions.router.js'; // 3. Importamos el router de sesiones
// ...otros imports (handlebars, tus otros routers)

// --- Constantes ---
const app = express();
const PORT = 8080; // O el puerto que prefieras
const MONGO_URI = 'mongodb://tu_uri_de_conexion'; // ⚠️ Reemplaza esto

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 4. Usamos cookie-parser ¡Clave para leer la cookie del token!

// --- Configuración de Passport ---
initializePassport(); // 5. Inicializamos las estrategias de Passport
app.use(passport.initialize()); // 6. Inicializamos Passport en Express

// ... (Aquí iría tu configuración de Handlebars y archivos estáticos) ...

// --- Rutas ---
app.use('/api/sessions', sessionsRouter); // 7. Usamos el router de sesiones
// ... (Aquí van tus otros routers de vistas, productos, carritos) ...

// --- Conexión a Mongoose y Servidor ---
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    })
    .catch(err => console.error('Error de conexión:', err));