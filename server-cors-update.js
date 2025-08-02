// Update this in your Render environment variables
// Go to Render dashboard > Your service > Environment
// Add/update the CLIENT_URL variable

// Example CORS configuration:
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://care-companion.vercel.app', // Your Vercel URL
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));