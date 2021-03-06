var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var settings = require('./settings');
var model = require('./db');


var routes = require('./routes/index');
var users = require('./routes/users');
var bottle = require('./routes/bottle');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: settings.secret,
  resave: true,
  saveUninitialized: true,
  store: new RedisStore({
    host: settings.host,
    port: settings.port,
    pass: settings.auth
  })
}));
//pass为数据库密码，db为哪个数据库，没有则默认不分库
app.use(function(req, res, next){
  var user = req.session.user;
  if(user){
    model.getTimes(user.username, function(err, data){
      user.throwTimes = data.throwTimes || 0;
      user.pickTimes = data.pickTimes || 0;
      res.locals.user = user;
      next();
    });
  }else {
    res.locals.user = {throwTimes: 0, pickTimes: 0};
    next();
  }
  
});
app.use('/', routes);
app.use('/users', users);
app.use('/bottle', bottle);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
