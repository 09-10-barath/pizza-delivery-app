const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ingredientsPath = path.join(__dirname, '../client/public/ingredients');

if (!fs.existsSync(ingredientsPath)) {
    fs.mkdirSync(ingredientsPath, { recursive: true });
}

// Verified food photography IDs from Unsplash
const verifiedIds = {
    'thin_crust': '1558930234151-6e1f0e4231b9',
    'thick_crust': '1571407970349-bc81e7e96d47',
    'cheese_burst': '1590947132387-155cc02f3212',
    'gluten_free': '1541745537411-b8046dc6d66c',
    'whole_wheat': '1601050690597-df0568f70950',
    'tomato_basil': '1592924357228-91a4daadcfea',
    'spicy_red': '158827552401-30058a0fe57b',
    'pesto': '1614050212739-15891d4e4c27',
    'bbq': '1475510664654-e0eb6a581452',
    'white_garlic': '1553530666-ba11a7da3888', // This was the smoothie, changing ID
    'white_garlic': '1628156173007-88902581699f', // Garlic oil/sauce
    'mozzarella': '1647414902888-06727be8e77c',
    'cheddar': '1618164436241-4473940d1f5c',
    'parmesan': '1553835973-dec43bfddbeb',
    'gouda': '1510431199102-f71b1ccf013d',
    'onion': '1508747703725-71977713d540',
    'tomato': '1592924357228-91a4daadcfea',
    'bell_pepper': '1566275529824-cca6d008f3da',
    'mushroom': '1581403662580-e717804470d0',
    'corn': '1551754655-cd27e38d2076',
    'jalapeno': '1504192010706-96799066601b',
    'olives': '1520141680190-b1d83049197c'
};

console.log('Starting final proxy-based download of 21 verified realistic images...');

let successCount = 0;
for (const [name, id] of Object.entries(verifiedIds)) {
    // weserv.nl proxy is very robust for fetching Unsplash images
    const url = `https://images.weserv.nl/?url=ssl:images.unsplash.com/photo-${id}&w=600&h=400&fit=cover&output=jpg&q=80`;
    const dest = path.join(ingredientsPath, `${name}.jpg`);

    try {
        console.log(`Downloading ${name}...`);
        // Use curl.exe directly for speed and reliability
        execSync(`curl.exe -L -k -s -o "${dest}" "${url}"`);

        const stats = fs.statSync(dest);
        if (stats.size > 10000) {
            console.log(`✓ Successfully downloaded ${name} (${Math.round(stats.size / 1024)} KB)`);
            successCount++;
        } else {
            console.warn(`⚠ Warning: ${name}.jpg is too small (${stats.size} bytes). Possibly a bad photo ID or proxy error.`);
        }
    } catch (err) {
        console.error(`✗ Failed to download ${name}:`, err.message);
    }
}

console.log(`\nFinal Score: ${successCount}/21 images downloaded successfully.`);
process.exit(0);
