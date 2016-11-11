var express = require('express');
var router = express.Router();

/* GET Sign up page. */
router.get('/', (req, res, next) => {
  // res.send('respond with a resource');
  res.render('user', { user: JSON.stringify(req.user) });
});

module.exports = router;