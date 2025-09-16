const express = require('express');
const path = require('path');
const app = express();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Home route - Welcome message for the product site
app.get('/', (req, res) => {
  res.send('Welcome to our site');
});

// API route for future features (keeping scalable structure)
app.get('/api/products', (req, res) => {
  res.json({ 
    message: 'Product API endpoint ready for future implementation',
    products: []
  });
});

// About route for additional site information
app.get('/about', (req, res) => {
  res.json({
    company: 'Our Company',
    message: 'Building amazing products for our customers'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Product Site Server running at http://localhost:${PORT}`);
  console.log('📝 Visit http://localhost:3000 to see "Welcome to our site"');
});