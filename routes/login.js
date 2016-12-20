var express = require('express');
var passport = require('passport');
var auth = require('./auth');
var router = express.Router();

/* GET login page. */
router.get('/', (req, res, next) => {

  var user = req.flash('user')[0];
  if(req.user) {
    user = req.user;
  }
  var link = req.flash('link')[0];
  var word = req.flash('word')[0];
  var error = req.flash('error')[0];

  console.log('user', user);
  console.log('link', link);
  console.log('word', word);

  res.render('login', {
    user: JSON.stringify(user),
    error: JSON.stringify(error),
    link: JSON.stringify(link),
    word: JSON.stringify(word)
  });
});

router.post('/', 
  function(req, res, next) {
  passport.authenticate('local', { failureFlash: true }, function(err, user, info) {
    req.flash('error', info);
    req.flash('user', user);

    var link = req.body.link;
    var word = req.body.keyword;

    console.log('user', user);
    console.log('link', link);
    console.log('word', word);

    if (err) { 
      req.flash('link', link);
      req.flash('word', word);
      return next(err); 
    }

    if (info) { 
      req.flash('link', link);
      req.flash('word', word);
      return res.redirect('/login'); 
    }

    req.logIn(user, function(err) {
      if (err) { 
        req.flash('link', link);
        req.flash('word', word);
        return next(err); 
      }
      // var jumpInfo = auth.getLoginBefore();
      // var jumpUrl = jumpInfo.url;
      // if(!jumpUrl) {
        // jumpUrl = '/index';
      // }
      // if(req.body.remember) {
      //   var hour = 3600000;
      //   req.session.cookie.expires = new Date(Date.now() + 24*7*hour);
      //   req.session.cookie.maxAge = 24*7*hour;
      // }
      // console.log('req.session', req.session);
      console.log('jumpInfo start print');
      console.log('link', link);
      console.log('word', word);

      req.flash('word', word);
      if(!link) {
        link = '/index';
      }
      return res.redirect(link);
      // return res.redirect('/index');
    });
  })(req, res, next);
});

module.exports = router;