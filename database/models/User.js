const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { validateEmail } = require('../validators');
const moment = require('moment');
moment.locale('pl');

// const wordSchema = new Schema({ name: 'string' });

const userSchema = new Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: moment().format(),
  },
  dateString: {
    type: String,
    default: moment().format('LL'),
  },
  lastLogin: {
    type: String,
    default: moment().format('LL'),
  },
  email: {
    type: String,
    required: [true, 'Email jest wymagany'],
    lowercase: true,
    trim: true,
    unique: true,
    validate: [validateEmail, 'Niepoprawny adres e-mail'],
  },
  password: {
    type: String,
    required: true,
    minLength: [3, 'Hasło powinno zawierać min. 3 znaki']
  },
  firstname: {
    type: String,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
  },
  score: {
    type: Number,
    min: 0,
    default: 0,
  },
  language: {
    type: String,
    trim: true,
    default: 'en',
  },
  languages: {
    type: String,
    enum: ['en', 'pl', 'es', 'de'],
    trim: true,
    default: 'en',
  },
  activated: {
    type: Boolean,
    required: true,
    default: false,
  },
  wordlist: [{ 
    name: 'string', 
    name_pl: 'string', 
    name_en: 'string',
    learned: Boolean,
    familiarity_level: Number,
  }],
  favorite: [{ 
    name: 'string', 
    name_pl: 'string', 
    name_en: 'string', 
  }],
  difficult: [{ 
    name: 'string', 
    name_pl: 'string', 
    name_en: 'string', 
  }],
});

userSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  next();
});

userSchema.post('save', function(error, doc, next) {
  if (error.code === 11000) {
    error.errors = { email: { properties: { message: 'Email jest już zajęty'}}}
  }
  next(error);
});

userSchema.methods = {
  comparePassword(password) {
    const user = this;
    return bcrypt.compareSync(password, user.password)
  }
}

const User = mongoose.model('User', userSchema);
module.exports = User;