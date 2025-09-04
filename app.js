import express from 'express';

import homeRouter from './routes/home.router.js'
import studentRouter from './routes/student.router.js'
import authRouter from './routes/auth.router.js';
import apiV1Router from './routes/api.v1.router.js';
import advanceRouter from './routes/advancedRouter.js';
import processRouter from './routes/process.router.js';
import newStudentRouter from './routes/new_student.router.js';


import logger from './middleware/logger.middleware.js'
import { connectAuto } from './config/db/connect.config.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import { initPassport } from './config/auth/passport.config.js'
import env, { validateEnv } from './config/env.config.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);
app.use(cookieParser('clave_secreta'));


const startServer = async () => {

    // Validar la existencia de las variables de entorno importantes.
    validateEnv();

    // Se conecta a la base de datos
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
    app.use('/', homeRouter);
    app.use('/auth', authRouter);
    app.use('/student', studentRouter);


    // Agrupar Routers versionados
    app.use('/api/v1', apiV1Router);
    app.use('/advanced', advanceRouter);
    app.use('/process', processRouter);

    app.use('/new/student', newStudentRouter);


    app.use((req, res) => {
        res.status(404).json({ error: "Pagina no encontrada.!" });
    })


    // Manejo de señales y errores globales
    process.on('unhandledRejection', (reason) => {
        console.error('[process] Unhandled Rejection ', reason);
    })

    process.on('uncaughtException', (err) => {
        console.error('[process] Uncaught Exception ', err);
    })

    process.on('SIGINT', () => {
        console.log('\n[process] SIGINT recibido. Cerrando...')
        process.exit(0);
    })

    app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
};


await startServer();