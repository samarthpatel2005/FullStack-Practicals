// Library Portal - Session Management System
// Express.js server with user sessions, login/logout functionality
// Tracks user login time and session information

const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3015;

// In-memory user storage (in production, use a database)
const users = new Map();
const activeSessions = new Map();

// Add some demo users for testing
const demoUsers = [
    { username: 'alice', name: 'Alice Johnson', password: 'password123' },
    { username: 'bob', name: 'Bob Smith', password: 'password123' },
    { username: 'carol', name: 'Carol Davis', password: 'password123' },
    { username: 'admin', name: 'Library Admin', password: 'admin123' }
];

// Hash passwords and store demo users
(async () => {
    for (const user of demoUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        users.set(user.username, {
            username: user.username,
            name: user.name,
            password: hashedPassword,
            registeredAt: new Date(),
            totalSessions: 0,
            lastLogin: null
        });
    }
    console.log('📚 Demo users created:', demoUsers.map(u => u.username).join(', '));
})();

// Session configuration
app.use(session({
    secret: 'library-portal-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    name: 'libraryPortalSession',
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    },
    // Store additional session metadata
    genid: function(req) {
        const sessionId = require('crypto').randomBytes(16).toString('hex');
        return `lib_${sessionId}`;
    }
}));

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const sessionInfo = req.session.user ? `[User: ${req.session.user.username}]` : '[Anonymous]';
    console.log(`${timestamp} - ${req.method} ${req.url} ${sessionInfo}`);
    next();
});

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/login?error=Please login to access this page');
    }
}

// Redirect authenticated users middleware
function redirectIfAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect('/profile');
    }
    next();
}

// Utility functions
function formatDuration(startTime, endTime = new Date()) {
    const duration = Math.floor((endTime - startTime) / 1000); // seconds
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

function getSessionInfo(req) {
    if (!req.session.user) return null;
    
    return {
        sessionId: req.sessionID,
        username: req.session.user.username,
        name: req.session.user.name,
        loginTime: req.session.loginTime,
        loginTimeFormatted: req.session.loginTime.toLocaleString(),
        sessionDuration: formatDuration(req.session.loginTime),
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        isActive: true,
        sessionData: {
            views: req.session.views || 0,
            lastActivity: new Date().toLocaleString()
        }
    };
}

// Routes

// Home page - redirect based on authentication status
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/profile');
    } else {
        res.redirect('/login');
    }
});

// Login page
app.get('/login', redirectIfAuthenticated, (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    
    res.render('login', {
        title: 'Library Portal - Login',
        error: error,
        success: success,
        totalUsers: users.size,
        activeSessions: activeSessions.size
    });
});

// Login POST handler
app.post('/login', redirectIfAuthenticated, async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Validate input
        if (!username || !password) {
            return res.render('login', {
                title: 'Library Portal - Login',
                error: 'Please provide both username and password',
                success: null,
                totalUsers: users.size,
                activeSessions: activeSessions.size
            });
        }
        
        // Check if user exists
        const user = users.get(username.toLowerCase());
        if (!user) {
            return res.render('login', {
                title: 'Library Portal - Login',
                error: 'Invalid username or password',
                success: null,
                totalUsers: users.size,
                activeSessions: activeSessions.size
            });
        }
        
        // Verify password
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.render('login', {
                title: 'Library Portal - Login',
                error: 'Invalid username or password',
                success: null,
                totalUsers: users.size,
                activeSessions: activeSessions.size
            });
        }
        
        // Create session
        const loginTime = new Date();
        req.session.user = {
            username: user.username,
            name: user.name
        };
        req.session.loginTime = loginTime;
        req.session.views = 0;
        
        // Update user stats
        user.lastLogin = loginTime;
        user.totalSessions += 1;
        users.set(username.toLowerCase(), user);
        
        // Track active session
        activeSessions.set(req.sessionID, {
            username: user.username,
            name: user.name,
            loginTime: loginTime,
            sessionId: req.sessionID,
            ipAddress: req.ip || req.connection.remoteAddress
        });
        
        console.log(`✅ User logged in: ${user.username} (Session: ${req.sessionID})`);
        
        res.redirect('/profile');
        
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', {
            title: 'Library Portal - Login',
            error: 'An error occurred during login. Please try again.',
            success: null,
            totalUsers: users.size,
            activeSessions: activeSessions.size
        });
    }
});

// Register page
app.get('/register', redirectIfAuthenticated, (req, res) => {
    const error = req.query.error || null;
    const success = req.query.success || null;
    
    res.render('register', {
        title: 'Library Portal - Register',
        error: error,
        success: success
    });
});

// Register POST handler
app.post('/register', redirectIfAuthenticated, async (req, res) => {
    const { username, name, password, confirmPassword } = req.body;
    
    try {
        // Validate input
        if (!username || !name || !password || !confirmPassword) {
            return res.render('register', {
                title: 'Library Portal - Register',
                error: 'Please fill in all fields',
                success: null
            });
        }
        
        if (password !== confirmPassword) {
            return res.render('register', {
                title: 'Library Portal - Register',
                error: 'Passwords do not match',
                success: null
            });
        }
        
        if (password.length < 6) {
            return res.render('register', {
                title: 'Library Portal - Register',
                error: 'Password must be at least 6 characters long',
                success: null
            });
        }
        
        // Check if username already exists
        if (users.has(username.toLowerCase())) {
            return res.render('register', {
                title: 'Library Portal - Register',
                error: 'Username already exists',
                success: null
            });
        }
        
        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username: username.toLowerCase(),
            name: name.trim(),
            password: hashedPassword,
            registeredAt: new Date(),
            totalSessions: 0,
            lastLogin: null
        };
        
        users.set(username.toLowerCase(), newUser);
        
        console.log(`📝 New user registered: ${username}`);
        
        res.redirect('/login?success=Registration successful! Please log in.');
        
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', {
            title: 'Library Portal - Register',
            error: 'An error occurred during registration. Please try again.',
            success: null
        });
    }
});

// Profile page (protected route)
app.get('/profile', requireAuth, (req, res) => {
    // Increment page views
    req.session.views = (req.session.views || 0) + 1;
    
    const sessionInfo = getSessionInfo(req);
    const userData = users.get(req.session.user.username);
    
    // Get all active sessions for admin view
    const allActiveSessions = Array.from(activeSessions.values());
    
    res.render('profile', {
        title: 'Library Portal - Profile',
        user: userData,
        session: sessionInfo,
        activeSessions: allActiveSessions,
        totalUsers: users.size,
        isAdmin: req.session.user.username === 'admin'
    });
});

// Library dashboard (protected route)
app.get('/dashboard', requireAuth, (req, res) => {
    req.session.views = (req.session.views || 0) + 1;
    
    const sessionInfo = getSessionInfo(req);
    const userData = users.get(req.session.user.username);
    
    // Mock library data
    const libraryStats = {
        totalBooks: 15420,
        availableBooks: 12350,
        borrowedBooks: 3070,
        totalMembers: users.size,
        activeMembers: activeSessions.size,
        newBooks: 25,
        popularBooks: [
            'The Great Gatsby',
            'To Kill a Mockingbird',
            '1984',
            'Pride and Prejudice',
            'The Catcher in the Rye'
        ]
    };
    
    res.render('dashboard', {
        title: 'Library Portal - Dashboard',
        user: userData,
        session: sessionInfo,
        stats: libraryStats
    });
});

// Session info API endpoint
app.get('/api/session', requireAuth, (req, res) => {
    const sessionInfo = getSessionInfo(req);
    res.json({
        success: true,
        session: sessionInfo,
        serverTime: new Date().toISOString()
    });
});

// Logout handler
app.post('/logout', requireAuth, (req, res) => {
    const username = req.session.user.username;
    const sessionId = req.sessionID;
    
    // Remove from active sessions
    activeSessions.delete(sessionId);
    
    // Destroy session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/profile?error=Error logging out');
        }
        
        console.log(`👋 User logged out: ${username} (Session: ${sessionId})`);
        
        // Clear session cookie
        res.clearCookie('libraryPortalSession');
        res.redirect('/login?success=Successfully logged out');
    });
});

// Admin route to view all sessions (admin only)
app.get('/admin/sessions', requireAuth, (req, res) => {
    if (req.session.user.username !== 'admin') {
        return res.status(403).render('error', {
            title: 'Access Denied',
            error: 'You do not have permission to access this page',
            user: req.session.user
        });
    }
    
    const allActiveSessions = Array.from(activeSessions.values());
    const allUsers = Array.from(users.values()).map(user => ({
        ...user,
        password: undefined // Don't send password
    }));
    
    res.render('admin-sessions', {
        title: 'Library Portal - Session Management',
        user: req.session.user,
        activeSessions: allActiveSessions,
        allUsers: allUsers,
        totalUsers: users.size
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found',
        error: 'The page you are looking for does not exist.',
        user: req.session.user || null
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).render('error', {
        title: 'Server Error',
        error: 'An internal server error occurred.',
        user: req.session.user || null
    });
});

// Cleanup inactive sessions periodically
setInterval(() => {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [sessionId, sessionData] of activeSessions.entries()) {
        // Remove sessions older than 24 hours
        if (now - sessionData.loginTime.getTime() > 24 * 60 * 60 * 1000) {
            activeSessions.delete(sessionId);
            cleanedCount++;
        }
    }
    
    if (cleanedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanedCount} inactive sessions`);
    }
}, 60 * 60 * 1000); // Run every hour

// Start server
app.listen(PORT, () => {
    console.log(`📚 Library Portal is running on http://localhost:${PORT}`);
    console.log(`🔐 Session management enabled with secure cookies`);
    console.log(`👥 Demo users available: ${demoUsers.map(u => u.username).join(', ')}`);
    console.log(`🔑 Default password for demo users: password123 (admin: admin123)`);
    console.log(`💾 Session storage: In-memory (use database in production)`);
});

module.exports = app;