import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

// Movie API calls
export const getMovies = async (page = 1) => {
  try {
    const response = await api.get(`/movies?page=${page}`);
    return response.data.data; // Return the data array from the API response
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const getMovieById = async (id) => {
  try {
    const response = await api.get(`/movies/${id}`);
    return response.data.data; // Return the data from the API response
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    throw error;
  }
};

// TV Shows API calls
export const getTVShows = async (page = 1) => {
  try {
    const response = await api.get(`/tv?page=${page}`);
    return response.data.data; // Return the data array from the API response
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    throw error;
  }
};

export const getTVShowById = async (id) => {
  try {
    const response = await api.get(`/tv/${id}`);
    return response.data.data; // Return the data from the API response
  } catch (error) {
    console.error('Error fetching TV show by ID:', error);
    throw error;
  }
};

// Search API calls
export const searchMovies = async (query) => {
  try {
    const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}`);
    return response.data.data; // Return the data array from the API response
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const searchTVShows = async (query) => {
  try {
    const response = await api.get(`/tv/search?q=${encodeURIComponent(query)}`);
    return response.data.data; // Return the data array from the API response
  } catch (error) {
    console.error('Error searching TV shows:', error);
    throw error;
  }
};

// Combined search for both movies and TV shows
export const searchAll = async (query) => {
  try {
    const [movieResults, tvResults] = await Promise.all([
      searchMovies(query).catch(() => []),
      searchTVShows(query).catch(() => [])
    ]);
    
    return [...movieResults, ...tvResults];
  } catch (error) {
    console.error('Error searching all content:', error);
    throw error;
  }
};

// Utility function to get poster URL
export const getPosterUrl = (posterPath) => {
  if (!posterPath) return '/api/placeholder/300/450';
  if (posterPath.startsWith('http')) return posterPath;
  return posterPath;
};

// Utility function to get backdrop URL
export const getBackdropUrl = (backdropPath) => {
  if (!backdropPath) return '/api/placeholder/1920/1080';
  if (backdropPath.startsWith('http')) return backdropPath;
  return backdropPath;
};

export default api;