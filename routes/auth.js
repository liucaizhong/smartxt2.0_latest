var url = require('url');
var http = require('http');
var userLogin = {};
var loginBefore = {};

function setUser(obj) {
	for(var key in obj) {
		userLogin[key] = obj[key];
	}
}

function getUser() {
	return userLogin;
}

function setLoginBefore() {
	loginBefore.url = arguments[0];
	loginBefore.keyword = arguments[1];
}

exports.setUser = setUser;
exports.getUser = getUser;
exports.getLoginBefore = function() {
	return loginBefore;
}

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) 
  	return next();

  setLoginBefore(req.url, req.body.keyword);
  res.redirect('/login');
}; 

exports.findByUsername = function(username, cb) {
	process.nextTick(function() {
		var data;
		var err;
		var user = {};
		var address = 'http://139.196.18.233:8087/axis2/services/smartxtAPI/getUserInfo?user='+ username +'&response=application/json';
		//http request get user
		http.get(url.parse(address), function(response) {
	  		var body = '';
		    response.on('data', function(d) {
		      body += d;
		    });

		    response.on('end', function() {
		      	body = JSON.parse(body);
		      	data = body.getUserInfoResponse.return.entry;

		      	if(data) {
					var pwd;
					for (var i = data.length - 1; i >= 0; i--) {
						if(data[i].key == 'pwd') {
							pwd = data[i].value;
							break;
						}
					}
					user.username = username;
					user.password = pwd;

					return cb(null, user);
				}

				//callback
				return cb(null, null);
		    });
		});
	});
}

exports.getByUsername = function(username, cb) {
	process.nextTick(function() {
		var user = getUser();
		if(user.username != username) {
			cb(new Error('User ' + username + 'does not exist.'));
		}else {
			cb(null, user);
		}
	});
}
