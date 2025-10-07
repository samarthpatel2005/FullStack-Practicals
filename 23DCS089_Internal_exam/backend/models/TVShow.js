const mongoose = require('mongoose');

const tvShowSchema = new mongoose.Schema({
  tmdb_id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  original_name: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  first_air_date: {
    type: Date,
    required: true
  },
  last_air_date: {
    type: Date
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
  origin_country: [{
    type: String
  }],
  number_of_episodes: {
    type: Number
  },
  number_of_seasons: {
    type: Number
  },
  episode_run_time: [{
    type: Number
  }],
  in_production: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Returning Series', 'Planned', 'In Production', 'Ended', 'Canceled', 'Pilot']
  },
  type: {
    type: String,
    enum: ['Documentary', 'News', 'Miniseries', 'Reality', 'Scripted', 'Talk Show', 'Video']
  },
  trailer_key: {
    type: String
  },
  tagline: {
    type: String
  },
  homepage: {
    type: String
  },
  category: {
    type: String,
    enum: ['trending', 'popular', 'top_rated', 'on_the_air', 'airing_today'],
    default: 'popular'
  },
  created_by: [{
    id: Number,
    name: String,
    profile_path: String
  }],
  networks: [{
    id: Number,
    name: String,
    logo_path: String,
    origin_country: String
  }],
  production_companies: [{
    id: Number,
    name: String,
    logo_path: String,
    origin_country: String
  }],
  seasons: [{
    air_date: Date,
    episode_count: Number,
    id: Number,
    name: String,
    overview: String,
    poster_path: String,
    season_number: Number
  }],
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
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
tvShowSchema.index({ tmdb_id: 1 });
tvShowSchema.index({ name: 'text', overview: 'text' });
tvShowSchema.index({ genre_ids: 1 });
tvShowSchema.index({ vote_average: -1 });
tvShowSchema.index({ popularity: -1 });
tvShowSchema.index({ first_air_date: -1 });
tvShowSchema.index({ category: 1 });

module.exports = mongoose.model('TVShow', tvShowSchema);