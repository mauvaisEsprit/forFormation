const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB via Mongoose');
  } catch (err) {
    console.error(err);
  }
}

module.exports = { connect };