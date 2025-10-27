import express from 'express';
import { errorHandler } from './middleware/errorHandle.js';
import usuarioRouter from './modules/usuarios/usuario.router.js';
import historialRouter from './modules/historial/historial.router.js';

const app = express();

// Middleware global
app.use(express.json());

// Rutas

app.get('/', (req, res) => {
    res.json({ message: '¡Hola Mundo!' });
});

app.use('/api/usuarios', usuarioRouter);
// app.use('/api/historial',historialRouter)

//error handle
app.use(errorHandler);

export default app;
