import { Router } from "express";
import { User } from '../config/models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import passport from "passport";
import { alreadyLoggedIn, requireLogin, requiereJWT } from "../middleware/auth.middlewar.js";


const router = Router();

/** Registro Local (hash con bycrypt) */
router.post("/register", alreadyLoggedIn, async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({ error: "Todos los datos son requeridos" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email ya registrado" });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ first_name, last_name, email, age, password: hash });

    res.status(201).json({ message: "Usuario registrado" });
});

router.post("/login", alreadyLoggedIn, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info?.message || "Credenciales inválidas" });

        req.logIn(user, { session: true }, (err2) => {
            if (err2) return next(err2);
            req.session.user = user; // guarda versión saneada en session
            return res.json({ message: "Login OK (session)", user });
        });
    })(req, res, next);
});


router.post("/logout", requireLogin, (req, res, next) => {
    // Evita que Passport intente regenerate (que requiere req.session):
    req.logout({ keepSessionInfo: true }, (err) => {
        if (err) return next(err);

        // Ahora sí, destruimos la sesión en el store:
        if (req.session) {
            req.session.destroy((err2) => {
                if (err2) return next(err2);
                // Limpia la cookie de sesión (por defecto: 'connect.sid')
                res.clearCookie("connect.sid");
                return res.json({ message: "Logout OK" });
            });
        } else {
            // Si por alguna razón no hay sesión, respondemos igual:
            res.clearCookie("connect.sid");
            return res.json({ message: "Logout OK (sin session activa)" });
        }
    });
});

router.get("/me", requireLogin, (req, res) => {
    res.json({ user: req.session.user });
});


/** Estrategia de GitHub */
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "/auth/github/fail" }),
    (req, res) => {
        req.session.user = req.user;
        res.json({ message: "Login OK con GitHub (session)", user: req.user });
    }
);
router.get("/github/fail", (req, res) => res.status(401).json({ error: "GitHub auth falló" }));

/** JWT */
router.post("/jwt/login", async (req, res) => {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u || !u.password) return res.status(400).json({ error: "Credenciales inválidas" });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ error: "Credenciales inválidas" });

    const payload = { sub: String(u._id), email: u.email, role: u.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login OK (JWT)", token });
});

router.get("/jwt/me", requiereJWT, async (req, res) => {
    // req.jwt viene del middleware
    const u = await User.findById(req.jwt.sub).lean();
    if (!u) return res.status(404).json({ error: "No encontrado" });
    const { first_name, last_name, email, age, role } = u;
    res.json({ first_name, last_name, email, age, role });
});

export default router;