const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pizza = require('./models/Pizza');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.log(err));

const seedData = [
    // Bases
    { name: "Thin Crust", category: "base", price: 50, stock: 100, image: "${import.meta.env.VITE_API_URL}/images/thin_crust.jpg" },
    { name: "Thick Crust", category: "base", price: 60, stock: 100, image: "${import.meta.env.VITE_API_URL}/images/thick_crust.jpg" },
    { name: "Cheese Burst", category: "base", price: 80, stock: 50, image: "${import.meta.env.VITE_API_URL}/images/cheese_burst.jpg" },
    { name: "Gluten Free", category: "base", price: 100, stock: 50, image: "${import.meta.env.VITE_API_URL}/images/gluten_free.jpg" },
    { name: "Whole Wheat", category: "base", price: 70, stock: 80, image: "${import.meta.env.VITE_API_URL}/images/whole_wheat.jpg" },

    // Sauces
    { name: "Tomato Basil", category: "sauce", price: 20, stock: 100, image: "${import.meta.env.VITE_API_URL}/images/tomato_basil.jpg" },
    { name: "Spicy Red", category: "sauce", price: 25, stock: 100, image: "${import.meta.env.VITE_API_URL}/images/spicy_red.jpg" },
    { name: "Pesto", category: "sauce", price: 30, stock: 80, image: "${import.meta.env.VITE_API_URL}/images/pesto.jpg" },
    { name: "BBQ", category: "sauce", price: 30, stock: 80, image: "${import.meta.env.VITE_API_URL}/images/bbq.jpg" },
    { name: "White Garlic", category: "sauce", price: 25, stock: 80, image: "${import.meta.env.VITE_API_URL}/images/white_garlic.jpg" },

    // Cheese
    { name: "Mozzarella", category: "cheese", price: 40, stock: 100, image: "${import.meta.env.VITE_API_URL}/images/mozzarella.jpg" },
    { name: "Cheddar", category: "cheese", price: 45, stock: 100, image: "${import.meta.env.VITE_API_URL}/images/cheddar.jpg" },
    { name: "Parmesan", category: "cheese", price: 50, stock: 80, image: "${import.meta.env.VITE_API_URL}/images/parmesan.jpg" },
    { name: "Gouda", category: "cheese", price: 50, stock: 80, image: "${import.meta.env.VITE_API_URL}/images/gouda.jpg" },

    // Veggies
    { name: "Onion", category: "veggie", price: 10, stock: 200, image: "${import.meta.env.VITE_API_URL}/images/onion.jpg" },
    { name: "Tomato", category: "veggie", price: 10, stock: 200, image: "${import.meta.env.VITE_API_URL}/images/tomato.jpg" },
    { name: "Bell Pepper", category: "veggie", price: 15, stock: 150, image: "${import.meta.env.VITE_API_URL}/images/bell_pepper.jpg" },
    { name: "Mushroom", category: "veggie", price: 20, stock: 150, image: "${import.meta.env.VITE_API_URL}/images/mushroom.jpg" },
    { name: "Corn", category: "veggie", price: 15, stock: 150, image: "${import.meta.env.VITE_API_URL}/images/corn.jpg" },
    { name: "Jalapeno", category: "veggie", price: 20, stock: 100, image: "${import.meta.env.VITE_API_URL}/images/jalapeno.jpg" },
    { name: "Olives", category: "veggie", price: 25, stock: 100, image: "${import.meta.env.VITE_API_URL}/images/olives.jpg" },
];

const seedDB = async () => {
    await Pizza.deleteMany({});
    await Pizza.insertMany(seedData);
    console.log("Database Seeded!");
    mongoose.connection.close();
};

seedDB();
