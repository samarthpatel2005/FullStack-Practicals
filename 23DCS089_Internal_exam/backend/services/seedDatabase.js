const mongoose = require('mongoose');
const OMDbService = require('./omdbService');
require('dotenv').config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if OMDb API key is configured
    if (!process.env.OMDB_API_KEY) {
      console.log('⚠️  OMDb API key not configured. Please set OMDB_API_KEY in your .env file');
      console.log('You can get a free API key from http://www.omdbapi.com/apikey.aspx');
      process.exit(1);
    }

    const omdbService = new OMDbService();
    await omdbService.seedDatabase();

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;