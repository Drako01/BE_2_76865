import passport from "passport";

// Requiere passport-jwt leyendo la cookie 'access_token'
export const requireJwtCookie = passport.authenticate('jwt-cookie', {session: false});

// Autorizacion por Roles
export const requireRole = (...roles) => (req, res,next) => {
    // passport coloca al user en req.user
    if(!req.user) return res.status(401).json({error: 'No autorizado'});
    if(!roles.includes(req.user.role)) return res.status(403).json({error: 'Acceso Prohibido'});
    next();
}