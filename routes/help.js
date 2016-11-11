var express = require('express');
var router = express.Router();

/* GET help page. */
router.get('/', (req, res, next) => {
  res.render('help');
});

module.exports = router;