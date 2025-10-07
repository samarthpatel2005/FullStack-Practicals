const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

// Get all movies with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      genre,
      sort = '-popularity',
      search
    } = req.query;

    const query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by genre
    if (genre) {
      query.genre_ids = { $in: [parseInt(genre)] };
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { overview: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      lean: true
    };

    const movies = await Movie.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Movie.countDocuments(query);

    res.json({
      success: true,
      data: movies,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_results: total,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies',
      error: error.message
    });
  }
});

// Get movies by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;

    const movies = await Movie.find({ category })
      .sort('-popularity')
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: movies,
      category: category
    });
  } catch (error) {
    console.error('Error fetching movies by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies by category',
      error: error.message
    });
  }
});

// Get trending movies
router.get('/trending', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const movies = await Movie.find({})
      .sort('-popularity -vote_average')
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending movies',
      error: error.message
    });
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let movie;
    
    // Try to find by IMDb ID first
    if (id.startsWith('tt') || id.length === 7) {
      movie = await Movie.findOne({ imdb_id: id }).lean();
    }
    
    // Try to find by TMDB ID if not found
    if (!movie && !isNaN(id)) {
      movie = await Movie.findOne({ tmdb_id: parseInt(id) }).lean();
    }
    
    // Try to find by MongoDB ID if still not found
    if (!movie) {
      try {
        movie = await Movie.findById(id).lean();
      } catch (e) {
        // Invalid ObjectId format
      }
    }

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movie',
      error: error.message
    });
  }
});

// Get similar movies
router.get('/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    const movie = await Movie.findOne({ tmdb_id: parseInt(id) }).lean();
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Find similar movies based on genres
    const similarMovies = await Movie.find({
      tmdb_id: { $ne: movie.tmdb_id },
      genre_ids: { $in: movie.genre_ids }
    })
    .sort('-vote_average -popularity')
    .limit(parseInt(limit))
    .lean();

    res.json({
      success: true,
      data: similarMovies
    });
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch similar movies',
      error: error.message
    });
  }
});

// Search movies
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { overview: { $regex: query, $options: 'i' } }
      ]
    };

    const movies = await Movie.find(searchQuery)
      .sort('-popularity')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Movie.countDocuments(searchQuery);

    res.json({
      success: true,
      data: movies,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_results: total,
        per_page: parseInt(limit)
      },
      query: query
    });
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search movies',
      error: error.message
    });
  }
});

module.exports = router;