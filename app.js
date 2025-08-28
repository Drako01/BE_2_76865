import express from 'express';
import homeRouter from './routes/home.router.js';
import sudentRouter from './routes/student.router.js';
import { connectToMongoDB, connectToMongoDBAtlas } from './config/db/connect.config.js';

import logger from './middleware/logger.middleware.js';


const app = express();
const PORT = 3000;
const ATLAS = false;

app.use(express.json());
app.use(logger);

app.use('/', homeRouter);
app.use('/student', sudentRouter);

const startServer = async () => {
    ATLAS ? await connectToMongoDBAtlas() : await connectToMongoDB();
    app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
}

await startServer();