import { body } from 'express-validator';

import { Router } from 'express';
const router = Router();

import {
  obtenerUsuarios,
  registrarUsuario,
  loginUsuario
} from '../controllers/usersController.js';

router.get('/', obtenerUsuarios);

// Esta ruta responde a /api/usuarios..
// Rutas de usuarios
router.post('/registro',
  [
    body("nombre", "El nombre es obligatorio").isString().trim().notEmpty(),
    body("email", "El email es obligatorio").isEmail().trim().notEmpty(),
    body("password", "La contraseña es obligatoria, minimo 6 caracteres y maximo 12 caracteres").isAlphanumeric().trim().notEmpty().isLength({ min: 6, max: 12 }),
  ],
  registrarUsuario);

// aplicamos nuestro middleware personalizado
// router.post('/registro', verificacionPersonal, registrarUsuario);

//Post para el login
router.post('/login', [
  body("email", "El email es obligatorio").isEmail().trim().notEmpty(),
  body("password", "La contraseña es obligatoria").isAlphanumeric().trim().notEmpty().isLength({ min: 6, max: 12 }),
], loginUsuario);

// Exportamos el router
export default router;