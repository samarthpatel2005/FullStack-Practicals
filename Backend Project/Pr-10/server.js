const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Set view engine to handle HTML templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to display available log files
app.get('/', (req, res) => {
    const logsDir = path.join(__dirname, 'logs');
    
    // Check if logs directory exists
    if (!fs.existsSync(logsDir)) {
        return res.render('index', { 
            error: 'Logs directory not found. Please create a "logs" folder and add some .txt files.',
            files: []
        });
    }
    
    try {
        // Read all files in logs directory
        const files = fs.readdirSync(logsDir);
        const txtFiles = files.filter(file => path.extname(file) === '.txt');
        
        res.render('index', { 
            error: null,
            files: txtFiles
        });
    } catch (error) {
        res.render('index', { 
            error: 'Error reading logs directory: ' + error.message,
            files: []
        });
    }
});

// Route to view specific log file
app.get('/log/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'logs', filename);
    
    // Validate file extension for security
    if (path.extname(filename) !== '.txt') {
        return res.status(400).render('log-viewer', {
            filename: filename,
            content: null,
            error: 'Only .txt files are allowed'
        });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).render('log-viewer', {
            filename: filename,
            content: null,
            error: 'Log file not found'
        });
    }
    
    try {
        // Read file content
        const content = fs.readFileSync(filePath, 'utf8');
        res.render('log-viewer', {
            filename: filename,
            content: content,
            error: null
        });
    } catch (error) {
        res.status(500).render('log-viewer', {
            filename: filename,
            content: null,
            error: 'Error reading file: ' + error.message
        });
    }
});

// API endpoint to get log content as JSON
app.get('/api/log/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'logs', filename);
    
    // Validate file extension
    if (path.extname(filename) !== '.txt') {
        return res.status(400).json({
            success: false,
            error: 'Only .txt files are allowed'
        });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            error: 'Log file not found'
        });
    }
    
    try {
        // Read file content
        const content = fs.readFileSync(filePath, 'utf8');
        const stats = fs.statSync(filePath);
        
        res.json({
            success: true,
            filename: filename,
            content: content,
            size: stats.size,
            lastModified: stats.mtime
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error reading file: ' + error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).render('error', {
        error: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        error: 'Page not found'
    });
});

app.listen(PORT, () => {
    console.log(`Error Log Viewer Server running on http://localhost:${PORT}`);
    console.log('Make sure to create a "logs" folder with .txt files to view');
});
