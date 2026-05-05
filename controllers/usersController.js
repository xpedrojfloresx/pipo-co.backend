import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsuarioCollection from '../models/usersModels.js';
import { enviarMail } from '../helps/enviarMail.js';

const registrarUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array().map(item => item.msg).join(', ')
        });
    }

    const { nombre, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const usuarioNuevo = new UsuarioCollection({ nombre, email, password: passwordHash });
        await usuarioNuevo.save();
        await enviarMail(nombre, email);

        res.status(200).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al guardar el usuario' });
    }
};

const loginUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array().map(item => item.msg).join(', ')
        });
    }

    const { email, password } = req.body;

    try {
        const usuario = await UsuarioCollection.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ message: 'El usuario no existe' });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(400).json({ message: 'La contraseña es incorrecta' });
        }

        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuarioCollection.find().select('-password');
        res.status(200).json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

export {
    obtenerUsuarios,
    registrarUsuario,
    loginUsuario,
};
