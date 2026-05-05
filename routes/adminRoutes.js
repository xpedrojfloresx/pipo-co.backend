import { Router } from 'express';
import { body } from 'express-validator';
import adminAuth from '../middleware/adminAuth.js';
import {
    adminObtenerProductos,
    adminCrearProducto,
    adminActualizarProducto,
    adminEliminarProducto,
    adminObtenerUsuarios,
    adminCrearUsuario,
    adminActualizarUsuario,
    adminEliminarUsuario,
    adminObtenerPedidos,
    adminActualizarEstadoPedido,
    adminObtenerResenas,
    adminCrearResena,
    adminActualizarResena,
    adminEliminarResena,
} from '../controllers/adminController.js';

const router = Router();

// Todas las rutas de este router requieren ser admin
router.use(adminAuth);

// ── Productos ──────────────────────────────────────────────────────────────────
router.get('/productos', adminObtenerProductos);

router.post('/productos', [
    body('name', 'El nombre es obligatorio').isString().trim().notEmpty(),
    body('img', 'La imagen es obligatoria').isString().trim().notEmpty(),
    body('price', 'El precio es obligatorio').isString().trim().notEmpty(),
    body('stock').optional().isNumeric(),
], adminCrearProducto);

router.put('/productos/:id', adminActualizarProducto);
router.delete('/productos/:id', adminEliminarProducto);

// ── Usuarios ───────────────────────────────────────────────────────────────────
router.get('/usuarios', adminObtenerUsuarios);

router.post('/usuarios', [
    body('nombre', 'El nombre es obligatorio').isString().trim().notEmpty(),
    body('email', 'El email es obligatorio').isEmail().trim().notEmpty(),
    body('password', 'La contraseña es obligatoria, mínimo 6 caracteres').isLength({ min: 6 }),
    body('rol').optional().isIn(['user', 'admin']),
], adminCrearUsuario);

router.put('/usuarios/:id', adminActualizarUsuario);
router.delete('/usuarios/:id', adminEliminarUsuario);

// ── Pedidos ────────────────────────────────────────────────────────────────────
router.get('/pedidos', adminObtenerPedidos);

router.put('/pedidos/:id/estado', [
    body('estado', 'Estado inválido').isIn(['pendiente', 'confirmado', 'enviado', 'entregado', 'finalizado', 'cancelado']),
], adminActualizarEstadoPedido);

// ── Reseñas ────────────────────────────────────────────────────────────────────
router.get('/resenas', adminObtenerResenas);

router.post('/resenas', [
    body('nombre', 'El nombre es obligatorio').isString().trim().notEmpty(),
    body('mascota', 'La mascota es obligatoria').isString().trim().notEmpty(),
    body('texto', 'El texto es obligatorio').isString().trim().notEmpty(),
], adminCrearResena);

router.put('/resenas/:id', adminActualizarResena);
router.delete('/resenas/:id', adminEliminarResena);

export default router;
