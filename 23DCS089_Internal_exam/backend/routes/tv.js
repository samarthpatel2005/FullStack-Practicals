const express = require('express');
const TVShow = require('../models/TVShow');
const router = express.Router();

// Get all TV shows with pagination and filtering
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
        { name: { $regex: search, $options: 'i' } },
        { overview: { $regex: search, $options: 'i' } }
      ];
    }

    const tvShows = await TVShow.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await TVShow.countDocuments(query);

    res.json({
      success: true,
      data: tvShows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_results: total,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch TV shows',
      error: error.message
    });
  }
});

// Get TV shows by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;

    const tvShows = await TVShow.find({ category })
      .sort('-popularity')
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: tvShows,
      category: category
    });
  } catch (error) {
    console.error('Error fetching TV shows by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch TV shows by category',
      error: error.message
    });
  }
});

// Get trending TV shows
router.get('/trending', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const tvShows = await TVShow.find({})
      .sort('-popularity -vote_average')
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: tvShows
    });
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending TV shows',
      error: error.message
    });
  }
});

// Get TV show by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by TMDB ID first, then by MongoDB ID
    let tvShow = await TVShow.findOne({ tmdb_id: parseInt(id) }).lean();
    
    if (!tvShow) {
      tvShow = await TVShow.findById(id).lean();
    }

    if (!tvShow) {
      return res.status(404).json({
        success: false,
        message: 'TV show not found'
      });
    }

    res.json({
      success: true,
      data: tvShow
    });
  } catch (error) {
    console.error('Error fetching TV show:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch TV show',
      error: error.message
    });
  }
});

// Get similar TV shows
router.get('/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    const tvShow = await TVShow.findOne({ tmdb_id: parseInt(id) }).lean();
    
    if (!tvShow) {
      return res.status(404).json({
        success: false,
        message: 'TV show not found'
      });
    }

    // Find similar TV shows based on genres
    const similarTVShows = await TVShow.find({
      tmdb_id: { $ne: tvShow.tmdb_id },
      genre_ids: { $in: tvShow.genre_ids }
    })
    .sort('-vote_average -popularity')
    .limit(parseInt(limit))
    .lean();

    res.json({
      success: true,
      data: similarTVShows
    });
  } catch (error) {
    console.error('Error fetching similar TV shows:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch similar TV shows',
      error: error.message
    });
  }
});

// Search TV shows
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { overview: { $regex: query, $options: 'i' } }
      ]
    };

    const tvShows = await TVShow.find(searchQuery)
      .sort('-popularity')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await TVShow.countDocuments(searchQuery);

    res.json({
      success: true,
      data: tvShows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_results: total,
        per_page: parseInt(limit)
      },
      query: query
    });
  } catch (error) {
    console.error('Error searching TV shows:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search TV shows',
      error: error.message
    });
  }
});

module.exports = router;