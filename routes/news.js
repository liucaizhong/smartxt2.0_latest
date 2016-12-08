var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', (req, res, next) => {
  res.render('news', {
		user: JSON.stringify(req.user)
  });
});

module.exports = router;