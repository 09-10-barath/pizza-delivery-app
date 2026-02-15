const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Thin Crust", "Tomato Sauce"
    category: {
        type: String,
        required: true,
        enum: ['base', 'sauce', 'cheese', 'veggie', 'meat']
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String }, // URL to image
}, { timestamps: true });

module.exports = mongoose.model('Pizza', pizzaSchema);
