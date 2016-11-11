'use strict';

//global
var method = 0;
var methodRange = ['auto', 'h', 'i'];
var period;
var periodRange = ['1', '5', '10', '20'];
var source = 2;
var sourceRange = [0, 1, 2, 3];
var sourceName = ['*', 'guba', '(report OR announce)', 'news'];
var sourceShowName = ['投资者总体', '散户群体', '从业人群', '新闻媒体'];
//http://139.196.18.233:8087/axis2/services/smartxtAPI/getConceptList?src=投资者总体&type=h20&response=application/json
var CONCEPTURL = '/cross?id=6&';
var conceptList = [];
var conceptIndicator = 0;
var CHARTNUM = 4;
var HEATURL = '/cross?id=0&';
//echarts
var charts = [];

$(document).ready(function () {
	//echart resize handler
	$(window).on('resize', function () {
		charts.forEach(function (cur) {
			cur.resize();
		});
	});

	//get user info
	console.log('user', window.user);

	//get concept list
	//render echarts
	_renderConceptList();

	//loading more
	$(window).scroll(function () {
		if ($(window).scrollTop() + $(window).height() == $(document).height()) {
			$('.more-button span:nth-child(1)').removeClass('active');
			$('.more-button span:nth-child(2)').addClass('active');

			_renderCharts(conceptList.splice(0, CHARTNUM));
		}
	});
});

function onForm(that) {
	event.stopPropagation();

	var target = event.target;

	if (target.tagName === 'BUTTON') {
		var $btn = $(target);
		var category = $btn.attr('id');
		var update = false;

		switch (category[0]) {
			case 'm':
				if (method != category[1]) {
					method = category[1];
					update = true;
					switch (method) {
						case '0':
							$('#btnPeriod').find('button[class*="btn-valid"]').removeClass('btn-valid').addClass('btn-invalid');
							$('#btnPeriod').children().attr('disabled', true);
							period = undefined;
							break;
						case '1':
							$('#btnPeriod').find('button[class*="btn-valid"]').removeClass('btn-valid').addClass('btn-invalid');
							$('#p0').attr('disabled', true);
							$('#p1').attr('disabled', false).addClass('btn-valid');
							$('#p2').attr('disabled', false);
							$('#p3').attr('disabled', false);
							period = '1';
							break;
						case '2':
							$('#btnPeriod').find('button[class*="btn-valid"]').removeClass('btn-valid').addClass('btn-invalid');
							$('#p0').attr('disabled', false).addClass('btn-valid');
							$('#p1').attr('disabled', false);
							$('#p2').attr('disabled', false);
							$('#p3').attr('disabled', true);
							period = '0';
							break;
					}
				}
				break;
			case 'p':
				if (period != category[1]) {
					period = category[1];
					update = true;
				}
				break;
			case 's':
				if (source != category[1]) {
					source = category[1];
					update = true;
				}
				break;
		}

		if (update) {
			//change button style
			var btnSiblings = $btn.siblings('button[class*="btn-valid"]');
			Array.prototype.forEach.call(btnSiblings, function (cur) {
				$(cur).removeClass('btn-valid').addClass('btn-invalid');
			});

			$btn.removeClass('btn-invalid').addClass('btn-valid');
			$('.focus-charts>div.container').empty();
			//ajax get and render charts
			//to do later
			console.log('ajax get focus data!');
			console.log(method, period, source);
			_renderConceptList();
		}
	}
}

function _renderConceptList() {
	var typeUrl;
	if (!method) {
		typeUrl = methodRange[method];
	} else {
		typeUrl = methodRange[method] + periodRange[period];
	}
	var conceptUrl = CONCEPTURL + 'src=' + sourceRange[source] + '&type=' + typeUrl + '&response=application/json';
	$.ajax({
		url: conceptUrl,
		type: 'GET',
		async: true,
		dataType: 'json',
		success: function success(data) {
			var d = JSON.parse(data).getConceptListResponse.return;
			if (d) {
				conceptList = d;
				_renderCharts(conceptList.splice(0, CHARTNUM));
			} else {
				//show message
				$('.focus-charts>div.container').empty().text('未找到相关记录');
			}
		},
		error: function error(err) {
			console.log(err);
		}
	});
}

function _renderCharts(concepts) {
	var conceptIdx = conceptIndicator;
	conceptIndicator++;
	//create element
	concepts.forEach(function (cur, idx) {
		//get heat data
		var heatUrl = HEATURL + 'concept=' + cur + '&src=' + sourceName[source] + '&response=application/json';
		$.ajax({
			url: heatUrl,
			type: 'GET',
			async: true,
			dataType: 'json',
			success: function success(data) {
				var entry = JSON.parse(data).getHeatResponse.return.entry;
				if (!jQuery.isEmptyObject(entry)) {
					var legend = [];
					var category = [];
					var series = [];
					var heat = [];
					var index = [];

					var serieH = {
						name: 'H-' + entry.key,
						type: 'line',
						yAxisIndex: 0
					};
					var serieI = {
						name: 'I-' + entry.key,
						type: 'line',
						yAxisIndex: 1
					};

					legend.push('H-' + entry.key);
					legend.push('I-' + entry.key);

					entry.value.entry.forEach(function (cur) {
						heat.push(cur.value[0]);
						index.push(cur.value[1]);
						category.push(cur.key);
					});
					serieH.data = heat;
					series.push(serieH);

					serieI.data = index;
					series.push(serieI);

					//set echart option
					var chartDiv = document.createElement('div');
					var chartId = 'c' + (conceptIdx * CHARTNUM + idx);
					$(chartDiv).attr('id', chartId).addClass('focus-chart');
					$('.focus-charts>div.container').append(chartDiv);
					var chart = echarts.init(document.getElementById(chartId), 'macarons');
					chart.setOption({
						baseOption: {
							title: {
								text: sourceShowName[source]
							},
							tooltip: {
								trigger: 'axis'
							},
							dataZoom: [{
								type: 'slider',
								show: true,
								start: 5,
								end: 25
							}, {
								type: 'inside',
								start: 5,
								end: 25
							}],
							legend: {
								data: legend
							},
							toolbox: {
								feature: {
									saveAsImage: {}
								}
							},
							xAxis: {
								type: 'category',
								data: category
							},
							yAxis: [{
								name: '关注度(H)',
								type: 'value',
								min: 'auto',
								max: 'auto',
								splitNumber: 8
							}, {
								name: '指数(I)',
								type: 'value',
								min: 'auto',
								max: 'auto',
								splitNumber: 8
							}],
							series: series
						}
					});

					charts.push(chart);
					// console.log('charts', charts);
					if ($('.more-button span:nth-child(2)').hasClass('active')) {
						$('.more-button span:nth-child(1)').addClass('active');
						$('.more-button span:nth-child(2)').removeClass('active');
					}
				} else {
					//show message
					$('.focus-charts>div.container').empty().text('未找到相关记录');
				}
			},
			error: function error(err) {
				console.log(err);
			}
		});
	});

	if (concepts.length < CHARTNUM) {
		$('footer.footer').show();
		$('.more-button').hide();
	}
}