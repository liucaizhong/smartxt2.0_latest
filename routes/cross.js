var express = require('express');
var http = require('http');
var url = require('url');

var urls = ['http://139.196.18.233:8087/axis2/services/smartxtAPI/getHeat?', 
			'http://139.196.18.233:8087/axis2/services/smartxtAPI/getStocks?',
			'http://139.196.18.233:8087/axis2/services/smartxtAPI/topicHeat?',
			'http://139.196.18.233:8087/axis2/services/smartxtAPI/getUserInfo?',
			'http://139.196.18.233:8087/axis2/services/smartxtAPI/getUserConcept?',
			'http://139.196.18.233:8087/axis2/services/smartxtAPI/getUserTopic?',
			'http://139.196.18.233:8087/axis2/services/smartxtAPI/getConceptList?'];

exports.get = function(req, res) {

	var queryArr = url.parse(req.url).query.split('&');
  	var address = urls[queryArr[0].split('=')[1]];
  	queryArr.slice(1).forEach(function(cur) {
  		address += cur + '&';
  	});
  	address = address.slice(0, address.length-1);

  	console.log(address);

  	//send http request
  	http.get(url.parse(address), function(response) {
  		var body = '';
	    response.on('data', function(d) {
	      body += d;
	    });

	    response.on('end', function() {
	      	res.json(body);
	    });
	});
};
