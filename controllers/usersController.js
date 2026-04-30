import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import UsuarioCollection from '../models/usersModels.js';
import { enviarMail } from '../helps/enviarMail.js';

const registrarUsuario = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array().map(item => item.msg).join(', ')
        });
    }

    const nombre = req.body.nombre;
    const email = req.body.email;
    const password = req.body.password;

    const persona = {
        nombre,
        email,
        password,
    }

    const guardarUsuario = async () => {
        try {
            // Antes de gauardar los datos, encriptamos el password
            const salt = await bcrypt.genSalt(10);
            // impriimos la salt
            console.log(salt);
            persona.password = await bcrypt.hash(password, salt);
            console.log(persona.password);

            // Creamos una instancia del modelo de usuario con los datos recibidos
            const usuarioNuevo = new UsuarioCollection(persona);

            // Guardamos el usuario en la base de datos
            await usuarioNuevo.save();

            // enviar un mail al user 
            await enviarMail(nombre, email);

            res.status(200).json({
                message: 'Usuario registrado con éxito',
            });
        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Error al guardar el usuario'
            });
        }
    }

    await guardarUsuario();
}

const loginUsuario = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array().map(item => item.msg).join(', ')
        });
    }

    const emailUsuario = req.body.email;
    const passwordUsuario = req.body.password;

    try {
        const usuario = await UsuarioCollection.findOne({ email: emailUsuario });

        console.log(usuario);

        if (!usuario) {
            return res.status(400).json({
                message: 'El usuario no existe'
            });
        }

        const passwordValido = await bcrypt.compare(passwordUsuario, usuario.password);

        console.log(passwordValido);

        if (!passwordValido) {
            return res.status(400).json({
                message: 'La contraseña es incorrecta'
            });
        }

        res.status(200).json({
            message: 'Login exitoso',
            user: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
}

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuarioCollection.find();
        res.status(200).json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
}

export {
    obtenerUsuarios,
    registrarUsuario,
    loginUsuario
}