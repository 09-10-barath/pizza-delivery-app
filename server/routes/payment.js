const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// Create Order
router.post('/create-order', async (req, res) => {
    try {
        console.log('=== PAYMENT CREATE ORDER CALLED ===');
        console.log('Request body:', req.body);
        console.log('Amount:', req.body.amount);

        const options = {
            amount: req.body.amount * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: "receipt_order_" + Date.now(),
        };

        console.log('Creating Razorpay order with options:', options);
        const order = await instance.orders.create(options);
        console.log('Razorpay order created successfully:', order.id);

        if (!order) return res.status(500).send("Some error occured");
        res.json(order);
    } catch (error) {
        console.error('=== PAYMENT ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error details:', error);
        res.status(500).json({ error: error.message, details: error.toString() });
    }
});

// Verify Payment (Optional if we just trust the client's success callback for now)
// Verify Payment
router.post('/verify', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
});

module.exports = router;
