// src/config/passport.config.js
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../models/user.model.js'; // Importamos el modelo de usuario

// --- Clave Secreta para JWT ---
// ¡IMPORTANTE: Mueve esto a un archivo .env en un proyecto real!
const JWT_SECRET = 'miClaveSecretaJWT'; // Reemplaza con una clave segura

/**
 * Función auxiliar para extraer el token de una cookie.
 * Passport-JWT puede extraer de headers, query params, etc.
 * Lo configuramos para que lo busque en una cookie llamada 'token'.
 */
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token']; // Nombre de la cookie que usaremos
    }
    return token;
};

const initializePassport = () => {
    
    passport.use('jwt', new JwtStrategy(
        {
            // Le decimos a Passport que use el extractor de cookies
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: JWT_SECRET // La misma clave secreta
        },
        /**
         * Este es el callback de verificación.
         * 'jwt_payload' es el token ya decodificado.
         * 'done' es la función que pasará el control a la siguiente etapa.
         */
        async (jwt_payload, done) => {
            try {
                // Buscamos al usuario por el ID que está en el payload del token
                // Usamos .lean() para un objeto JS simple, ya que solo es consulta
                const user = await UserModel.findById(jwt_payload.id).lean();
                
                if (!user) {
                    // Si no se encuentra el usuario
                    return done(null, false, { message: 'Usuario no encontrado.' });
                }
                
                // Si se encuentra el usuario, lo pasamos
                // (Quitamos la contraseña del objeto antes de pasarlo)
                delete user.password; 
                return done(null, user); 
                
            } catch (err) {
                return done(err);
            }
        }
    ));
};

// Exportamos la función de inicialización y el secreto
export { initializePassport, JWT_SECRET };