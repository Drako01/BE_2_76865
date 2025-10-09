import { Router } from "express";
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { requireJwtCookie } from "../middleware/auth.middleware.js";
import environment from '../config/env.config.js';

const router = Router();

/** Registro Local (hash con bycrypt) */
router.post("/register", async (req, res) => {
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

/** JWT */
router.post("/jwt/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Faltan Credenciales" });
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ error: "Credenciales inválidas" });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ error: "Password inválido" });

    const payload = { sub: String(u._id), email: u.email, role: u.role };
    const token = jwt.sign(payload, environment.JWT_SECRET, { expiresIn: "1h" });

    // Cookie HttpOnly
    res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 1000,
        path: '/'
    })

    res.json({ message: "Login OK (JWT en Cookie)" });
});

router.get("/jwt/me", requireJwtCookie, async (req, res) => {

    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ error: "Usuario No encontrado" });
    const { first_name, last_name, email, age, role } = user;
    res.json({ user: { first_name, last_name, email, age, role } });
});

router.post('/jwt/logout', (req, res) => {
    res.clearCookie('access_token', {path: '/'});
    res.json({message: 'Logout Ok - Cookie de JWT Borrada'})
})

export default router;