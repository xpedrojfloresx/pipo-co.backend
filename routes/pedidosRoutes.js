import { Router } from 'express';
import { body } from 'express-validator';
import {
    crearPedido,
    obtenerPedidos,
    obtenerPedidosPorUsuario,
    actualizarEstado,
} from '../controllers/pedidosController.js';

const router = Router();

// GET /api/pedidos  (todos — uso admin)
router.get('/', obtenerPedidos);

// GET /api/pedidos/usuario/:usuarioId
router.get('/usuario/:usuarioId', obtenerPedidosPorUsuario);

// POST /api/pedidos
router.post('/', [
    body('usuarioId').optional(),
    body('items', 'Los items son obligatorios').isArray({ min: 1 }),
    body('total', 'El total es obligatorio').isNumeric(),
    body('datosEnvio.nombre', 'El nombre de envío es obligatorio').notEmpty(),
    body('datosEnvio.email', 'El email de envío es obligatorio').isEmail(),
    body('datosEnvio.direccion', 'La dirección es obligatoria').notEmpty(),
    body('datosEnvio.ciudad', 'La ciudad es obligatoria').notEmpty(),
    body('datosEnvio.provincia', 'La provincia es obligatoria').notEmpty(),
    body('datosEnvio.cp', 'El código postal es obligatorio').notEmpty(),
    body('datosEnvio.modalidad', 'La modalidad es obligatoria').isIn(['envio', 'retiro']),
], crearPedido);

// PUT /api/pedidos/:id/estado
router.put('/:id/estado', [
    body('estado', 'Estado inválido').isIn(['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado']),
], actualizarEstado);

export default router;
