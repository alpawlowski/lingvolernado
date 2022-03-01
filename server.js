const express = require('express');
const app = express();
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { sessionKeySecret } = require('./config');
const { port } = require('./config');

// init database
require('./database/mongoose');

// middleware session
app.use(session({
    secret: sessionKeySecret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 1},
}));

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

// set layout
app.use(ejsLayouts);
app.set('layout', 'layouts/main');
// public folder
app.use(express.static('public'));

// body parser // application/x-www-form-urlencoded
app.use('/', express.urlencoded({ extended: true }))
app.use('/', cookieParser());
app.use(flash());

// middlewares
app.use('/', require('./middleware/variables-middleware'));
app.use('/', require('./middleware/session-middleware'));
app.use('/profil', require('./middleware/auth-middleware'));

// mount routes
app.use('/', require('./routes/router'));

app.listen(port, () => {
    console.log('Server is listening..., http://localhost:' + port)
})