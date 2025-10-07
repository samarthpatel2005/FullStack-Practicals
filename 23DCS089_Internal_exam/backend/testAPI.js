const axios = require('axios');

async function testAPI() {
  try {
    console.log('🔍 Testing API endpoints...');
    
    // Test movies endpoint
    const response = await axios.get('http://localhost:3000/api/movies');
    console.log(`✅ Movies API: Status ${response.status}`);
    console.log('📊 Response structure:', typeof response.data);
    console.log('📊 Response keys:', Object.keys(response.data));
    console.log('📊 Full response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();