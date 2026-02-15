const router = require('express').Router();
const Pizza = require('../models/Pizza');
const verify = require('../middleware/auth');
const sendEmail = require('../utils/email');

// Get all inventory (for admin and user pizza builder)
router.get('/', async (req, res) => {
    try {
        const inventory = await Pizza.find();
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add inventory (Admin only)
router.post('/add', verify, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access Denied');

    const pizza = new Pizza({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        image: req.body.image
    });

    try {
        const savedPizza = await pizza.save();
        res.send(savedPizza);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update stock (Admin or after order)
router.post('/update-stock/:id', verify, async (req, res) => {
    // Logic to update stock and check threshold
    try {
        const pizza = await Pizza.findById(req.params.id);
        pizza.stock = req.body.stock;
        await pizza.save();

        if (pizza.stock < 20) {
            // Trigger email to admin
            await sendEmail(process.env.ADMIN_EMAIL || "admin@example.com", "Low Stock Alert", `Stock for ${pizza.name} is low (Current: ${pizza.stock}).`);
            console.log(`Low stock alert for ${pizza.name}`);
        }

        res.send(pizza);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update Image (Admin only)
router.patch('/update-image/:id', verify, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access Denied');
    try {
        const pizza = await Pizza.findByIdAndUpdate(
            req.params.id,
            { image: req.body.image },
            { new: true }
        );
        res.send(pizza);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
