var express = require('express');
var passport = require('passport');
var auth = require('./auth');
var router = express.Router();

/* GET login page. */
router.get('/', (req, res, next) => {
  res.render('login', {
    user: JSON.stringify(auth.getUser()),
    error: JSON.stringify(req.flash('error'))
  });
});

router.post('/', 
  function(req, res, next) {
  passport.authenticate('local', { failureFlash: true }, function(err, user, info) {
    req.flash('error', info);
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      var jumpInfo = auth.getLoginBefore();
      var jumpUrl = jumpInfo.url;
      if(!jumpUrl) {
        jumpUrl = '/index';
      }
      if(req.body.remember) {
        var hour = 3600000;
        req.session.cookie.expires = new Date(Date.now() + 24*7*hour);
        req.session.cookie.maxAge = 24*7*hour;
      }
      // console.log('req.session', req.session);
      return res.redirect(jumpUrl);
    });
  })(req, res, next);
});

module.exports = router;