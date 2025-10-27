import 'dotenv/config';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

const initializePassport = () => {
    
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: JWT_SECRET
        },
        async (jwt_payload, done) => {
            try {
                const user = await UserModel.findById(jwt_payload.id).lean();
                
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado.' });
                }
                
                delete user.password; 
                return done(null, user); 
                
            } catch (err) {
                return done(err);
            }
        }
    ));
};

export { initializePassport, JWT_SECRET };