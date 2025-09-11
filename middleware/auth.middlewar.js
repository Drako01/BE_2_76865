import jwt from "jsonwebtoken";

export function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: "No Autorizado" });
    }
    next();
}

export function alreadyLoggedIn(req, res, next) {
    if (req.session.user) {
        return res.status(403).json({ error: "Ya estas Logueado" });
    }
    next();
}

// Autorizacion por Roles
export function requireRole(role) {
    return (req, res, next) => {
        const user = req.session?.user || req.user; // session o passport
        if (!user) return res.status(401).json({ error: "No autorizado" });
        if (user.role !== role) return res.status(403).json({ error: "Prohibido" });
        next();
    };
}

export function requiereJWT(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Token faltante" });
    try {
        req.jwt = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: "Token inválido/expirado" });
    }
}