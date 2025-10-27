import { Router } from 'express';
import { UserModel } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { JWT_SECRET } from '../config/passport.config.js'; 

const router = Router();

// --- Ruta de Registro (POST) ---
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password, cart } = req.body;

    if (!first_name || !email || !password) {
        return res.status(400).json({ status: 'error', message: 'Faltan datos esenciales.' });
    }

    try {
        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password, 
            cart 
        });

        await newUser.save();
        res.status(201).json({ status: 'success', message: 'Usuario registrado' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ status: 'error', message: 'El correo electrónico ya está en uso.' });
        }
        res.status(500).json({ status: 'error', message: error.message });
    }
});


// --- Ruta de Login (POST) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
        }

        if (!user.isValidPassword(password)) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
        }

        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role,
            cart: user.cart,
            first_name: user.first_name
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); 

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000 
        });

        res.json({ status: 'success', message: 'Login exitoso' });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


// --- Ruta /current (GET) ---
router.get(
    '/current', 
    passport.authenticate('jwt', { session: false }), 
    (req, res) => {
        res.json(req.user);
    }
);

export default router;