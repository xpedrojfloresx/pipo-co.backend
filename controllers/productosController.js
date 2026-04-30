import { validationResult } from 'express-validator';
import ProductoModel from '../models/productosModels.js';

const obtenerProductos = async (req, res) => {
    try {
        const productos = await ProductoModel.find();
        res.status(200).json(productos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await ProductoModel.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
};

const crearProducto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array().map(item => item.msg).join(', ')
        });
    }

    try {
        const nuevoProducto = new ProductoModel(req.body);
        await nuevoProducto.save();
        res.status(201).json({ message: 'Producto creado con éxito', producto: nuevoProducto });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
};

const actualizarProducto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array().map(item => item.msg).join(', ')
        });
    }

    try {
        const productoActualizado = await ProductoModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!productoActualizado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto actualizado con éxito', producto: productoActualizado });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const productoEliminado = await ProductoModel.findByIdAndDelete(req.params.id);
        if (!productoEliminado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};

export {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
};
