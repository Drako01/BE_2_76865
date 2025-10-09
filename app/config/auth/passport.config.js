import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import environment from '../env.config.js';
import { User } from "../../models/user.model.js";

// Funcion que sirve para leer el token desde la cookie httponly 'acces_token'
function cookieExtractor(req) {
    if (req && req.cookies && req.cookies.access_token) {
        return req.cookies.access_token;
    }
    return null;
}

export function initPassport() {
    passport.use('jwt-cookie', new JwtStrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: environment.JWT_SECRET
        },
        async (payload, done) => {
            try {
                const user = await User.findById(payload.sub).lean();
                if (!user) return done(null, false);
                return done(null, { _id: user._id, email: user.email, role: user.role });
            } catch (error) {
                return done(error, false)
            }
        }
    ))
}