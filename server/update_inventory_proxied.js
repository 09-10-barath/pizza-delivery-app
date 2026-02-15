const mongoose = require('mongoose');
const Pizza = require('./models/Pizza');
require('dotenv').config();

const realisticImages = {
    'Thin Crust': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pizza_%2823%29.jpg/300px-Pizza_%2823%29.jpg',
    'Thick Crust': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Large-crust_pizza.jpg/300px-Large-crust_pizza.jpg',
    'Cheese Burst': 'https://images.weserv.nl/?url=ssl:images.unsplash.com/photo-1590947132387-155cc02f3212&w=600',
    'Gluten Free': 'https://images.weserv.nl/?url=ssl:images.unsplash.com/photo-1565299624946-b28f40a0ae38&w=600',
    'Whole Wheat': 'https://images.weserv.nl/?url=ssl:images.unsplash.com/photo-1601050690597-df0568f70950&w=600',
    'Tomato Basil': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Homemade_tomato_sauce_-_2.jpg/300px-Homemade_tomato_sauce_-_2.jpg',
    'Spicy Red': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sriracha_sauce.JPG/300px-Sriracha_sauce.JPG',
    'Pesto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Pesto_alla_genovese.jpg/300px-Pesto_alla_genovese.jpg',
    'BBQ Sauce': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Barbecue_sauce.JPG/300px-Barbecue_sauce.JPG',
    'White Garlic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Garlic_sauce.jpg/300px-Garlic_sauce.jpg',
    'Mozzarella': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mozzarella_cheese.jpg/300px-Mozzarella_cheese.jpg',
    'Cheddar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/2022-05-11-Cheddar-.jpg/300px-2022-05-11-Cheddar-.jpg',
    'Parmesan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Parmesan_cheese.jpg/300px-Parmesan_cheese.jpg',
    'Gouda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Gouda.jpg/300px-Gouda.jpg',
    'Onion': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sliced_red_onion.jpg/300px-Sliced_red_onion.jpg',
    'Tomato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tomato_slice.jpg/300px-Tomato_slice.jpg',
    'Bell Pepper': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Green_Bell_Pepper.jpg/300px-Green_Bell_Pepper.jpg',
    'Mushroom': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Sliced_Mushrooms_1_2018-06-17.JPG/300px-Sliced_Mushrooms_1_2018-06-17.JPG',
    'Corn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Corn_on_the_cob_%28sweet_corn%29.jpg/300px-Corn_on_the_cob_%28sweet_corn%29.jpg',
    'Jalapeno': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Jalape%C3%B1o.png/300px-Jalape%C3%B1o.png',
    'Olives': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Black_Olives.JPG/300px-Black_Olives.JPG'
};

async function updateInventory() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await Pizza.updateOne(
            { name: "Inventory" },
            {
                $set: {
                    "bases.$[].image": "TBD",
                    "sauces.$[].image": "TBD",
                    "cheeses.$[].image": "TBD",
                    "veggies.$[].image": "TBD"
                }
            }
        );

        // Fetch the inventory to map correctly
        const inventory = await Pizza.findOne({ name: "Inventory" });

        for (const base of inventory.bases) {
            if (realisticImages[base.name]) base.image = realisticImages[base.name];
        }
        for (const sauce of inventory.sauces) {
            if (realisticImages[sauce.name]) sauce.image = realisticImages[sauce.name];
        }
        for (const cheese of inventory.cheeses) {
            if (realisticImages[cheese.name]) cheese.image = realisticImages[cheese.name];
        }
        for (const veggie of inventory.veggies) {
            if (realisticImages[veggie.name]) veggie.image = realisticImages[veggie.name];
        }

        await inventory.save();
        console.log('Inventory Updated with Proxied Realistic Images!');
        process.exit(0);
    } catch (err) {
        console.error('Update Failed:', err);
        process.exit(1);
    }
}

updateInventory();
