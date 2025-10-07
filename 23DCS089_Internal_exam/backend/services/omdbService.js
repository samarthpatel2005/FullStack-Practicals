const axios = require('axios');
const Movie = require('../models/Movie');
const TVShow = require('../models/TVShow');
const Genre = require('../models/Genre');

// Load environment variables
require('dotenv').config();

const OMDB_BASE_URL = 'http://www.omdbapi.com/';
const OMDB_API_KEY = process.env.OMDB_API_KEY;

class OMDbService {
  constructor() {
    this.apiKey = OMDB_API_KEY;
    this.baseURL = OMDB_BASE_URL;
    console.log('OMDb API Key loaded:', this.apiKey ? 'Yes' : 'No');
    console.log('API Key value:', this.apiKey);
  }

  // Generic API call method
  async apiCall(params = {}) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          apikey: this.apiKey,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error(`OMDb API Error:`, error.message);
      throw error;
    }
  }

  // Search for movies/shows
  async searchContent(title, type = '', year = '', page = 1) {
    try {
      const params = {
        s: title,
        page: page
      };
      
      if (type) params.type = type; // movie, series, episode
      if (year) params.y = year;
      
      const data = await this.apiCall(params);
      return data;
    } catch (error) {
      console.error(`Error searching for "${title}":`, error.message);
      return null;
    }
  }

  // Get detailed info by IMDb ID
  async getDetailedInfo(imdbId) {
    try {
      const data = await this.apiCall({
        i: imdbId,
        plot: 'full'
      });
      return data;
    } catch (error) {
      console.error(`Error fetching details for ${imdbId}:`, error.message);
      return null;
    }
  }

  // Convert OMDb data to our Movie schema
  convertToMovieSchema(omdbData, category = 'popular') {
    return {
      tmdb_id: parseInt(omdbData.imdbID.replace('tt', '')), // Convert imdbID to number
      title: omdbData.Title,
      overview: omdbData.Plot,
      release_date: new Date(omdbData.Released),
      poster_path: omdbData.Poster !== 'N/A' ? omdbData.Poster : null,
      backdrop_path: omdbData.Poster !== 'N/A' ? omdbData.Poster : null, // OMDb doesn't have backdrop
      genre_ids: this.genreNamesToIds(omdbData.Genre),
      genres: this.genreNamesToArray(omdbData.Genre),
      vote_average: parseFloat(omdbData.imdbRating) || 0,
      vote_count: parseInt(omdbData.imdbVotes?.replace(/,/g, '')) || 0,
      popularity: this.calculatePopularity(omdbData),
      adult: omdbData.Rated === 'R' || omdbData.Rated === 'NC-17',
      original_language: omdbData.Language?.split(',')[0]?.trim().toLowerCase() || 'en',
      original_title: omdbData.Title,
      video: false,
      trailer_key: null, // OMDb doesn't provide trailer info
      runtime: parseInt(omdbData.Runtime?.replace(' min', '')) || null,
      budget: null, // OMDb doesn't provide budget
      revenue: omdbData.BoxOffice ? this.parseBoxOffice(omdbData.BoxOffice) : null,
      tagline: null, // OMDb doesn't provide tagline
      status: 'Released',
      category: category,
      imdb_id: omdbData.imdbID,
      director: omdbData.Director,
      writer: omdbData.Writer,
      actors: omdbData.Actors,
      awards: omdbData.Awards,
      metascore: parseInt(omdbData.Metascore) || null,
      production: omdbData.Production
    };
  }

  // Convert OMDb data to our TVShow schema
  convertToTVSchema(omdbData, category = 'popular') {
    return {
      tmdb_id: parseInt(omdbData.imdbID.replace('tt', '')),
      name: omdbData.Title,
      original_name: omdbData.Title,
      overview: omdbData.Plot,
      first_air_date: new Date(omdbData.Released),
      last_air_date: omdbData.endYear ? new Date(`${omdbData.endYear}-12-31`) : null,
      poster_path: omdbData.Poster !== 'N/A' ? omdbData.Poster : null,
      backdrop_path: omdbData.Poster !== 'N/A' ? omdbData.Poster : null,
      genre_ids: this.genreNamesToIds(omdbData.Genre),
      genres: this.genreNamesToArray(omdbData.Genre),
      vote_average: parseFloat(omdbData.imdbRating) || 0,
      vote_count: parseInt(omdbData.imdbVotes?.replace(/,/g, '')) || 0,
      popularity: this.calculatePopularity(omdbData),
      adult: omdbData.Rated === 'TV-MA' || omdbData.Rated === 'R',
      original_language: omdbData.Language?.split(',')[0]?.trim().toLowerCase() || 'en',
      origin_country: ['US'], // Default, OMDb doesn't always provide this
      number_of_episodes: parseInt(omdbData.totalSeasons) ? parseInt(omdbData.totalSeasons) * 10 : null, // Estimate
      number_of_seasons: parseInt(omdbData.totalSeasons) || 1,
      episode_run_time: [parseInt(omdbData.Runtime?.replace(' min', '')) || 45],
      in_production: omdbData.Year?.includes('–') && !omdbData.Year?.includes('2023'),
      status: omdbData.Year?.includes('–') ? 'Returning Series' : 'Ended',
      type: 'Scripted',
      trailer_key: null,
      tagline: null,
      homepage: null,
      category: category,
      imdb_id: omdbData.imdbID,
      director: omdbData.Director,
      writer: omdbData.Writer,
      actors: omdbData.Actors,
      awards: omdbData.Awards,
      metascore: parseInt(omdbData.Metascore) || null
    };
  }

  // Helper functions
  genreNamesToIds(genreString) {
    if (!genreString || genreString === 'N/A') return [];
    const genreMap = {
      'Action': 28, 'Adventure': 12, 'Animation': 16, 'Comedy': 35, 'Crime': 80,
      'Documentary': 99, 'Drama': 18, 'Family': 10751, 'Fantasy': 14, 'History': 36,
      'Horror': 27, 'Music': 10402, 'Mystery': 9648, 'Romance': 10749, 'Science Fiction': 878,
      'Sci-Fi': 878, 'Thriller': 53, 'War': 10752, 'Western': 37, 'Biography': 36,
      'Sport': 9648, 'Musical': 10402, 'Film-Noir': 53
    };
    
    return genreString.split(',').map(genre => 
      genreMap[genre.trim()] || 18 // Default to Drama if not found
    ).filter(Boolean);
  }

  genreNamesToArray(genreString) {
    if (!genreString || genreString === 'N/A') return [];
    return genreString.split(',').map((genre, index) => ({
      id: this.genreNamesToIds(genreString)[index] || 18,
      name: genre.trim()
    }));
  }

  calculatePopularity(omdbData) {
    const rating = parseFloat(omdbData.imdbRating) || 0;
    const votes = parseInt(omdbData.imdbVotes?.replace(/,/g, '')) || 0;
    return Math.min((rating * Math.log10(votes + 1)) * 10, 1000);
  }

  parseBoxOffice(boxOfficeString) {
    if (!boxOfficeString || boxOfficeString === 'N/A') return null;
    const cleaned = boxOfficeString.replace(/[$,]/g, '');
    return parseInt(cleaned) || null;
  }

  // Fetch popular movies
  async fetchPopularMovies() {
    console.log('Fetching popular movies from OMDb...');
    
    const popularTitles = [
      'The Dark Knight', 'Inception', 'Pulp Fiction', 'The Godfather', 'Forrest Gump',
      'The Matrix', 'Goodfellas', 'The Departed', 'Fight Club', 'The Prestige',
      'Interstellar', 'Gladiator', 'The Avengers', 'Iron Man', 'Spider-Man',
      'Batman Begins', 'Casino Royale', 'Skyfall', 'Mad Max Fury Road', 'John Wick'
    ];

    for (const title of popularTitles) {
      try {
        const searchResult = await this.searchContent(title, 'movie');
        
        if (searchResult && searchResult.Response === 'True' && searchResult.Search) {
          const movieData = searchResult.Search[0]; // Get first result
          const detailedData = await this.getDetailedInfo(movieData.imdbID);
          
          if (detailedData && detailedData.Response === 'True') {
            const movieDoc = this.convertToMovieSchema(detailedData, 'popular');
            
            await Movie.findOneAndUpdate(
              { imdb_id: movieDoc.imdb_id },
              movieDoc,
              { upsert: true, new: true }
            );
            
            console.log(`✅ Saved movie: ${detailedData.Title}`);
          }
        }
        
        // Small delay to respect API limits
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`Error processing movie "${title}":`, error.message);
      }
    }
  }

  // Fetch top-rated movies
  async fetchTopRatedMovies() {
    console.log('Fetching top-rated movies from OMDb...');
    
    const topRatedTitles = [
      'The Shawshank Redemption', 'The Godfather Part II', 'Schindlers List',
      '12 Angry Men', 'The Lord of the Rings The Return of the King',
      'The Good the Bad and the Ugly', 'The Lord of the Rings The Fellowship of the Ring',
      'Casablanca', 'Seven Samurai', 'The Lord of the Rings The Two Towers',
      'Star Wars', 'Citizen Kane', 'Saving Private Ryan', 'Spirited Away'
    ];

    for (const title of topRatedTitles) {
      try {
        const searchResult = await this.searchContent(title, 'movie');
        
        if (searchResult && searchResult.Response === 'True' && searchResult.Search) {
          const movieData = searchResult.Search[0];
          const detailedData = await this.getDetailedInfo(movieData.imdbID);
          
          if (detailedData && detailedData.Response === 'True') {
            const movieDoc = this.convertToMovieSchema(detailedData, 'top_rated');
            
            await Movie.findOneAndUpdate(
              { imdb_id: movieDoc.imdb_id },
              movieDoc,
              { upsert: true, new: true }
            );
            
            console.log(`✅ Saved top-rated movie: ${detailedData.Title}`);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`Error processing top-rated movie "${title}":`, error.message);
      }
    }
  }

  // Fetch popular TV shows
  async fetchPopularTVShows() {
    console.log('Fetching popular TV shows from OMDb...');
    
    const popularTVShows = [
      'Breaking Bad', 'Game of Thrones', 'The Sopranos', 'The Wire', 'Friends',
      'The Office', 'Stranger Things', 'The Crown', 'Sherlock', 'Westworld',
      'House of Cards', 'Better Call Saul', 'Narcos', 'The Walking Dead',
      'Lost', 'Prison Break', 'Dexter', 'How I Met Your Mother', 'The Big Bang Theory'
    ];

    for (const title of popularTVShows) {
      try {
        const searchResult = await this.searchContent(title, 'series');
        
        if (searchResult && searchResult.Response === 'True' && searchResult.Search) {
          const tvData = searchResult.Search[0];
          const detailedData = await this.getDetailedInfo(tvData.imdbID);
          
          if (detailedData && detailedData.Response === 'True') {
            const tvDoc = this.convertToTVSchema(detailedData, 'popular');
            
            await TVShow.findOneAndUpdate(
              { imdb_id: tvDoc.imdb_id },
              tvDoc,
              { upsert: true, new: true }
            );
            
            console.log(`✅ Saved TV show: ${detailedData.Title}`);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`Error processing TV show "${title}":`, error.message);
      }
    }
  }

  // Fetch and save genres
  async fetchGenres() {
    console.log('Setting up genres...');
    
    const movieGenres = [
      { tmdb_id: 28, name: "Action", type: "movie" },
      { tmdb_id: 12, name: "Adventure", type: "movie" },
      { tmdb_id: 16, name: "Animation", type: "movie" },
      { tmdb_id: 35, name: "Comedy", type: "movie" },
      { tmdb_id: 80, name: "Crime", type: "movie" },
      { tmdb_id: 99, name: "Documentary", type: "movie" },
      { tmdb_id: 18, name: "Drama", type: "movie" },
      { tmdb_id: 10751, name: "Family", type: "movie" },
      { tmdb_id: 14, name: "Fantasy", type: "movie" },
      { tmdb_id: 36, name: "History", type: "movie" },
      { tmdb_id: 27, name: "Horror", type: "movie" },
      { tmdb_id: 10402, name: "Music", type: "movie" },
      { tmdb_id: 9648, name: "Mystery", type: "movie" },
      { tmdb_id: 10749, name: "Romance", type: "movie" },
      { tmdb_id: 878, name: "Science Fiction", type: "movie" },
      { tmdb_id: 53, name: "Thriller", type: "movie" },
      { tmdb_id: 10752, name: "War", type: "movie" },
      { tmdb_id: 37, name: "Western", type: "movie" }
    ];

    const tvGenres = [
      { tmdb_id: 10759, name: "Action & Adventure", type: "tv" },
      { tmdb_id: 10762, name: "Animation", type: "tv" }, // Different ID for TV animation
      { tmdb_id: 10763, name: "Comedy", type: "tv" },
      { tmdb_id: 10764, name: "Crime", type: "tv" },
      { tmdb_id: 10765, name: "Documentary", type: "tv" },
      { tmdb_id: 10766, name: "Drama", type: "tv" },
      { tmdb_id: 10767, name: "Family", type: "tv" },
      { tmdb_id: 10768, name: "Mystery", type: "tv" },
      { tmdb_id: 10769, name: "Sci-Fi & Fantasy", type: "tv" }
    ];

    for (const genre of [...movieGenres, ...tvGenres]) {
      await Genre.findOneAndUpdate(
        { tmdb_id: genre.tmdb_id, type: genre.type },
        genre,
        { upsert: true, new: true }
      );
    }

    console.log('✅ Genres setup completed');
  }

  // Main seeding function
  async seedDatabase() {
    try {
      console.log('🎬 Starting database seeding with OMDb API...');
      
      // Check if API key is configured
      if (!this.apiKey) {
        throw new Error('OMDb API key not configured');
      }

      // Test API connection
      const testResult = await this.apiCall({ i: 'tt0111161' }); // The Shawshank Redemption
      if (testResult.Response !== 'True') {
        throw new Error('OMDb API connection failed');
      }
      
      console.log('✅ OMDb API connection successful');
      
      // Setup genres
      await this.fetchGenres();
      
      // Fetch different categories
      await this.fetchPopularMovies();
      await this.fetchTopRatedMovies();
      await this.fetchPopularTVShows();
      
      console.log('\n🎉 Database seeding completed successfully!');
      console.log('📊 Summary:');
      
      const movieCount = await Movie.countDocuments();
      const tvCount = await TVShow.countDocuments();
      const genreCount = await Genre.countDocuments();
      
      console.log(`   - ${movieCount} movies added`);
      console.log(`   - ${tvCount} TV shows added`);
      console.log(`   - ${genreCount} genres added`);
      console.log('\n✨ Your Netflix clone is ready to use!');
      
    } catch (error) {
      console.error('❌ Error during database seeding:', error.message);
      throw error;
    }
  }
}

module.exports = OMDbService;