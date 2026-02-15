const router = require('express').Router();
const Order = require('../models/Order');
const Pizza = require('../models/Pizza');
const verify = require('../middleware/auth');

// Get single order
router.get('/:id', verify, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.base', 'name')
            .populate('items.sauce', 'name')
            .populate('items.cheese', 'name')
            .populate('items.veggies', 'name');
        if (!order) return res.status(404).send('Order not found');
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user orders
router.get('/', verify, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin get all orders
router.get('/all', verify, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access Denied');
    try {
        const orders = await Order.find()
            .populate('user', 'name')
            .populate('items.base', 'name')
            .populate('items.sauce', 'name')
            .populate('items.cheese', 'name')
            .populate('items.veggies', 'name');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Place order
router.post('/', verify, async (req, res) => {
    const order = new Order({
        user: req.user._id,
        items: req.body.items,
        totalAmount: req.body.totalAmount,
        paymentId: req.body.paymentId
    });

    try {
        // Decrement Stock
        for (const item of req.body.items) {
            await Pizza.findByIdAndUpdate(item.base, { $inc: { stock: -1 } });
            await Pizza.findByIdAndUpdate(item.sauce, { $inc: { stock: -1 } });
            await Pizza.findByIdAndUpdate(item.cheese, { $inc: { stock: -1 } });
            for (const veggieId of item.veggies) {
                await Pizza.findByIdAndUpdate(veggieId, { $inc: { stock: -1 } });
            }
        }

        const savedOrder = await order.save();

        // Emit event to Admin Dashboard (Optional, if we had a dedicated room)
        // req.io.emit('new_order', savedOrder); 

        res.send(savedOrder);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update status (Admin)
router.patch('/:id/status', verify, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access Denied');

    try {
        const order = await Order.findById(req.params.id);
        order.status = req.body.status; // 'Order Received', 'In the Kitchen', etc.
        const updatedOrder = await order.save();

        // Emit event to specific order room
        req.io.to(order._id.toString()).emit('order_updated', updatedOrder);

        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
