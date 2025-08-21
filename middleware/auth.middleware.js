import passport from "passport";

// Protefe con passport-jwt leyendo la cookie 'acces_token'
export const requiereJwtCookie = passport.authenticate('jwt-cookie', {session: false});

// Autorizacion por rol simple
export const requireRole = (...roles) => (req, res, next) => {
    // passport coloca al user en req.user
    if(!req.user) return res.status(401).json({error: 'No Autorizado'});
    if(!roles.includes(req.user.role)) return res.status(403).json({error: 'Prohibido el paso'});
    next();
};
