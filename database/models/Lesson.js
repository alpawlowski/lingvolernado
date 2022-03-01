const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const wordSchema = new Schema({ name: 'string' });

const lessonSchema = new Schema({
  slug: {
    type: String,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  img_url: {
    type: String,
    trim: true,
  },
  level: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    trim: true,
    required: true,
    default: 'en',
  },
  wordlist: [{
    name: 'string', 
    name_en: 'string',
    name_pl: 'string', 
    name_pl_bez: 'string', 
  }],
  owner: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  participants: [{
    id: {
      type: mongoose.Types.ObjectId,
    }
  }],

});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;