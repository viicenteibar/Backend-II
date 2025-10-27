import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser'; 
import { initializePassport } from './config/passport.config.js'; 
import sessionsRouter from './routes/sessions.router.js'; 

const app = express();
const PORT = 8080; 
const MONGO_URI = process.env.MONGO_URI; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

initializePassport(); 
app.use(passport.initialize()); 

app.use('/api/sessions', sessionsRouter); 

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    })
    .catch(err => console.error('Error de conexión:', err));