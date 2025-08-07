const https = require('https');

// URL to check - replace with your actual Vercel deployment URL
const url = 'https://carecap.vercel.app';

console.log(`Checking deployment status for ${url}...`);

https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Response size: ${data.length} bytes`);
    
    // Check if specific content from our changes is present
    const containsPackageText = data.includes('Weekly Care Package') || 
                               data.includes('Monthly Complete Care Package');
    const containsGstText = data.includes('GST (18%)');
    
    console.log(`Contains package text: ${containsPackageText}`);
    console.log(`Contains GST text: ${containsGstText}`);
    
    if (!containsPackageText || !containsGstText) {
      console.log('The deployment may not have the latest changes.');
      console.log('You might need to redeploy your application to Vercel.');
    } else {
      console.log('The deployment appears to have the latest changes!');
    }
  });
}).on('error', (err) => {
  console.error(`Error: ${err.message}`);
});