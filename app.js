var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var postRouter = require(`./routes/posts`);
var dashboardRouter = require('./routes/dashboard');
var storeInfoRouter = require('./routes/storeInfo');
const authRouter = require('./routes/auth');
const guestRouter = require('./routes/guest');
const bossRouter = require('./routes/boss');
const followRouter = require('./routes/follow'); // Add this line

const mongoose = require('./db');
const cors = require('cors');

var app = express();
app.use(
  cors({
    origin: 'https://fav-fe-qo2u-self.vercel.app',
    credentials: true,
  })
);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postRouter);
app.use('/dashboard', dashboardRouter);
app.use('/storeInfo', storeInfoRouter);

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/guest', guestRouter);
app.use('/boss', bossRouter);
app.use('/api', authRouter);
app.use('/api', followRouter); // Add this line

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
