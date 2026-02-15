const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            base: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' },
            sauce: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' },
            cheese: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' },
            veggies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' }],
            meat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' }], // Optional
        }
    ],
    totalAmount: { type: Number, required: true },
    paymentId: { type: String }, // Razorpay Payment ID
    status: {
        type: String,
        enum: ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'],
        default: 'Order Received'
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
