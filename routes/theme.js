var express = require('express');
var router = express.Router();
// var http = require('http');
var url = require('url');

/* GET explore pages. */
// theme search
router.get('/', (req, res, next) => {
	//http module invoke java api to get JSON
	//http.get to do....
	var query = url.parse(req.url).query;
	var concept = req.flash('word')[0];
	if(query) {
		if(query.indexOf('&') != -1) {
			var keywords = query.split('&');
			var themes = keywords[0].split('=')[1];
			var sources = keywords[1].split('=')[1];
		}else {
			var word = query.split('=')[1];
		}

	}

	// console.log('concept', concept);
	// console.log('req.user', req.user);
	
	if(!req.user) {
		// console.log('Has logged in themepage!');
		res.render('theme', {
			concept: concept
		});
	}else {
		// console.log('Has logged in themeLogined!');
		res.render('themeLogined', {
			concept: concept,
			themes: themes,
			sources: sources,
			word: word,
			user: JSON.stringify(req.user)
		});
	}

});

//handler for post request
router.post('/', (req, res, next) => {

	var concept = req.body.keyword;
	var themes = req.body.themes;
	var sources = req.body.sources;

	if(!req.user) {
		// console.log('Has logged in themepage!');
		res.render('theme', {
			concept: concept
		});
	}else {
		// console.log('Has logged in themeLogined!');
		res.render('themeLogined', {
			concept: concept,
			themes: themes,
			sources: sources,
			user: JSON.stringify(req.user)
		});
	}
});

module.exports = router;