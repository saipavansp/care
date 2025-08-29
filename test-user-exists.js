const axios = require('axios');

async function checkUserExists() {
  try {
    // This endpoint might not exist - it's just an example
    // You might need to create a special endpoint for this check
    const response = await axios.post('https://care-a6rj.onrender.com/api/auth/check-user', {
      phone: '9966255644'
    });
    
    console.log('User check response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking user:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkUserExists();