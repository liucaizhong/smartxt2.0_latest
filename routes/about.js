var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', (req, res, next) => {
  if(!req.user) {
	res.render('about');
  }else {
  	res.render('aboutLogined');
  }
});

module.exports = router;