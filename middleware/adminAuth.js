import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/usersModels.js';

const adminAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await UsuarioModel.findById(decoded.id);
        if (!usuario || usuario.rol !== 'admin') {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }
        req.usuario = usuario;
        next();
    } catch {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

export default adminAuth;
