var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
	if(!req.user) {
		res.render('index');
	} else {
		res.render('logined', {
			user: JSON.stringify(req.user)
		});
	}
});

module.exports = router;
