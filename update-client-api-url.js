// This script will update all API URLs in the client code
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const OLD_URL = 'http://localhost:5000/api';
const NEW_URL = 'https://care-a6rj.onrender.com/api';

// Update api.js
const apiJsPath = path.join(__dirname, 'client', 'src', 'services', 'api.js');
let apiJsContent = fs.readFileSync(apiJsPath, 'utf8');
apiJsContent = apiJsContent.replace(
  `const API_URL = process.env.REACT_APP_API_URL || '${OLD_URL}';`,
  `const API_URL = process.env.REACT_APP_API_URL || '${NEW_URL}';`
);
fs.writeFileSync(apiJsPath, apiJsContent);
console.log('✅ Updated API URL in api.js');

// Create or update .env.development file
const envPath = path.join(__dirname, 'client', '.env.development');
fs.writeFileSync(envPath, `REACT_APP_API_URL=${NEW_URL}\n`);
console.log('✅ Created/updated .env.development');

// Create or update .env.production file
const envProdPath = path.join(__dirname, 'client', '.env.production');
fs.writeFileSync(envProdPath, `REACT_APP_API_URL=${NEW_URL}\n`);
console.log('✅ Created/updated .env.production');

console.log('\n🔄 Stopping and restarting client...');
// Kill any running client process and restart
exec('cd client && npm start', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error restarting client: ${error.message}`);
    return;
  }
  console.log('🚀 Client restarted with new API URL');
});

console.log('\n✨ All API URLs updated to:', NEW_URL);
console.log('👉 Please clear your browser cache and restart the client if needed.');