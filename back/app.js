let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let cors = require('cors')();
//let busRouter = require('./routes/api/busController');
let weatherApi = require('./routes/api/weatherController');
let quotesRotuer = require('./routes/api/quotesController');

let socketLib = require('./lib/socket');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 미들웨어
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));

app.use('/api/weather', weatherApi);
//app.use('/api/bus', busRouter);
app.use('/api/quotes', quotesRotuer);
require('dotenv').config();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//listen server
let server = app.listen(3031, function () {
  console.log('Example app listening on port 3031');
  //console.log(process.cwd())
});

let listen = require('socket.io');
let io = listen(server);
socketLib.connection(io);

// Make io accessible to our router
// app.use(function(req,res,next){
//   req.io = io;
//   next();
// });

module.exports = app;
