import express from 'express';
import homeRouter from './routes/home.router.js';
import sudentRouter from './routes/student.router.js';
import userRouter from './routes/user.router.js';
import profileRouter from './routes/profile.router.js';

import { connectToMongoDB, connectToMongoDBAtlas } from './config/db/connect.config.js';
import logger from './middleware/logger.middleware.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';


const app = express();
const PORT = 3000;
const ATLAS = false;
const ATLAS_URL = 'mongodb://127.0.0.1:27017/backend76865';


app.use(express.json());
app.use(logger);

app.use(
    session({
        secret: 'clave_secreta',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl:ATLAS_URL,
            ttl: 60 * 60, // 1hr
        }),
        cookie: {
            maxAge: 1 * 60 * 60 * 1000, // 1hr
            httpOnly: true,
            signed:true,
        },
    })
);

app.use('/', homeRouter);
app.use('/student', sudentRouter);
app.use('/auth', userRouter);
app.use('/auth/profile', profileRouter);

const startServer = async () => {
    ATLAS ? await connectToMongoDBAtlas() : await connectToMongoDB();
    app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
}

await startServer();