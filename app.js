import express from 'express';
import homeRouter from './routes/home.router.js'
import studentRouter from './routes/student.router.js'
import logger from './middleware/logger.middleware.js'
import { connectToMongoDB } from './config/db/connect.config.js'

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);


// Llamadas al enrutador
app.use('/', homeRouter);
app.use('/student', studentRouter);

const startServer = async () => {
    await connectToMongoDB();
    app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
}

await startServer();