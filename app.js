import express from 'express';
import homeRouter from './routes/home.router.js'
import studentRouter from './routes/student.router.js'
import userRouter from './routes/user.router.js';
import profileRouter from './routes/profile.router.js';
import logger from './middleware/logger.middleware.js'
import { connectToMongoDB, connectMongoDBAltas } from './config/db/connect.config.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';


const app = express();
const PORT = 3000;
const ATLAS_URL = 'mongodb+srv://aleddistefano:ZWKtmXYJ1ozfXgmN@codehouse.cfacxsr.mongodb.net/';
app.use(express.json());
app.use(logger);
app.use(cookieParser('clave_secreta'));

app.use(
    session({
        secret: 'clave_secreta',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: ATLAS_URL,
            ttl: 60 * 60, // 1hr
        }),
        cookie: {
            maxAge: 1 * 60 * 60 * 1000, // 1hr
            httpOnly: true,
            signed: true,
        },
    })
);

// Llamadas al enrutador
app.use('/', homeRouter);
app.use('/student', studentRouter);
app.use('/auth', userRouter);
app.use('/auth/profile', profileRouter);

const ATLAS = true;

const startServer = async () => {
    ATLAS ? await connectMongoDBAltas() : await connectToMongoDB();
    app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
}

await startServer();