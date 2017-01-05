
var url = require('url');
var http = require('http');
// var userLogin = {};
// var loginBefore = {};

// function setUser(obj) {
// 	for(var key in obj) {
// 		req.session.user[key] = obj[key];
// 	}
// }

// function getUser() {
// 	return req.session.user;
// }

// function setLoginBefore() {
// 	loginBefore.url = arguments[0];
// 	loginBefore.keyword = arguments[1];
// }

// exports.setUser = setUser;
// exports.getUser = getUser;
// exports.getLoginBefore = function() {
// 	return loginBefore;
// }

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) 
  	return next();

  // setLoginBefore(req.url, req.body.keyword);
  // res.render('login', {
  //   link: JSON.stringify(req.body.jumpBefore),
  //   word: JSON.stringify(req.body.keyword)
  // });
  req.flash('link', JSON.stringify(req.url));
  req.flash('word', JSON.stringify(req.body.keyword));
  console.log('keyword', req.body.keyword);
  res.redirect('/login');
}; 

exports.findByUsername = function(username, cb) {
	process.nextTick(function() {

		var data;
		var err;
		var user = {};
		//for convenience
		if(username == '3117'){
			user.username = username;
			return cb(null, user);
		}
		var address = 'http://139.196.18.233:8087/smartxtAPI/getUserInfo?userId='+ username;
		//http request get user
		http.get(url.parse(address), function(response) {
	  		var body = '';
		    response.on('data', function(d) {
		      body += d;
		    });

		    response.on('end', function() {
		      	body = JSON.parse(body);
		      	data = JSON.parse(body);

		      	user.username = username;
		      	if(data.pwd) {
					user.password = data.pwd;

					// return cb(null, user);
				}

				//callback
				return cb(null, user);

		    });
		});
	});
}

exports.getByUsername = function(username, cb) {
	process.nextTick(function() {
		var user = {};
		// if(user.username != username) {
		// 	cb(new Error('User ' + username + 'does not exist.'));
		// }else {
		// 	cb(null, user);
		// }
		//for convenience
		if(username == '3117'){
			user.username = username;
			return cb(null, user);
		}
		var address = 'http://139.196.18.233:8087/smartxtAPI/getUserInfo?userId='+ username;
		//http request get user
		http.get(url.parse(address), function(response) {
	  		var body = '';
		    response.on('data', function(d) {
		      body += d;
		    });

		    response.on('end', function() {
		      	body = JSON.parse(body);
		      	// console.log('body', body);
		      	data = JSON.parse(body);
		      	// console.log('data', data);

		      	if(data) {
					// var pwd;
					// for (var i = data.length - 1; i >= 0; i--) {
					// 	if(data[i].key == 'pwd') {
					// 		pwd = data[i].value;
					// 		break;
					// 	}
					// }
					user.username = data.phone;
					user.password = data.pwd;

					return cb(null, user);
				}else {
					cb(new Error('User ' + username + 'does not exist.'));
				}

				//callback
				// return cb(null, null);
		    });
		});
	});
}
