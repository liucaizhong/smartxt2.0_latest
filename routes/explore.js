var express = require('express');
var router = express.Router();
// var http = require('http');
var url = require('url');

/* GET explore pages. */
// theme search
router.get('/theme', (req, res, next) => {
	//http module invoke java api to get JSON
	//http.get to do....
	var query = url.parse(req.url).query;

	if(query) {
		var keywords = query.split('&');
		var themes = keywords[0].split('=')[1];
		var sources = keywords[1].split('=')[1];
	}
	var concept = req.flash('word')[0];
	console.log('concept', concept);
	
	res.render('theme', {
		concept: concept,
		themes: themes,
		sources: sources,
		user: JSON.stringify(req.user)
	});
});

//handler for post request
router.post('/theme', (req, res, next) => {

	var concept = req.body.keyword;
	var themes = req.body.themes;
	var sources = req.body.sources;

	res.render('theme', {
		concept: concept,
		themes: themes,
		sources: sources,
		user: JSON.stringify(req.user)
	});
});

// focus insights
router.get('/focus', (req, res, next) => {
  res.render('focus', {
  	user: JSON.stringify(req.user)
  });
});

//topic search
router.get('/topic', (req, res, next) => {
	var query = url.parse(req.url).query;
	if(query) {
		var keywords = query.split('&');
		var topic = keywords[0].split('=')[1];
		var stock = keywords[1].split('=')[1];
	}
	
  	res.render('topic', {
		topic: topic,
		stock: stock,
		user: JSON.stringify(req.user)
	});
});

router.post('/topic', (req, res, next) => {
  	var topic = req.body.topic;
	var stock = req.body.stock;

	res.render('topic', {
		topic: topic,
		stock: stock,
		user: JSON.stringify(req.user)
	});
});

module.exports = router;
