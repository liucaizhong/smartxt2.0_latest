var express = require('express');
var router = express.Router();

/* GET prediction page. */
router.get('/', (req, res, next) => {
  res.render('prediction');
});

module.exports = router;