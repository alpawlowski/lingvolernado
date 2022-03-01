const mongoose = require('mongoose');
const { database } = require('../config.js');


try {
  mongoose.connect(database);
  console.log('Database is connected...')

} catch (error) {
  console.log(error)
}
