import { validationResult } from 'express-validator';
import PedidoModel from '../models/pedidosModels.js';
import { enviarMailPedido, enviarMailConfirmacionAdmin } from '../helps/enviarMail.js';

const crearPedido = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array().map(item => item.msg).join(', ')
        });
    }

    const { usuarioId, items, total, datosEnvio } = req.body;

    try {
        // Generar número de orden secuencial
        const ultimoPedido = await PedidoModel.findOne().sort({ nroOrden: -1 }).select('nroOrden');
        const nroOrden = (ultimoPedido?.nroOrden ?? 0) + 1;

        const nuevoPedido = new PedidoModel({ usuario: usuarioId, items, total, datosEnvio, nroOrden });
        await nuevoPedido.save();

        await enviarMailPedido({ datosEnvio, items, total });
        await enviarMailConfirmacionAdmin({ nroOrden, datosEnvio, items, total });

        res.status(201).json({ message: 'Pedido creado con éxito', pedido: nuevoPedido, nroOrden });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear el pedido' });
    }
};

const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await PedidoModel.find()
            .sort({ nroOrden: -1 })
            .populate('usuario', 'nombre email')
            .populate('items.productoId', 'name img');
        res.status(200).json(pedidos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
};

const obtenerPedidosPorUsuario = async (req, res) => {
    try {
        const pedidos = await PedidoModel.find({ usuario: req.params.usuarioId })
            .sort({ nroOrden: -1 })
            .populate('items.productoId', 'name img');
        res.status(200).json(pedidos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los pedidos del usuario' });
    }
};

const actualizarEstado = async (req, res) => {
    try {
        const pedido = await PedidoModel.findByIdAndUpdate(
            req.params.id,
            { estado: req.body.estado },
            { new: true, runValidators: true }
        );
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.status(200).json({ message: 'Estado actualizado', pedido });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el pedido' });
    }
};

export {
    crearPedido,
    obtenerPedidos,
    obtenerPedidosPorUsuario,
    actualizarEstado,
};
