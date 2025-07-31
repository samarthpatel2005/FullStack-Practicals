# Backend Project

This project contains two Node.js practicals that share the same dependencies.

## Structure

```
Backend Project/
├── node_modules/          # Shared dependencies for both practicals
├── package.json          # Shared package configuration
├── package-lock.json     # Dependency lock file
├── Pr-8/                 # Practical 8 - Counter API
│   ├── server.js         # Express server with counter functionality
│   ├── counter.js        # Counter logic
│   ├── counter.json      # Counter data storage
│   └── public/           # Static files for web interface
└── Pr-9/                 # Practical 9 - Product Site Backend
    ├── server.js         # Express server for product site (Proof of Concept)
    ├── README.md         # Practical 9 specific documentation
    └── public/           # Professional product site interface
```

## Projects Overview

### Practical 8 - Counter API
A complete counter application with API endpoints for increment, decrement, and reset operations. Demonstrates data persistence with JSON file storage.

### Practical 9 - Product Site Backend
A proof of concept Express.js server for a product site. Features clean, scalable architecture with home route displaying "Welcome to our site". Designed to help the development team understand Express framework structure.

## Running the Projects

### Practical 8 (Counter API)
```bash
npm run start:pr8
```
Server will run on http://localhost:3000

### Practical 9 (Product Site Backend)
```bash
npm run start:pr9
```
Server will run on http://localhost:3000
- Home route (`/`) displays "Welcome to our site"
- Includes API endpoints ready for future features

## Installation

```bash
npm install
```

This will install all dependencies in the shared `node_modules` folder that both practicals can use.

## Development Benefits

- **Shared Dependencies**: Both projects use the same `node_modules`, saving disk space
- **Consistent Environment**: Same Express version across all practicals
- **Easy Management**: Single `npm install` for all backend projects
- **Scalable Structure**: Ready for additional practicals in the future
