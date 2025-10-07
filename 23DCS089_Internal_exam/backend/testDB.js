const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Movie = require('./models/Movie');

// Test database connection and content
async function testDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const movieCount = await Movie.countDocuments();
    console.log(`📊 Movies in database: ${movieCount}`);
    
    if (movieCount > 0) {
      const sampleMovies = await Movie.find().limit(3);
      console.log('🎬 Sample movies:');
      sampleMovies.forEach(movie => {
        console.log(`- ${movie.title} (${movie.year})`);
      });
    } else {
      console.log('❌ No movies found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();