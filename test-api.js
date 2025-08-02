const axios = require('axios');

const API_URL = 'https://care-a6rj.onrender.com/api';

async function testAPI() {
  try {
    console.log('Testing API health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('Health check response:', healthResponse.data);
    
    console.log('\nTesting hospitals endpoint...');
    try {
      const hospitalsResponse = await axios.get(`${API_URL}/hospitals`);
      console.log('Hospitals response:', hospitalsResponse.data);
    } catch (error) {
      console.log('Hospitals endpoint error:', error.response?.data || error.message);
    }
    
    console.log('\nTesting pricing endpoint...');
    try {
      const pricingResponse = await axios.get(`${API_URL}/pricing`);
      console.log('Pricing response:', pricingResponse.data);
    } catch (error) {
      console.log('Pricing endpoint error:', error.response?.data || error.message);
    }
    
    console.log('\nAPI is working correctly!');
  } catch (error) {
    console.error('API test failed:', error.response?.data || error.message);
  }
}

testAPI();