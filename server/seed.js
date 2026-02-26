const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pizza = require('./models/Pizza');

dotenv.config();

console.log('--- Database Seeding Script ---');

const seedData = [
    // Bases
    { name: "Thin Crust", category: "base", price: 50, stock: 100, image: "/images/thin_crust.jpg" },
    { name: "Thick Crust", category: "base", price: 60, stock: 100, image: "/images/thick_crust.jpg" },
    { name: "Cheese Burst", category: "base", price: 80, stock: 50, image: "/images/cheese_burst.jpg" },
    { name: "Gluten Free", category: "base", price: 100, stock: 50, image: "/images/gluten_free.jpg" },
    { name: "Whole Wheat", category: "base", price: 70, stock: 80, image: "/images/whole_wheat.jpg" },

    // Sauces
    { name: "Tomato Basil", category: "sauce", price: 20, stock: 100, image: "/images/tomato_basil.jpg" },
    { name: "Spicy Red", category: "sauce", price: 25, stock: 100, image: "/images/spicy_red.jpg" },
    { name: "Pesto", category: "sauce", price: 30, stock: 80, image: "/images/pesto.jpg" },
    { name: "BBQ", category: "sauce", price: 30, stock: 80, image: "/images/bbq.jpg" },
    { name: "White Garlic", category: "sauce", price: 25, stock: 80, image: "/images/white_garlic.jpg" },

    // Cheese
    { name: "Mozzarella", category: "cheese", price: 40, stock: 100, image: "/images/mozzarella.jpg" },
    { name: "Cheddar", category: "cheese", price: 45, stock: 100, image: "/images/cheddar.jpg" },
    { name: "Parmesan", category: "cheese", price: 50, stock: 80, image: "/images/parmesan.jpg" },
    { name: "Gouda", category: "cheese", price: 50, stock: 80, image: "/images/gouda.jpg" },

    // Veggies
    { name: "Onion", category: "veggie", price: 10, stock: 200, image: "/images/onion.jpg" },
    { name: "Tomato", category: "veggie", price: 10, stock: 200, image: "/images/tomato.jpg" },
    { name: "Bell Pepper", category: "veggie", price: 15, stock: 150, image: "/images/bell_pepper.jpg" },
    { name: "Mushroom", category: "veggie", price: 20, stock: 150, image: "/images/mushroom.jpg" },
    { name: "Corn", category: "veggie", price: 15, stock: 150, image: "/images/corn.jpg" },
    { name: "Jalapeno", category: "veggie", price: 20, stock: 100, image: "/images/jalapeno.jpg" },
    { name: "Olives", category: "veggie", price: 25, stock: 100, image: "/images/olives.jpg" },
];

async function seedDB() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env file');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        console.log('Cleaning existing collection...');
        await Pizza.deleteMany({});
        
        console.log('Inserting seed data...');
        const result = await Pizza.insertMany(seedData);
        console.log(`✅ Successfully inserted ${result.length} items`);

        console.log('--- Seeding Completed ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during seeding:', err.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

seedDB();
