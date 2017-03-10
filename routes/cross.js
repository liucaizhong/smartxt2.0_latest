
var express = require('express');
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var urls = ['http://139.196.18.233:8087/smartxtAPP/getConceptHeat?', //0
			'http://139.196.18.233:8087/smartxtAPP/getConceptStocks?',//1
			'http://139.196.18.233:8087/smartxtAPP/topicHeat?',//2
			'http://139.196.18.233:8087/smartxtAPP/getUserInfo?',//3
			'http://139.196.18.233:8087/smartxtAPP/getUserConcept?',//4
			'http://139.196.18.233:8087/smartxtAPP/getUserTopic?',//5
			'http://139.196.18.233:8087/smartxtAPP/getConceptList?',//6
			'http://139.196.18.233:8087/smartxtAPP/getSelfChoiceStocks?',//7
			'http://139.196.18.233:8087/smartxtAPP/stockFollow',//8
			'http://139.196.18.233:8087/smartxtAPP/stockRemoval',//9
			'http://139.196.18.233:8087/smartxtAPP/conceptSubmit',//10
			'http://139.196.18.233:8087/smartxtAPP/getAllStockMap?',//11
			'http://139.196.18.233:8087/smartxtAPP/submitStatus?',//12
			'http://139.196.18.233:8087/smartxtAPP/conceptFollow',//13
			'http://139.196.18.233:8087/smartxtAPP/conceptUnFollow',//14
			'http://139.196.18.233:8087/smartxtAPP/topicFollow',//15
			'http://139.196.18.233:8087/smartxtAPP/topicUnFollow',//16
			'http://139.196.18.233:8087/smartxtAPP/profileUpdate',//17
			'http://139.196.18.233:8087/smartxtAPP/visitLog',//18
			'http://139.196.18.233:8087/smartxtAPP/queryAnnounce?',//19
			'http://139.196.18.233:8087/smartxtAPP/queryChats?',//20
			'http://139.196.18.233:8087/smartxtAPP/surveyList?',//21
			'http://139.196.18.233:8087/smartxtAPP/affList?',//22
			'http://139.196.18.233:8087/smartxtAPP/allConcepts?',//23
			'http://139.196.18.233:8087/smartxtAPP/topicsOnAir?',//24
			'http://139.196.18.233:8087/smartxtAPP/topicList?',//25
		    'http://139.196.18.233:8087/smartxtAPP/register'];//26

exports.get = function(req, res) {

	var queryArr = url.parse(req.url).query.split('&');
  	var address = urls[queryArr[0].split('=')[1]];
  	queryArr.slice(1).forEach(function(cur) {
  		address += cur + '&';
  	});
  	var endIndex = address.length-1;
  	if(address.charAt(endIndex) == '&')
  		address = address.slice(0, endIndex);
  	address = url.parse(address);

	var options = {
	    host: address.hostname,
	    path: address.path,
	    port: address.port,
	    method: 'GET',
	    headers: {
	        'x-forwarded-for': req.ip
	    }
	};
  	//send http request
  	var getReq = http.request(options, function(response) {
  		var body = '';
	    response.on('data', function(d) {
	      body += d;
	    });

	    response.on('end', function() {
	      	res.json(body);
	    });
	});

	getReq.on('error', (e) => {
  		console.log(`problem with request: ${e.message}`);
	});
	getReq.end();
};

exports.post = function(req, res) {
	var queryArr = url.parse(req.url).query.split('&');
  	var address = urls[queryArr[0].split('=')[1]];
  	address = url.parse(address);

  	//send http post
  	//json转换为字符串
	var data = querystring.stringify(req.body);
	var options = {
	    host: address.hostname,
	    path: address.path,
	    port: address.port,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/x-www-form-urlencoded',
	        'Content-Length': Buffer.byteLength(data),
	        'x-forwarded-for': req.ip
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
