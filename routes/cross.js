var express = require('express');
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var urls = ['http://139.196.18.233:8087/axis2/services/smartxtAPI/getHeat?', 
			'http://139.196.18.233:8087/axis2/services/smartxtAPI/getStocks?',
			'http://139.196.18.233:8087/axis2/services/smartxtAPI/topicHeat?',
			'http://139.196.18.233:8087/smartxtAPI/getUserInfo?',
			'http://139.196.18.233:8087/smartxtAPI/getUserConcept?',
			'http://139.196.18.233:8087/smartxtAPI/getUserTopic?',
			'http://139.196.18.233:8087/smartxtAPI/getConceptList?',
			'http://139.196.18.233:8087/smartxtAPI/getSelfChoiceStocks?',
			'http://139.196.18.233:8087/smartxtAPI/stockFollow',
			'http://139.196.18.233:8087/smartxtAPI/stockRemoval',
			'http://139.196.18.233:8087/smartxtAPI/conceptSubmit',
			'http://139.196.18.233:8087/smartxtAPI/getStockMap',
			'http://139.196.18.233:8087/smartxtAPI/submitStatus?',
			'http://139.196.18.233:8087/smartxtAPI/conceptFollow',
			'http://139.196.18.233:8087/smartxtAPI/conceptUnFollow',
			'http://139.196.18.233:8087/smartxtAPI/topicFollow',
			'http://139.196.18.233:8087/smartxtAPI/topicUnFollow',
			'http://139.196.18.233:8087/smartxtAPI/profileUpdate',
			'http://139.196.18.233:8087/smartxtAPI/visitLog'];

exports.get = function(req, res) {

	var queryArr = url.parse(req.url).query.split('&');
  	var address = urls[queryArr[0].split('=')[1]];
  	queryArr.slice(1).forEach(function(cur) {
  		address += cur + '&';
  	});
  	var endIndex = address.length-1;
  	if(address.charAt(endIndex) == '&')
  		address = address.slice(0, endIndex);

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

exports.post = function(req, res) {
	var queryArr = url.parse(req.url).query.split('&');
  	var address = urls[queryArr[0].split('=')[1]];
  	address = url.parse(address);

  	//send http post
  	//json转换为字符串
	var data = querystring.stringify(req.body);
	console.log('data', data);
	var options = {
	    host: address.hostname,
	    path: address.pathname,
	    port: address.port,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/x-www-form-urlencoded',
	        'Content-Length': Buffer.byteLength(data)
	    }
	};

	var postReq = http.request(options, function(response) {
		var body = '';
	    response.setEncoding('utf8');
	    response.on('data', function (chunk) {
	        body += chunk;
	    });
	    response.on('end',function(){
	        res.json(body);
	    })
	});

	postReq.on('error', (e) => {
  		console.log(`problem with request: ${e.message}`);
	});

	postReq.write(data);
	postReq.end();
}