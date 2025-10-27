// src/routes/sessions.router.js
import { Router } from 'express';
import { UserModel } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { JWT_SECRET } from '../config/passport.config.js'; // Importamos el secreto

const router = Router();

// --- Ruta de Registro (POST) ---
// La necesitamos para poder crear usuarios
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password, cart } = req.body;

    // Validamos campos básicos (puedes añadir más validaciones)
    if (!first_name || !email || !password) {
        return res.status(400).json({ status: 'error', message: 'Faltan datos esenciales.' });
    }

    try {
        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password, // Bcrypt se encargará de hashearlo gracias al pre-hook del modelo
            cart 
        });

        await newUser.save();
        res.status(201).json({ status: 'success', message: 'Usuario registrado' });
    } catch (error) {
        // Manejamos el error de email duplicado (código 11000)
        if (error.code === 11000) {
            return res.status(400).json({ status: 'error', message: 'El correo electrónico ya está en uso.' });
        }
        res.status(500).json({ status: 'error', message: error.message });
    }
});


// --- Ruta de Login (POST) ---
// Aquí generamos el JWT
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        // 1. Verificamos si el usuario existe
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
        }

        // 2. Validamos la contraseña usando el método que creamos en el modelo
        if (!user.isValidPassword(password)) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
        }

        // 3. Si las credenciales son válidas, creamos el payload para el token
        // NO incluyas la contraseña en el token.
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role,
            cart: user.cart,
            first_name: user.first_name
        };

        // 4. Firmamos el token JWT
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora

        // 5. Enviamos el token en una cookie httpOnly
        // httpOnly: true -> La cookie no es accesible por JS en el cliente (más seguro)
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000 // 1 hora
        });

        res.json({ status: 'success', message: 'Login exitoso' });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


// --- Ruta /current (GET) ---
// Aquí validamos el JWT con la estrategia de Passport
router.get(
    '/current', 
    passport.authenticate('jwt', { session: false }), 
    (req, res) => {
        /**
         * Si Passport ('jwt') tiene éxito, adjuntará el usuario (que encontró
         * en la DB gracias al payload del token) al objeto 'req.user'.
         * Si falla (token inválido o expirado), Passport devolverá 
         * automáticamente un error 401 Unauthorized.
         */
        
        // Devolvemos los datos del usuario que están en req.user
        res.json(req.user);
    }
);

export default router;