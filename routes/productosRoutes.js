import { Router } from 'express';
import { body } from 'express-validator';
import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
} from '../controllers/productosController.js';

const router = Router();

const validarProducto = [
    body('name', 'El nombre es obligatorio').isString().trim().notEmpty(),
    body('img', 'La imagen es obligatoria').isString().trim().notEmpty(),
    body('price', 'El precio es obligatorio').isString().trim().notEmpty(),
];

// GET /api/productos
router.get('/', obtenerProductos);

// GET /api/productos/:id
router.get('/:id', obtenerProductoPorId);

// POST /api/productos
router.post('/', validarProducto, crearProducto);

// PUT /api/productos/:id
router.put('/:id', validarProducto, actualizarProducto);

// DELETE /api/productos/:id
router.delete('/:id', eliminarProducto);

export default router;
