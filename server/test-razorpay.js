const Razorpay = require('razorpay');
require('dotenv').config();

console.log('Testing Razorpay Configuration...\n');
console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? '***' + process.env.RAZORPAY_KEY_SECRET.slice(-4) : 'NOT SET');
console.log('');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function testRazorpay() {
    try {
        console.log('Creating test order...');
        const options = {
            amount: 10000, // 100 INR in paise
            currency: "INR",
            receipt: "test_receipt_" + Date.now(),
        };

        const order = await instance.orders.create(options);
        console.log('✅ SUCCESS! Razorpay is working correctly');
        console.log('Order ID:', order.id);
        console.log('Amount:', order.amount / 100, 'INR');
        console.log('\nYour Razorpay keys are valid!');
    } catch (error) {
        console.log('❌ ERROR! Razorpay initialization failed');
        console.log('Error message:', error.message);
        console.log('\nPossible issues:');
        console.log('1. Your Razorpay keys are invalid or expired');
        console.log('2. You need to get valid test keys from https://dashboard.razorpay.com/app/keys');
        console.log('3. Make sure you\'re using TEST mode keys (they start with rzp_test_)');
    }
}

testRazorpay();
