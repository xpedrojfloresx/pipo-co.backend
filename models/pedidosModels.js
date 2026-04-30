import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        default: null,
    },
    items: [
        {
            productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'producto', required: true },
            nombre: { type: String, required: true },
            precio: { type: Number, required: true },
            cantidad: { type: Number, required: true, min: 1 },
        }
    ],
    total: {
        type: Number,
        required: true,
    },
    datosEnvio: {
        nombre:    { type: String, required: true, trim: true },
        email:     { type: String, required: true, trim: true },
        direccion: { type: String, required: true, trim: true },
        ciudad:    { type: String, required: true, trim: true },
        provincia: { type: String, required: true, trim: true },
        cp:        { type: String, required: true, trim: true },
        modalidad: { type: String, enum: ['envio', 'retiro'], required: true },
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente',
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

const PedidoModel = mongoose.model('pedido', pedidoSchema);

export default PedidoModel;
