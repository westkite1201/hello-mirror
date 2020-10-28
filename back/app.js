var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors')();
var indexRouter = require('./routes/index');
// var authRouter = require('./routes/api/authController');
// var userRouter = require('./routes/api/userController');
// let boardApi = require('./routes/api/boardController')
let busRouter = require('./routes/api/busController');
let fileRouter = require('./routes/api/fileController');
let weatherApi = require('./routes/api/weatherController');
let quotesRotuer = require('./routes/api/quotesController');

//var passport = require('./config/passport/localStrategy')

var session = require('express-session');

var config = require('./src/lib/serverConfig');
const authMiddleware = require('./middlewares/auth');

var socketLib = require('./lib/socket');
var app = express();

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

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); //1
//   next();
// });

// login routine
app.use(
  session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true
    }
  })
);
//app에 jwt-secret 생성

app.set('jwt-secret', config.auth.jwt.secret);

//app.use('/users', usersRouter);
//app.use('/api/users', usersRouter); //2
//app.use('/api/check',authMiddleware);

app.post('/api/login', (req, res, next) => {
  console.log('api!!!');
  console.log(req.body);
  console.log('api!!!');
  passport.authenticate(
    'local',
    {
      session: true,
      passReqToCallback: true,
      successRedirect: '/main',
      failureRedirect: '/home'
    },
    async (err, user, info) => {
      console.log(info);
      return res.json(info);
    }
  )(req, res, next);
});

// app.use('/api/auth', authRouter);   //2

// //미들웨어 적용
// app.use('/api/user', authMiddleware)
// app.use('/api/user', userRouter)
// app.use('/api/board',boardApi)
app.use('/api/weather', weatherApi);
app.use('/api/bus', busRouter);
app.use('/api/file', fileRouter);
app.use('/api/quotes', quotesRotuer);
require('dotenv').config()

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
var server = app.listen(3031, function () {
  console.log('Example app listening on port 3031');
  //console.log(process.cwd())
});

var listen = require('socket.io');
var io = listen(server);
socketLib.connection(io);

// Make io accessible to our router
// app.use(function(req,res,next){
//   req.io = io;
//   next();
// });

module.exports = app;
