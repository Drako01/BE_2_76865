import { Router } from "express";
import { User } from '../config/models/user.model.js';
import bcrypt from 'bcrypt';
import { alreadyLoggedIn, requireLogin } from '../middleware/auth.middlewar.js';

const router = new Router();

router.post('/register', alreadyLoggedIn, async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: "Todos los datos son requeridos!" });
        };

        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ error: "El email ingresado ya se encuentra registrado" });
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ first_name, last_name, email, age, password: hash });
        await user.save();

        res.status(201).json({ message: "Usuario Registrado con exito", user: user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/login', alreadyLoggedIn, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "El Usuario no fue encontrado.!" });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: "Credenciales Invalidas" });

        req.session.user = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age
        };

        res.status(200).json({ message: "Login exitoso", user: req.session.user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/logout', requireLogin, async (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: "Logout exitoso" });
    })
})

router.get('/', requireLogin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users: users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;