const axios = require('axios');

// Test the login API
async function testLoginAPI() {
  try {
    console.log('Testing login API...');
    
    // First, test if the server is reachable
    console.log('Testing server connection...');
    const healthResponse = await axios.get('https://care-a6rj.onrender.com/api/health');
    console.log('Health check response:', healthResponse.data);
    
    // Now test login
    console.log('\nTesting login endpoint...');
    const loginResponse = await axios.post('https://care-a6rj.onrender.com/api/auth/login', {
      phone: '9876543210',
      password: 'demo123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', loginResponse.data);
    
    return true;
  } catch (error) {
    console.error('Error testing API:');
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
    return false;
  }
}

testLoginAPI();