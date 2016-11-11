var express = require('express');
var router = express.Router();

/* GET Sign up page. */
router.get('/', (req, res, next) => {
  // res.send('respond with a resource');
  res.render('signup');
});

module.exports = router;
