const axios = require('axios');
const bcrypt = require('bcryptjs');

async function createDemoUser() {
  try {
    // You'll need an admin token or a special endpoint for this
    // This is just an example - you'll need to adapt it to your API
    const response = await axios.post('https://care-a6rj.onrender.com/api/auth/admin/create-user', {
      phone: '9876543210',
      password: 'demo123',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'user'
    }, {
      headers: {
        // You might need an admin token here
        'Content-Type': 'application/json'
      }
    });
    
    console.log('User creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

createDemoUser();