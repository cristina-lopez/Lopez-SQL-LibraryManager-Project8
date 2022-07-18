const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const routes = require('./routes/index');
//const users = require('./routes/users');
const { sequelize } = require('./models');

app.use('/static', express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

(async () => {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.log('Error connecting to the database');
  }
})();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);

// catch 404
app.use((req, res, next) => {
  err = new Error('Page not found');
  err.status = 404;
  res.render('page-not-found', {err, title: "Page Not Found"});

  //res.status(404).render('page-not-found');
});

// error handler
app.use((err, req, res, next) => {
  err.status = 500;
  err.message = 'Server Error';
  console.log(err.status, err.message);
  res.render('error', {err, title: "Page Not Found"});

  /* if (err.status === 404) {
    res.status(404).render('page-not-found', {err});
  } else {
    err.message = err.message || 'Server Error.';
    res.status(err.status || 500).render('error', {err});
  } */
});

module.exports = app;
