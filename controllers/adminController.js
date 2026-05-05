import bcrypt from 'bcrypt';
import ProductoModel from '../models/productosModels.js';
import UsuarioModel from '../models/usersModels.js';
import PedidoModel from '../models/pedidosModels.js';
import ResenaModel from '../models/resenasModels.js';

// ── Productos ──────────────────────────────────────────────────────────────────

export const adminObtenerProductos = async (req, res) => {
    try {
        const productos = await ProductoModel.find();
        res.status(200).json(productos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

export const adminCrearProducto = async (req, res) => {
    try {
        const nuevoProducto = new ProductoModel(req.body);
        await nuevoProducto.save();
        res.status(201).json({ message: 'Producto creado', producto: nuevoProducto });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
};

export const adminActualizarProducto = async (req, res) => {
    try {
        const producto = await ProductoModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
        res.status(200).json({ message: 'Producto actualizado', producto });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
};

export const adminEliminarProducto = async (req, res) => {
    try {
        const producto = await ProductoModel.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};

// ── Usuarios ───────────────────────────────────────────────────────────────────

export const adminObtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuarioModel.find().select('-password');
        res.status(200).json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

export const adminCrearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const nuevoUsuario = new UsuarioModel({ nombre, email, password: passwordHash, rol });
        await nuevoUsuario.save();
        res.status(201).json({ message: 'Usuario creado', usuario: { id: nuevoUsuario._id, nombre, email, rol: nuevoUsuario.rol } });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

export const adminActualizarUsuario = async (req, res) => {
    try {
        const { nombre, email, rol, password } = req.body;
        const campos = { nombre, email, rol };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            campos.password = await bcrypt.hash(password, salt);
        }

        const usuario = await UsuarioModel.findByIdAndUpdate(
            req.params.id,
            campos,
            { new: true, runValidators: true }
        ).select('-password');

        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json({ message: 'Usuario actualizado', usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

export const adminEliminarUsuario = async (req, res) => {
    try {
        const usuario = await UsuarioModel.findByIdAndDelete(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};

// ── Pedidos ────────────────────────────────────────────────────────────────────

export const adminObtenerPedidos = async (req, res) => {
    try {
        const pedidos = await PedidoModel.find()
            .sort({ nroOrden: -1 })
            .populate('usuario', 'nombre email')
            .populate('items.productoId', 'name img');
        res.status(200).json(pedidos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener pedidos' });
    }
};

export const adminActualizarEstadoPedido = async (req, res) => {
    try {
        const pedidoActual = await PedidoModel.findById(req.params.id);
        if (!pedidoActual) return res.status(404).json({ message: 'Pedido no encontrado' });

        const nuevoEstado = req.body.estado;
        const estadoAnterior = pedidoActual.estado;

        // Pedido cancelado: bloqueado para siempre
        if (estadoAnterior === 'cancelado') {
            return res.status(400).json({ message: 'El pedido está cancelado y no puede modificarse.' });
        }

        // Descontar stock solo cuando se confirma por primera vez
        if (nuevoEstado === 'confirmado' && estadoAnterior !== 'confirmado') {
            for (const item of pedidoActual.items) {
                await ProductoModel.findByIdAndUpdate(
                    item.productoId,
                    { $inc: { stock: -item.cantidad } }
                );
            }
        }

        // Restaurar stock si se cancela un pedido que ya tenía stock descontado
        const estadosConStock = ['confirmado', 'enviado', 'entregado', 'finalizado'];
        if (nuevoEstado === 'cancelado' && estadosConStock.includes(estadoAnterior)) {
            for (const item of pedidoActual.items) {
                await ProductoModel.findByIdAndUpdate(
                    item.productoId,
                    { $inc: { stock: item.cantidad } }
                );
            }
        }

        pedidoActual.estado = nuevoEstado;
        await pedidoActual.save();

        res.status(200).json({ message: 'Estado actualizado', pedido: pedidoActual });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el pedido' });
    }
};

// ── Reseñas ────────────────────────────────────────────────────────────────────

export const adminObtenerResenas = async (req, res) => {
    try {
        const resenas = await ResenaModel.find().sort({ fecha: -1 });
        res.status(200).json(resenas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener las reseñas' });
    }
};

export const adminCrearResena = async (req, res) => {
    try {
        const nuevaResena = new ResenaModel(req.body);
        await nuevaResena.save();
        res.status(201).json({ message: 'Reseña creada', resena: nuevaResena });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear la reseña' });
    }
};

export const adminActualizarResena = async (req, res) => {
    try {
        const resena = await ResenaModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!resena) return res.status(404).json({ message: 'Reseña no encontrada' });
        res.status(200).json({ message: 'Reseña actualizada', resena });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar la reseña' });
    }
};

export const adminEliminarResena = async (req, res) => {
    try {
        const resena = await ResenaModel.findByIdAndDelete(req.params.id);
        if (!resena) return res.status(404).json({ message: 'Reseña no encontrada' });
        res.status(200).json({ message: 'Reseña eliminada' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar la reseña' });
    }
};
