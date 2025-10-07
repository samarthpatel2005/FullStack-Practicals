const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdb_id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  release_date: {
    type: Date,
    required: true
  },
  poster_path: {
    type: String,
    required: true
  },
  backdrop_path: {
    type: String
  },
  genre_ids: [{
    type: Number
  }],
  genres: [{
    id: Number,
    name: String
  }],
  vote_average: {
    type: Number,
    min: 0,
    max: 10
  },
  vote_count: {
    type: Number,
    min: 0
  },
  popularity: {
    type: Number,
    min: 0
  },
  adult: {
    type: Boolean,
    default: false
  },
  original_language: {
    type: String,
    required: true
  },
  original_title: {
    type: String,
    required: true
  },
  video: {
    type: Boolean,
    default: false
  },
  trailer_key: {
    type: String
  },
  runtime: {
    type: Number
  },
  budget: {
    type: Number
  },
  revenue: {
    type: Number
  },
  tagline: {
    type: String
  },
  status: {
    type: String,
    enum: ['Rumored', 'Planned', 'In Production', 'Post Production', 'Released', 'Canceled']
  },
  category: {
    type: String,
    enum: ['trending', 'popular', 'top_rated', 'upcoming', 'now_playing'],
    default: 'popular'
  },
  imdb_id: {
    type: String,
    unique: true,
    sparse: true
  },
  director: {
    type: String
  },
  writer: {
    type: String
  },
  actors: {
    type: String
  },
  awards: {
    type: String
  },
  metascore: {
    type: Number
  },
  production: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
movieSchema.index({ tmdb_id: 1 });
movieSchema.index({ title: 'text', overview: 'text' });
movieSchema.index({ genre_ids: 1 });
movieSchema.index({ vote_average: -1 });
movieSchema.index({ popularity: -1 });
movieSchema.index({ release_date: -1 });
movieSchema.index({ category: 1 });

module.exports = mongoose.model('Movie', movieSchema);