export function requiereLogin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: "No Autorizado" });
    }
    next();
}

export function alreadyLogin(req, res, next) {
    if(req.session.user){
        return res.status(403).json({error: "Ya estas Logueado!"});
    }
    next();
}