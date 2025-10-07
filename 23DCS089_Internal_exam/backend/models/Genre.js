const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  tmdb_id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['movie', 'tv'],
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
genreSchema.index({ tmdb_id: 1, type: 1 });
genreSchema.index({ name: 1 });

module.exports = mongoose.model('Genre', genreSchema);