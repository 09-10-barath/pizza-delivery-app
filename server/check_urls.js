const mongoose = require('mongoose');
const Pizza = require('./models/Pizza');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const items = await Pizza.find();
        console.log('Total items in database:', items.length);
        console.log('\n--- Image URLs in MongoDB ---\n');
        items.forEach(item => {
            console.log(`${item.category.toUpperCase()}: ${item.name}`);
            console.log(`  URL: ${item.image}`);
            console.log('');
        });
        process.exit(0);
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });
