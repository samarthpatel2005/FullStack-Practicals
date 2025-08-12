const express = require('express');
const path = require('path');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Root route - redirect to home
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Home route - main dashboard page
app.get('/home', (req, res) => {
    const currentTime = new Date().toLocaleString();
    const teamInfo = {
        projectName: 'Express.js Project Template',
        version: '1.0.0',
        description: 'A basic Express.js application template for new teams',
        features: [
            'Express.js server setup',
            'Static file serving',
            'EJS templating',
            'Responsive design',
            'Modular structure'
        ],
        currentTime: currentTime
    };
    
    res.render('home', { 
        title: 'Welcome to Your New Project',
        teamInfo: teamInfo
    });
});

// API route for getting project info
app.get('/api/info', (req, res) => {
    res.json({
        success: true,
        project: 'Express.js Project Template',
        version: '1.0.0',
        author: 'Development Team',
        description: 'Basic Express.js application template',
        routes: [
            { path: '/', method: 'GET', description: 'Redirects to /home' },
            { path: '/home', method: 'GET', description: 'Main dashboard page' },
            { path: '/api/info', method: 'GET', description: 'Project information API' }
        ],
        timestamp: new Date().toISOString()
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found',
        error: '404 - Page Not Found',
        message: 'The page you are looking for does not exist.',
        backLink: '/home'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).render('error', {
        title: 'Server Error',
        error: '500 - Internal Server Error',
        message: 'Something went wrong on our end.',
        backLink: '/home'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Express.js Project Template Server Started!');
    console.log(`📍 Server running on http://localhost:${PORT}`);
    console.log(`🏠 Home page: http://localhost:${PORT}/home`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📡 API info: http://localhost:${PORT}/api/info`);
    console.log('💡 Ready for development!');
});
