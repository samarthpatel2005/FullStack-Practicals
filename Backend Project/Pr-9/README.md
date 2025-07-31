# Practical 9 - Express Product Site Backend

## Overview

This is a proof of concept Express.js server created for a small product site. The project demonstrates clean, scalable backend architecture that the development team can use to understand the Express framework structure.

## Project Requirements

**Manager's Request:** Set up a backend for a small product site with a basic Express JS server. When someone visits the home route, it should display "Welcome to our site". The code should be clean and scalable for future features.

## Features

- ✅ **Home Route**: Displays "Welcome to our site" message
- ✅ **Clean Architecture**: Well-structured, scalable code
- ✅ **API Endpoints**: Ready for future product features
- ✅ **Static File Serving**: Professional frontend interface
- ✅ **Error Handling**: Robust server implementation

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Home route - displays welcome message |
| GET | `/api/products` | Products API endpoint (ready for future implementation) |
| GET | `/about` | About company information |

## Project Structure

```
Pr-9/
├── server.js          # Main Express server with clean, scalable structure
├── public/
│   ├── index.html     # Professional product site interface
│   ├── style.css      # Modern, responsive styling
│   └── script.js      # Client-side API testing functionality
└── README.md          # Project documentation
```

## Setup Instructions

1. **Navigate to Backend Project directory**:
   ```bash
   cd "Backend Project"
   ```

2. **Install dependencies** (shared with Pr-8):
   ```bash
   npm install
   ```

3. **Run the server**:
   ```bash
   npm run start:pr9
   ```
   
   Or directly:
   ```bash
   node Pr-9/server.js
   ```

4. **Access the application**:
   - Open browser and visit: `http://localhost:3000`
   - Home route will display: "Welcome to our site"
   - Use the web interface to test all API endpoints

## Technical Details

- **Framework**: Express.js
- **Port**: 3000 (configurable via PORT environment variable)
- **Static Files**: Served from `public/` directory
- **Architecture**: Clean, modular structure ready for scaling

## Future Scalability

The codebase is designed to easily accommodate:
- Product catalog management
- User authentication
- Shopping cart functionality
- Payment processing
- Admin dashboard
- Database integration

## Team Learning Objectives

This proof of concept helps the development team understand:
1. Express.js server setup and configuration
2. Route handling and middleware implementation
3. Static file serving
4. API endpoint structure
5. Clean, maintainable code practices
6. Scalable backend architecture patterns
   ```
   git clone <repository-url>
   cd Pr-9
   ```

2. **Install dependencies**:
   Since this project shares `node_modules` with Practical 8, ensure you have the necessary packages installed. Run:
   ```
   npm install
   ```

3. **Start the server**:
   To start the server, run:
   ```
   node server.js
   ```
   The server will be running at `http://localhost:3000`.

## Usage

- Open your web browser and navigate to `http://localhost:3000` to view the application.
- The application interacts with the server through API calls defined in `server.js`.

## Additional Information

- Modify the `public/style.css` file to change the appearance of the application.
- Update `public/script.js` to add or modify client-side functionality.
- Refer to the `package.json` file for scripts and dependencies used in the project.