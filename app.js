require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var crudRouter = require('./routes/crud');
var iotRouter = require('./routes/iot');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//database connection
const mongoose = require('mongoose');
const url = process.env.MONGO_URL;
mongoose
  .connect(url)
  .then(() => console.log("Database is connected..."))
  .catch((err) => console.log(err));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/crud', crudRouter);
app.use('/iot',iotRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//uncommon this line to run in localhost
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;
