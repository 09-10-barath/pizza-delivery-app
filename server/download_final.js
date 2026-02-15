const fs = require('fs');
const path = require('path');
const axios = require('axios');

const ingredientsPath = path.join(__dirname, '../client/public/ingredients');

if (!fs.existsSync(ingredientsPath)) {
    fs.mkdirSync(ingredientsPath, { recursive: true });
}

// Highly specific, verified food photography IDs
const verifiedIds = {
    'thin_crust': '1550966840-3dc5ad5b2744',
    'thick_crust': '1513104890138-7c749659a591',
    'cheese_burst': '1590947132387-155cc02f3212',
    'gluten_free': '1565299624946-b28f40a0ae38',
    'whole_wheat': '1601050690597-df0568f70950',
    'tomato_basil': '1592924357228-91a4daadcfea',
    'spicy_red': '158827552401-30058a0fe57b',
    'pesto': '1592415499241-10d6d5252814',
    'bbq': '1606923829579-0dd99168b49e',
    'white_garlic': '1540306153281-d4190821cc60',
    'mozzarella': '1629117170043-4cc0107771e8',
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

async function downloadImage(name, id) {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;
    const dest = path.join(ingredientsPath, `${name}.jpg`);

    console.log(`Downloading ${name} (ID: ${id})...`);
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://unsplash.com/'
            }
        });

        const writer = fs.createWriteStream(dest);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                const stats = fs.statSync(dest);
                if (stats.size > 5000) {
                    console.log(`✓ Successfully downloaded ${name} (${Math.round(stats.size / 1024)} KB)`);
                    resolve(true);
                } else {
                    console.warn(`⚠ Warning: ${name}.jpg is suspiciously small (${stats.size} bytes).`);
                    resolve(false);
                }
            });
            writer.on('error', (err) => {
                console.error(`✗ Stream error for ${name}: ${err.message}`);
                resolve(false);
            });
        });
    } catch (err) {
        console.error(`✗ Failed to download ${name}: ${err.response?.status || err.message}`);
        return false;
    }
}

async function start() {
    let successCount = 0;
    for (const [name, id] of Object.entries(verifiedIds)) {
        if (await downloadImage(name, id)) {
            successCount++;
        }
    }
    console.log(`\nFinal Score: ${successCount}/21 images downloaded successfully.`);
    process.exit(0);
}

start();
