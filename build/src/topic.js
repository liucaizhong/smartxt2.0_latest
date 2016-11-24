'use strict';

//url
var URL = '/cross?id=2&';
//http://139.196.18.233:8087/smartxtAPI/topicFollow
var URL_COLLECT = '/crosspost?id=15';
//http://139.196.18.233:8087/smartxtAPI/topicUnFollow
var URL_UNCOLLECT = '/crosspost?id=16';
var cond = {
	topic: '',
	stock: ''
};
var loginfo;
//echarts
var chartAttention = echarts.init(document.getElementById('chart-attention'), 'macarons');
var chartPrice = echarts.init(document.getElementById('chart-price'), 'macarons');
echarts.connect([chartAttention, chartPrice]);

$(document).ready(function () {
	//echart resize
	$(window).on('resize', function () {
		chartAttention.resize();
		chartPrice.resize();
	});
	//deal with jump search
	if (window.topic && window.stock) {
		var topic = unescape(decodeURIComponent(window.topic));
		var stock = unescape(decodeURIComponent(window.stock));

		delete window['topic'];
		delete window['stock'];

		cond.topic = topic;
		cond.stock = stock;

		var url = URL + 'stock=' + stock + '&topic=' + topic + '&response=application/json';
		_renderChart(url);
	}
	//get user
	console.log(window.user);
	if (window.user) {
		loginfo = window.user.replace(/&quot;/g, '"');
		loginfo = JSON.parse(loginfo);
		delete window.user;
	}

	//form submit 
	$('#form-topic').submit(function (e) {
		e.preventDefault();
		_hideErr();
		var stock = $('#stockInput').val();
		var topic = $('#eventInput').val();
		if (stock && topic && !$('#stockInput').hasClass('error')) {

			cond.topic = topic;
			cond.stock = stock;

			var url = URL + 'stock=' + stock + '&topic=' + topic + '&response=application/json';
			_renderChart(url);
		}
	});
});

function onStar(that) {
	var $btn = $(that);
	if (!$btn.hasClass('collect')) {
		var path = URL_COLLECT;
		var msg = '已收藏';
		var postData = {
			userId: loginfo.username,
			code: cond.stock,
			topic: cond.topic
		};
	} else {
		var path = URL_UNCOLLECT;
		var msg = '取消收藏';
		var postData = {
			userId: loginfo.username,
			links: cond.stock + '@' + cond.topic
		};
	}

	$.ajax({
		url: path,
		method: 'POST',
		data: postData,
		// contentType: 'application/json',
		dataType: 'json',
		success: function success(data) {
			var d = JSON.parse(data);
			d = JSON.parse(d);

			if (d.flag || d[0].status) {
				$btn.toggleClass('collect');
				_showFadeMsg(msg);
			} else {
				_showFadeMsg(d.msg);
			}
		},
		error: function error(err) {
			console.log(err);
		}
	});
}

function _renderChart(url) {

	chartAttention = echarts.init(document.getElementById('chart-attention'), 'macarons');
	chartPrice = echarts.init(document.getElementById('chart-price'), 'macarons');
	// configure echart
	chartAttention.showLoading();
	chartPrice.showLoading();
	$.ajax({
		url: url,
		success: function success(data) {

			var heat = [];
			var index = [];
			var category = [];
			var legend = cond.stock + '-' + cond.topic;
			data = JSON.parse(data);
			var entry = data.topicHeatResponse.return.entry;
			if (!entry) {
				chartAttention.hideLoading();
				chartPrice.hideLoading();
				_showErr('找不到相关信息');
				return false;
			}

			$('#stockInput').val('');
			$('#eventInput').val('');
			$('.charts .topic-collect').show();
			//scroll to result list
			$("html, body").animate({ scrollTop: $('section.charts').offset().top - 60 }, 800);

			entry.forEach(function (cur) {
				category.push(cur.key);
				heat.push(cur.value[0]);
				index.push(cur.value[1]);
			});

			//attention
			chartAttention.setOption({
				baseOption: {
					title: {
						text: ''
					},
					tooltip: {
						trigger: 'axis'
					},
					color: ['#c23531'],
					dataZoom: [{
						type: 'slider',
						show: true,
						xAxisIndex: [0],
						start: 5,
						end: 25
					}, {
						type: 'inside',
						xAxisIndex: [0],
						start: 5,
						end: 25
					}],
					legend: {
						data: [legend]
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: [{
						// name: 'Date',
						type: 'category',
						data: category
					}],
					yAxis: [{
						name: '关注度(H)',
						type: 'value'
					}],
					series: [{
						name: legend,
						type: 'line',
						data: heat
					}]
				}
			});
			chartAttention.hideLoading();

			//price
			chartPrice.setOption({
				baseOption: {
					title: {
						text: ''
					},
					tooltip: {
						trigger: 'axis'
					},
					color: ['#66ccff'],
					dataZoom: [{
						type: 'slider',
						show: true,
						xAxisIndex: [0],
						start: 5,
						end: 25
					}, {
						type: 'inside',
						xAxisIndex: [0],
						start: 5,
						end: 25
					}],
					legend: {
						data: [legend]
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: [{
						// name: 'Date',
						type: 'category',
						data: category
					}],
					yAxis: [{
						name: '价格指数(I)',
						type: 'value'
					}],
					series: [{
						name: legend,
						type: 'line',
						data: index
					}]
				}
			});
			chartPrice.hideLoading();
		},
		error: function error(err) {
			console.log(err);
		}
	});
}

function customOpStock(li) {
	if (!li) {
		return;
	}

	var $li = $(li);
	// var code = $li.find('span[class*="item-1"]').text();
	var name = $li.find('span[class*="item-2"]').text();
	$('#stockInput').val(name);
}

function _showErr(text) {
	$('div#error-msg>strong').text(text);
	$('div#error-msg').show(500);
}

function _hideErr() {
	$('div#error-msg').hide(500);
}

function delAlert(that) {
	var $btn = $(that);
	$btn.parent().hide(500);
}

function _showFadeMsg(text) {

	var l = $('.topic-collect>span').offset().left - 50;
	var t = $('.topic-collect>span').offset().top + 50;
	$('#fade-msg').text(text);

	$('#fade-alert').css({ 'left': l, 'top': t }).fadeIn(function () {
		setTimeout(function () {
			$('#fade-alert').fadeOut();
		}, 1000);
	});
}