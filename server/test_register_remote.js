const axios = require('axios');

const testRegister = async () => {
    try {
        const response = await axios.post('https://pizza-delivery-app-iwe3.onrender.com/api/user/register', {
            name: 'Admin User',
            email: 'admin@pizza.com',
            password: 'admin'
        });
        console.log('Registration successful:', response.data);
    } catch (err) {
        console.error('Registration failed:');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', JSON.stringify(err.response.data));
        } else {
            console.error('Error Message:', err.message);
        }
    }
};

testRegister();
