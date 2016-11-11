var express = require('express');
var router = express.Router();

/* GET research page. */
router.get('/', (req, res, next) => {
  res.render('research');
});

module.exports = router;