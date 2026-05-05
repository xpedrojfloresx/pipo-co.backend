import mongoose from 'mongoose';

const resenaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    mascota: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        default: '',
        trim: true,
    },
    texto: {
        type: String,
        required: true,
        trim: true,
    },
    producto: {
        type: String,
        default: '',
        trim: true,
    },
    fecha: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setHours(now.getHours() - 3);
            return now;
        }
    }
});

const ResenaModel = mongoose.model('resena', resenaSchema);

export default ResenaModel;
