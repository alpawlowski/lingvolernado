require('dotenv').config();
const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(process.env.DATABASE, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
      console.log('Database is connected...');
  } catch (error) {
      console.error(error.message);
  }
}
connectToDatabase();
