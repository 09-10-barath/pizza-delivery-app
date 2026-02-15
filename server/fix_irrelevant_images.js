const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ingredientsPath = path.join(__dirname, '../client/public/ingredients');
if (!fs.existsSync(ingredientsPath)) {
    fs.mkdirSync(ingredientsPath, { recursive: true });
}

const verifiedImages = {
    'thin_crust': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Pizza_dough_recipe.jpg/300px-Pizza_dough_recipe.jpg',
    'thick_crust': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Cheesy_crust_pizza.jpg/300px-Cheesy_crust_pizza.jpg',
    'cheese_burst': 'https://images.weserv.nl/?url=ssl:images.unsplash.com/photo-1590947132387-155cc02f3212&w=600',
    'gluten_free': 'https://images.weserv.nl/?url=ssl:images.unsplash.com/photo-1565299624946-b28f40a0ae38&w=600',
    'whole_wheat': 'https://images.weserv.nl/?url=ssl:images.unsplash.com/photo-1601050690597-df0568f70950&w=600',
    'tomato_basil': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Homemade_tomato_sauce_-_2.jpg/300px-Homemade_tomato_sauce_-_2.jpg',
    'spicy_red': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Sriracha_sauce.JPG/300px-Sriracha_sauce.JPG',
    'pesto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Pesto4.jpg/300px-Pesto4.jpg',
    'bbq': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Barbecue_sauce.JPG/300px-Barbecue_sauce.JPG',
    'white_garlic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Garlic_sauce.jpg/300px-Garlic_sauce.jpg',
    'mozzarella': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Mozzarella_cheese_%281%29.jpg/300px-Mozzarella_cheese_%281%29.jpg',
    'cheddar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/2022-05-11-Cheddar-.jpg/300px-2022-05-11-Cheddar-.jpg',
    'parmesan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Parmesan_cheese_20.jpg/300px-Parmesan_cheese_20.jpg',
    'gouda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/WikiCheese_-_Gouda_36_mois_01.jpg/300px-WikiCheese_-_Gouda_36_mois_01.jpg',
    'onion': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Sliced_red_onion.jpg/300px-Sliced_red_onion.jpg',
    'tomato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Tomato_slice.jpg/300px-Tomato_slice.jpg',
    'bell_pepper': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Green_Bell_Pepper.jpg/300px-Green_Bell_Pepper.jpg',
    'mushroom': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Sliced_Mushrooms_1_2018-06-17.JPG/300px-Sliced_Mushrooms_1_2018-06-17.JPG',
    'corn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Corn_on_the_cob_%28sweet_corn%29.jpg/300px-Corn_on_the_cob_%28sweet_corn%29.jpg',
    'jalapeno': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Jalape%C3%B1o.png/300px-Jalape%C3%B1o.png',
    'olives': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Black_Olives.JPG/300px-Black_Olives.JPG'
};

console.log('Starting download of 21 verified realistic images...');

let successCount = 0;
for (const [name, url] of Object.entries(verifiedImages)) {
    const dest = path.join(ingredientsPath, `${name}.jpg`);
    try {
        console.log(`Downloading ${name}...`);
        execSync(`curl.exe -L -k -s -o "${dest}" "${url}"`);

        // Verify file size
        const stats = fs.statSync(dest);
        if (stats.size > 1000) {
            console.log(`✓ Successfully downloaded ${name} (${Math.round(stats.size / 1024)} KB)`);
            successCount++;
        } else {
            console.warn(`⚠ Warning: ${name}.jpg is suspiciously small (${stats.size} bytes).`);
        }
    } catch (err) {
        console.error(`✗ Failed to download ${name}:`, err.message);
    }
}

console.log(`\nFinal Score: ${successCount}/21 images downloaded successfully.`);
