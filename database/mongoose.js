const mongoose = require('mongoose');
const { database } = require('../config.js');

const connectDB = async () => {
  try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(database, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
      console.log('Database is connected...');
  } catch (error) {
      console.error(error.message);
  }
}
