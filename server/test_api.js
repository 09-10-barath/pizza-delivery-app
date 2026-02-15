const axios = require('axios');

axios.get('http://localhost:5000/api/inventory')
    .then(response => {
        console.log('API Response (first 3 items):');
        console.log(JSON.stringify(response.data.slice(0, 3), null, 2));
    })
    .catch(error => {
        console.error('Error fetching inventory:', error.message);
    });
