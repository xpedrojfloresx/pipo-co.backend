import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import usuariosRouter from './routes/usersRoutes.js';
import productosRouter from './routes/productosRoutes.js';
import pedidosRouter from './routes/pedidosRoutes.js';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGINS.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.get('/api/ping', (req, res) => {
  res.status(200).send('pong');
});

app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/pedidos', pedidosRouter);

export default app;