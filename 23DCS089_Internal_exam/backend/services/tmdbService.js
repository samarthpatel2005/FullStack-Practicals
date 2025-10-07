const axios = require('axios');
const Movie = require('../models/Movie');
const TVShow = require('../models/TVShow');
const Genre = require('../models/Genre');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

class TMDBService {
  constructor() {
    this.apiKey = TMDB_API_KEY;
    this.baseURL = TMDB_BASE_URL;
  }

  // Generic API call method
  async apiCall(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params: {
          api_key: this.apiKey,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error(`TMDB API Error for ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Get movie trailer
  async getMovieTrailer(movieId) {
    try {
      const data = await this.apiCall(`/movie/${movieId}/videos`);
      const trailer = data.results.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailer ? trailer.key : null;
    } catch (error) {
      console.error(`Error fetching trailer for movie ${movieId}:`, error.message);
      return null;
    }
  }

  // Get TV show trailer
  async getTVTrailer(tvId) {
    try {
      const data = await this.apiCall(`/tv/${tvId}/videos`);
      const trailer = data.results.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailer ? trailer.key : null;
    } catch (error) {
      console.error(`Error fetching trailer for TV show ${tvId}:`, error.message);
      return null;
    }
  }

  // Fetch and save movies by category
  async fetchMovies(category = 'popular', pages = 3) {
    console.log(`Fetching ${category} movies...`);
    
    for (let page = 1; page <= pages; page++) {
      try {
        const data = await this.apiCall(`/movie/${category}`, { page });
        
        for (const movieData of data.results) {
          try {
            // Get detailed movie info
            const detailedMovie = await this.apiCall(`/movie/${movieData.id}`);
            
            // Get trailer
            const trailerKey = await this.getMovieTrailer(movieData.id);
            
            const movieDoc = {
              tmdb_id: movieData.id,
              title: movieData.title,
              overview: movieData.overview,
              release_date: new Date(movieData.release_date),
              poster_path: movieData.poster_path,
              backdrop_path: movieData.backdrop_path,
              genre_ids: movieData.genre_ids,
              genres: detailedMovie.genres,
              vote_average: movieData.vote_average,
              vote_count: movieData.vote_count,
              popularity: movieData.popularity,
              adult: movieData.adult,
              original_language: movieData.original_language,
              original_title: movieData.original_title,
              video: movieData.video,
              trailer_key: trailerKey,
              runtime: detailedMovie.runtime,
              budget: detailedMovie.budget,
              revenue: detailedMovie.revenue,
              tagline: detailedMovie.tagline,
              status: detailedMovie.status,
              category: category
            };

            await Movie.findOneAndUpdate(
              { tmdb_id: movieData.id },
              movieDoc,
              { upsert: true, new: true }
            );

            console.log(`Saved movie: ${movieData.title}`);
            
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            console.error(`Error processing movie ${movieData.title}:`, error.message);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${category} movies page ${page}:`, error.message);
      }
    }
  }

  // Fetch and save TV shows by category
  async fetchTVShows(category = 'popular', pages = 3) {
    console.log(`Fetching ${category} TV shows...`);
    
    for (let page = 1; page <= pages; page++) {
      try {
        const data = await this.apiCall(`/tv/${category}`, { page });
        
        for (const tvData of data.results) {
          try {
            // Get detailed TV show info
            const detailedTV = await this.apiCall(`/tv/${tvData.id}`);
            
            // Get trailer
            const trailerKey = await this.getTVTrailer(tvData.id);
            
            const tvDoc = {
              tmdb_id: tvData.id,
              name: tvData.name,
              original_name: tvData.original_name,
              overview: tvData.overview,
              first_air_date: new Date(tvData.first_air_date),
              last_air_date: detailedTV.last_air_date ? new Date(detailedTV.last_air_date) : null,
              poster_path: tvData.poster_path,
              backdrop_path: tvData.backdrop_path,
              genre_ids: tvData.genre_ids,
              genres: detailedTV.genres,
              vote_average: tvData.vote_average,
              vote_count: tvData.vote_count,
              popularity: tvData.popularity,
              adult: tvData.adult,
              original_language: tvData.original_language,
              origin_country: tvData.origin_country,
              number_of_episodes: detailedTV.number_of_episodes,
              number_of_seasons: detailedTV.number_of_seasons,
              episode_run_time: detailedTV.episode_run_time,
              in_production: detailedTV.in_production,
              status: detailedTV.status,
              type: detailedTV.type,
              trailer_key: trailerKey,
              tagline: detailedTV.tagline,
              homepage: detailedTV.homepage,
              category: category,
              created_by: detailedTV.created_by,
              networks: detailedTV.networks,
              production_companies: detailedTV.production_companies,
              seasons: detailedTV.seasons
            };

            await TVShow.findOneAndUpdate(
              { tmdb_id: tvData.id },
              tvDoc,
              { upsert: true, new: true }
            );

            console.log(`Saved TV show: ${tvData.name}`);
            
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            console.error(`Error processing TV show ${tvData.name}:`, error.message);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${category} TV shows page ${page}:`, error.message);
      }
    }
  }

  // Fetch and save genres
  async fetchGenres() {
    console.log('Fetching genres...');
    
    try {
      // Fetch movie genres
      const movieGenres = await this.apiCall('/genre/movie/list');
      for (const genre of movieGenres.genres) {
        await Genre.findOneAndUpdate(
          { tmdb_id: genre.id, type: 'movie' },
          { tmdb_id: genre.id, name: genre.name, type: 'movie' },
          { upsert: true, new: true }
        );
      }

      // Fetch TV genres
      const tvGenres = await this.apiCall('/genre/tv/list');
      for (const genre of tvGenres.genres) {
        await Genre.findOneAndUpdate(
          { tmdb_id: genre.id, type: 'tv' },
          { tmdb_id: genre.id, name: genre.name, type: 'tv' },
          { upsert: true, new: true }
        );
      }

      console.log('Genres saved successfully');
    } catch (error) {
      console.error('Error fetching genres:', error.message);
    }
  }

  // Main seeding function
  async seedDatabase() {
    try {
      console.log('Starting database seeding...');
      
      // Fetch genres first
      await this.fetchGenres();
      
      // Fetch different categories of movies
      await this.fetchMovies('popular', 2);
      await this.fetchMovies('top_rated', 2);
      await this.fetchMovies('upcoming', 1);
      await this.fetchMovies('now_playing', 1);
      
      // Fetch different categories of TV shows
      await this.fetchTVShows('popular', 2);
      await this.fetchTVShows('top_rated', 2);
      await this.fetchTVShows('on_the_air', 1);
      await this.fetchTVShows('airing_today', 1);
      
      console.log('Database seeding completed successfully!');
    } catch (error) {
      console.error('Error during database seeding:', error.message);
    }
  }
}

module.exports = TMDBService;