import { Router } from 'express';
import ResenaModel from '../models/resenasModels.js';

const router = Router();

// GET /api/resenas  — público
router.get('/', async (req, res) => {
    try {
        const resenas = await ResenaModel.find().sort({ fecha: -1 });
        res.status(200).json(resenas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener las reseñas' });
    }
});

export default router;
