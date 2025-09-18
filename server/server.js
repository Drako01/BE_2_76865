import express from 'express';

import authRouter from '../routes/auth.router.js';
import homeRouter from '../routes/home.router.js'
import studentRouter from '../routes/student.router.js'


import logger from '../middleware/logger.middleware.js'
import { connectAuto } from '../config/db/connect.config.js'

import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import passport from 'passport';
import { initPassport } from '../config/auth/passport.config.js'

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(logger);
app.use(cookieParser('clave_secreta'));


export const startServer = async () => {

    // Conexion a la Base de Datos
    await connectAuto();

    const store = MongoStore.create({
        client: (await import("mongoose")).default.connection.getClient(),
        ttl: 60 * 60,
    })

    app.use(
        session({
            secret: process.env.SESSION_SECRET || "clave_secreta",
            resave: false,
            saveUninitialized: false,
            store,
            cookie: {
                maxAge: 1 * 60 * 60 * 1000, // 1hr
                httpOnly: true,
                // signed: true,
            },
        })
    );

    initPassport();
    app.use(passport.initialize());

    // Llamadas al enrutador
    app.use('/auth', authRouter);
    app.use('/', homeRouter);
    app.use('/student', studentRouter);

    app.use((req, res) => {
        res.status(404).json({ error: 'Página No Encontrada.!' });
    })

    app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
};
