var express = require('express');
var router = express.Router();

/* GET privacy page. */
router.get('/', (req, res, next) => {
  if(!req.user) {
		res.render('privacy');
  }else {
  	res.render('privacyLogined');
  }
});

module.exports = router;