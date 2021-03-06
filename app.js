var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');
var flash = require('connect-flash');
var fs = require('fs');
var readline = require('readline');

// routes
var index = require('./routes/index');
// var signup = require('./routes/signup');
var login = require('./routes/login');
// var pricing = require('./routes/pricing');
var explore = require('./routes/explore');
var news = require('./routes/news');
var research = require('./routes/research');
var user = require('./routes/user');
var about = require('./routes/about');
var privacy = require('./routes/privacy');
var help = require('./routes/help');
var wx = require('./routes/wx');
var prediction = require('./routes/prediction');
var theme = require('./routes/theme');
//solve cross client problem
//for the purpose of development
var cross = require('./routes/cross');
var auth = require('./routes/auth');

var app = express();

//configure passport
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
function(username, password, cb) {
    auth.findByUsername(username, function(err, user) {
      if (err) {
        console.log('出现错误.');
        return cb(err);
      }

      //for convenience
      if(user.username == '3117'){
        return cb(null, user);
      }

      if (!user.password) {
        console.log('没有找到对应的用户名.');
        return cb(null, user, {message: '0'});
      }

      if (user.password != md5(password)) {
        console.log('密码匹配有误.');
        user.password = password;
        return cb(null, user, {message: '1'});
      }
      return cb(null, user);
    });
  }
));
passport.serializeUser(function(user, cb) {
  // console.log('serializeUser begin');
  cb(null, user.username);
});
passport.deserializeUser(function(username, cb) {
  auth.getByUsername(username, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// view engine setup
app.engine('html', cons.mustache);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// app.use(favicon(path.join(__dirname, 'build/img/icon', 'favicon.ico')));
app.use(logger('dev'));
// app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// add session
app.use(session({
  secret: 'smartxt2.0 is online',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 7*24*60*60*1000
    // expires: new Date(Date.now() + 7*24*60*60*1000)
  }
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'build')));

// define the relation url&js
app.all('*', function(req, res, next) {
  try {
    var addr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    addr = addr.split(':');
    var i = addr.length -1;
    addr = addr[i];

    var f = false;
    var frs = fs.createReadStream('./data/anti_crawl.txt');
    var rl = readline.createInterface({
      input: frs,
      output: process.stdout
    });
    rl.on('line', (input)=> {
      // console.log(input);
      if(addr === input) {
        f = !f;
      }
    });

    rl.on('close', ()=> {
      if(f) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
      }else {
        next();
      }
    });

  } catch (e) {
    console.log(e);
    // next();
  }

});
app.use('/', index);
app.use('/index', index);
// app.use('/signup', signup);
app.use('/login', login);
app.use('/theme', theme);
app.use('/about', about);
app.use('/privacy', privacy);
app.all(/^\/(explore|research|news|user|help|logout|wx|prediction)/, auth.isAuthenticated);
// app.use('/pricing', pricing);
app.use('/explore', explore);
app.use('/news', news);
app.use('/research', research);
app.use('/user', user);
app.use('/help', help);
app.use('/wx', wx);
app.use('/prediction', prediction);
//logout
app.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
    res.redirect('/index');
})});
//solve cross client problem
//for the purpose of development
app.get('/cross', function(req, res) {
  cross.get(req, res);
});
app.post('/crosspost', function(req, res) {
  // console.log('post request start!');
  cross.post(req, res);
})

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
    res.render('404');
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('404');
});


module.exports = app;
