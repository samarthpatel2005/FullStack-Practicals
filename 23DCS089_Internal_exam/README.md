# Netflix Clone

A fully functional Netflix clone built with Node.js, Express, MongoDB, and vanilla JavaScript. This application replicates the core features of Netflix including browsing movies/TV shows, search functionality, and trailer viewing.

## 🎯 Features

- **🏠 Home Page**: Display trending, popular, and top-rated content
- **🎬 Movies & TV Shows**: Browse content by categories
- **🔍 Search**: Real-time search across movies and TV shows  
- **🎥 Trailers**: Watch trailers in modal popups
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎨 Netflix UI**: Authentic Netflix-like interface
- **🗄️ MongoDB**: All data stored and retrieved from MongoDB

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Axios** - HTTP client for TMDB API
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with modern features
- **Vanilla JavaScript** - No frameworks, pure JS
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### External APIs
- **TMDB API** - Movie and TV show data
- **YouTube** - Trailer videos

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **TMDB API Key** (free from [TMDB](https://www.themoviedb.org/settings/api))

## 🚀 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <your-repository-url>
cd netflix-clone
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Environment Configuration
Create a \`.env\` file in the backend directory:
\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/netflix-clone
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/netflix-clone

# Server Configuration
PORT=3000
NODE_ENV=development

# TMDB API Key (Required)
TMDB_API_KEY=your_tmdb_api_key_here
\`\`\`

### 4. Get TMDB API Key
1. Visit [TMDB](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Copy your API key and add it to the \`.env\` file

### 5. Start MongoDB
Make sure MongoDB is running on your system:
\`\`\`bash
# For local MongoDB
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
\`\`\`

### 6. Seed the Database
Populate your MongoDB with movie and TV show data:
\`\`\`bash
npm run seed
\`\`\`
*Note: This process may take 5-10 minutes as it fetches data from TMDB API.*

### 7. Start the Backend Server
\`\`\`bash
npm start
# or for development with auto-restart
npm run dev
\`\`\`

### 8. Frontend Setup
Open a new terminal and navigate to the frontend directory:
\`\`\`bash
cd ../frontend
\`\`\`

Serve the frontend using a simple HTTP server:
\`\`\`bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js http-server (install globally first)
npm install -g http-server
http-server -p 8000

# Using Live Server extension in VS Code
# Right-click on index.html and select "Open with Live Server"
\`\`\`

### 9. Access the Application
- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

## 📁 Project Structure

\`\`\`
netflix-clone/
├── backend/
│   ├── models/
│   │   ├── Movie.js          # Movie schema
│   │   ├── TVShow.js         # TV show schema
│   │   └── Genre.js          # Genre schema
│   ├── routes/
│   │   ├── movies.js         # Movie endpoints
│   │   └── tv.js             # TV show endpoints
│   ├── services/
│   │   ├── tmdbService.js    # TMDB API integration
│   │   └── seedDatabase.js   # Database seeding
│   ├── server.js             # Express server
│   ├── package.json          # Dependencies
│   └── .env                  # Environment variables
└── frontend/
    ├── css/
    │   └── styles.css        # All styling
    ├── js/
    │   ├── api.js            # API service layer
    │   └── app.js            # Main application logic
    ├── assets/               # Images and other assets
    └── index.html            # Main HTML file
\`\`\`

## 🌐 API Endpoints

### Movies
- \`GET /api/movies\` - Get all movies with pagination
- \`GET /api/movies/category/:category\` - Get movies by category
- \`GET /api/movies/trending\` - Get trending movies
- \`GET /api/movies/:id\` - Get movie by ID
- \`GET /api/movies/:id/similar\` - Get similar movies
- \`GET /api/movies/search/:query\` - Search movies

### TV Shows
- \`GET /api/tv\` - Get all TV shows with pagination
- \`GET /api/tv/category/:category\` - Get TV shows by category
- \`GET /api/tv/trending\` - Get trending TV shows
- \`GET /api/tv/:id\` - Get TV show by ID
- \`GET /api/tv/:id/similar\` - Get similar TV shows
- \`GET /api/tv/search/:query\` - Search TV shows

### General
- \`GET /api/health\` - Health check endpoint

## 🎬 Usage

1. **Browse Content**: Navigate through different categories using the navbar
2. **Search**: Use the search bar to find specific movies or TV shows
3. **View Details**: Click on any content card to view details and trailer
4. **Watch Trailers**: Trailers open in modal windows with YouTube integration
5. **Navigation**: Use the hero banner buttons or card interactions

## 🔧 Configuration Options

### Environment Variables
\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/netflix-clone

# Server
PORT=3000
NODE_ENV=production

# External APIs
TMDB_API_KEY=your_api_key_here
\`\`\`

### API Rate Limiting
The application includes built-in delays to respect TMDB API rate limits during database seeding.

## 📱 Responsive Design

The application is fully responsive and supports:
- **Desktop**: Full feature set with hover effects
- **Tablet**: Optimized layout and touch interactions
- **Mobile**: Condensed UI with touch-friendly controls

## 🔍 Troubleshooting

### Common Issues

1. **API Key Error**
   \`\`\`
   Error: TMDB API key not configured
   \`\`\`
   **Solution**: Add your TMDB API key to the \`.env\` file

2. **MongoDB Connection Error**
   \`\`\`
   Error: MongoDB connection failed
   \`\`\`
   **Solution**: Ensure MongoDB is running and the connection string is correct

3. **CORS Error**
   \`\`\`
   Error: Cross-origin request blocked
   \`\`\`
   **Solution**: Make sure the backend server is running on port 3000

4. **No Content Loading**
   \`\`\`
   Error: Failed to fetch content
   \`\`\`
   **Solution**: Run the database seeding command: \`npm run seed\`

### Database Issues
- **Empty Database**: Run \`npm run seed\` to populate with content
- **Slow Loading**: Database seeding is in progress, wait for completion
- **Connection Timeout**: Check MongoDB service status

## 🚀 Deployment

### Backend Deployment (Heroku Example)
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git or GitHub integration

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend assets
2. Update API endpoints to production URLs
3. Deploy to your preferred hosting service

### Database Deployment (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update \`MONGODB_URI\` in environment variables
3. Run database seeding on production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is for educational purposes. Please respect TMDB's API terms of service and Netflix's trademarks.

## 🙏 Acknowledgments

- **TMDB** for providing the movie and TV show data
- **Netflix** for the UI/UX inspiration
- **MongoDB** for the database solution
- **YouTube** for trailer hosting

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository

---

**Note**: This is a clone for educational purposes only. All content and data belong to their respective owners.