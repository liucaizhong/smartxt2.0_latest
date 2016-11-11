'use strict';

//url
var URL = '/cross?id=2&';
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
		console.log('start submit handler');

		var stock = $('#stockInput').val();
		$('#stockInput').val('');
		var topic = $('#eventInput').val();
		$('#eventInput').val('');

		cond.topic = topic;
		cond.stock = stock;

		var url = URL + 'stock=' + stock + '&topic=' + topic + '&response=application/json';
		_renderChart(url);
	});
});

function onStar(that) {
	var $btn = $(that);
	$btn.toggleClass('collect');

	//add event to collection
	//to do
}

function _renderChart(url) {

	$('.charts .none').show();
	//scroll to result list
	$("html, body").animate({ scrollTop: $('section.charts').offset().top - 60 }, 800);
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