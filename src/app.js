import express from 'express';
import { errorHandler } from './middleware/errorHandle.js';
import usuarioRouter from './modules/usuarios/usuario.router.js';
import historialRouter from './modules/historial/historial.router.js';
import authRouter from './modules/auth/auth.router.js'
import userAdminRouter from './modules/user-admin/user-admin.router.js'
import cors from 'cors';

const app = express();

// CORS (poné tu frontend en origin si querés restringir)
app.use(
  cors({
    origin: '*',          // o 'http://localhost:5173' por ejemplo
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware global
app.use(express.json());

// Rutas

app.get('/', (req, res) => {
    res.json({ message: '¡Hola Mundo!' });
});

app.use('/api/usuarios', usuarioRouter);
app.use('/auth',authRouter)
app.use('/api/user-admin',userAdminRouter)
// app.use('/api/historial',historialRouter)

//error handle
app.use(errorHandler);

export default app;
