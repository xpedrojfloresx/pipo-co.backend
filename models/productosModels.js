import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    img: {
        type: String,
        required: true,
        trim: true,
    },
    imgPosition: {
        type: String,
        default: 'object-center',
        trim: true,
    },
    price: {
        type: String,
        required: true,
        trim: true,
    },
    unit: {
        type: String,
        default: 'por kg',
        trim: true,
    },
    badge: {
        type: String,
        default: null,
        trim: true,
    },
    description: {
        type: [String],
        default: [],
    },
});

const ProductoModel = mongoose.model('producto', productoSchema);

export default ProductoModel;
