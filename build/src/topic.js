'use strict';

//http://139.196.18.233:8087/smartxtAPI/topicHeat?
var URL_TOPICHEAT = '/cross?id=2&';
//http://139.196.18.233:8087/smartxtAPI/topicFollow
var URL_COLLECT = '/crosspost?id=15';
//http://139.196.18.233:8087/smartxtAPI/topicUnFollow
var URL_UNCOLLECT = '/crosspost?id=16';
var URL_ALLTOPICS = '/cross?id=24&';
var URL_TOPICLIST = '/cross?id=25';
var cond = {
	topic: '',
	stock: ''
};
var loginfo;
var jump = false;
//echarts
var chartAttention = echarts.init(document.getElementById('chart-attention'));
var chartPrice = echarts.init(document.getElementById('chart-price'));
echarts.connect([chartAttention, chartPrice]);

$(document).ready(function () {

	//get user
	if (window.user) {
		loginfo = window.user.replace(/&quot;/g, '"');
		loginfo = JSON.parse(loginfo);
		delete window.user;

		var loadUrl = URL_ALLTOPICS + 'userId=' + loginfo.username + '&keyword=';
		$.ajax({
			url: encodeURI(loadUrl),
			type: 'GET',
			async: true,
			cache: false,
			success: function success(data) {
				var d = JSON.parse(data);

				if (d && d.length) {
					var idx = Math.floor(Math.random() * (d.length > 5 ? 5 : d.length));
					//       cond.topic = d[idx].event;
					// cond.stock = d[idx].name;

					_renderTopicTags(d);
				} else {
					//show message
				}
			},
			error: function error(err) {
				console.log(err);
			}
		});
	}

	//deal with jump search
	if (window.topic && window.stock) {
		var topic = unescape(decodeURIComponent(window.topic));
		var stock = unescape(decodeURIComponent(window.stock));

		delete window['topic'];
		delete window['stock'];

		cond.topic = topic;
		cond.stock = stock;
		jump = true;

		var url = URL_TOPICHEAT + 'userId=' + loginfo.username + '&stock=' + stock + '&topic=' + topic;
		_renderChart(url);
	} else {
		cond.topic = '举牌';
		cond.stock = '金科股份';
		var url = URL_TOPICHEAT + 'userId=' + loginfo.username + '&stock=' + cond.stock + '&topic=' + cond.topic;
		if (!jump) _renderChart(url);
	}

	//load topiclist
	$.ajax({
		url: encodeURI(URL_TOPICLIST),
		type: 'GET',
		async: true,
		cache: false,
		success: function success(data) {
			var d = JSON.parse(data);

			if (d && d.length) {
				_renderDatalist(d);
			} else {
				//show message
			}
		},
		error: function error(err) {
			console.log(err);
		}
	});

	//echart resize
	$(window).on('resize', function () {
		chartAttention.resize();
		chartPrice.resize();
		var w = $(window).width();
		if (w < 1520 && w > 795) {
			$('.suspending-toolbar').css({
				'right': '8%'
			});
		} else if (w < 795) {
			$('.suspending-toolbar').css({
				'right': '5%'
			});
		} else {
			$('.suspending-toolbar').css({
				'right': '15%'
			});
		}
	});

	$(window).resize();

	$('#stockInput').on('input propertychange', function (e) {
		if ($(this).val()) {
			if ($(this).hasClass('error')) {
				$(this).removeClass('error');
			}
		}
	});

	$('#eventInput').on('input propertychange', function (e) {
		if ($(this).val()) {
			if ($(this).hasClass('error')) {
				$(this).removeClass('error');
			}
		}
	});
	//form submit
	$('#form-topic').submit(function (e) {
		e.preventDefault();
		_hideErr();
		var stock = $('#stockInput').val();
		var topic = $('#eventInput').val();

		if (!stock) {
			$('#stockInput').addClass('error');
			return false;
		}

		if (!topic) {
			$('#eventInput').addClass('error');
			return false;
		}

		cond.topic = topic;
		cond.stock = stock;

		var url = URL_TOPICHEAT + 'userId=' + loginfo.username + '&stock=' + stock + '&topic=' + topic;
		_renderChart(url);
	});

	$('#topicPoolInput').on('input propertychange', function (e) {
		var value = $(this).val();
		if (value) {
			$('#search-clear').show();
			$('#topic-tags').find(":not(label[data-value*='" + value + "'])").hide();
			$('#topic-tags').find("label[data-value*='" + value + "']").show();
		} else {
			$('#topic-tags').children().show();
		}
	});
});

function onStar(that) {
	var $btn = $(that).find('i');
	if (!$btn.hasClass('icon-collected')) {
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

			if (d.flag || d[0].status) {
				$btn.toggleClass('icon-collected');
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

function _renderDatalist(d) {
	var all = $('#topicList');
	d.forEach(function (cur) {
		var option = document.createElement('OPTION');
		$(option).val(cur);
		all.append(option);
	});
}

function _renderChart(url) {
	$('div.focus-loading').show();

	chartAttention = echarts.init(document.getElementById('chart-attention'));
	chartPrice = echarts.init(document.getElementById('chart-price'));
	echarts.connect([chartAttention, chartPrice]);
	// configure echart
	// chartAttention.showLoading();
	// chartPrice.showLoading();
	$.ajax({
		url: encodeURI(url),
		cache: false,
		success: function success(data) {

			var heat = [];
			var index = [];
			var category = [];
			var legend = cond.stock + '-' + cond.topic;
			var d = JSON.parse(data);
			var entry = d.topicHeat;
			if (!entry || !entry.length) {
				// chartAttention.hideLoading();
				// chartPrice.hideLoading();
				_showErr('找不到相关信息');
				$('div.focus-loading').hide();
				return false;
			}
			var flag = d.flag;
			var $btnCollect = $('i[class*=icon-collect]');
			if (0 == flag || -1 == flag) {
				if ($btnCollect.hasClass('icon-collected')) {
					$btnCollect.removeClass('icon-collected');
				}
			} else if (1 == flag) {
				if (!$btnCollect.hasClass('icon-collected')) {
					$btnCollect.addClass('icon-collected');
				}
			}
			$('#stockInput').val('');
			$('#eventInput').val('');
			// $('.charts .topic-collect').show();
			//scroll to result list
			// $("html, body").animate({scrollTop: $('section.charts').offset().top-60}, 800);

			entry.forEach(function (cur) {
				category.push(cur.date);
				heat.push(cur.heat);
				index.push(cur.index);
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
					dataZoom: [{
						handleColor: 'rgb(75,188,208)',
						fillerColor: 'rgb(75,188,208)',
						borderWidth: 0,
						show: true,
						realtime: true,
						start: 75.5,
						end: 100,
						height: 15
					}],
					legend: {
						data: [{
							name: legend,
							icon: 'line'
						}]
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: [{
						type: 'category',
						data: category,
						axisLine: {
							show: true,
							lineStyle: {
								type: 'solid',
								width: 1,
								color: 'rgb(75,188,208)'
							}
						},
						axisTick: false,
						axisLabel: {
							textStyle: {
								fontFamily: '微软雅黑',
								fontSize: 12,
								color: 'black'
							}
						},
						boundaryGap: false
					}],
					yAxis: [{
						name: '关注度(H)',
						type: 'value',
						scale: true,
						axisLine: {
							show: true,
							lineStyle: {
								type: 'solid',
								width: 1,
								color: 'rgb(75,188,208)'
							}
						},
						axisLabel: {
							textStyle: {
								fontFamily: '微软雅黑',
								fontSize: 12,
								color: 'black'
							}
						},
						axisTick: false,
						nameTextStyle: {
							fontFamily: '微软雅黑',
							fontSize: 12,
							color: 'black'
						},
						splitNumber: 10,
						splitLine: {
							show: true,
							lineStyle: {
								type: 'dashed',
								width: 1,
								color: '#dcdcdc'
							}
						}
					}],
					series: [{
						name: legend,
						type: 'line',
						data: heat,
						itemStyle: {
							normal: {
								color: 'rgb(50,70,95)'
							}
						}
					}]
				}
			});
			// chartAttention.hideLoading();

			//price
			chartPrice.setOption({
				baseOption: {
					title: {
						text: ''
					},
					tooltip: {
						trigger: 'axis'
					},
					dataZoom: [{
						handleColor: 'rgb(75,188,208)',
						fillerColor: 'rgb(75,188,208)',
						borderWidth: 0,
						show: true,
						realtime: true,
						start: 75.5,
						end: 100,
						height: 15
					}],
					legend: {
						data: [{
							name: legend,
							icon: 'line'
						}]
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: [{
						// name: 'Date',
						type: 'category',
						data: category,
						axisLine: {
							show: true,
							lineStyle: {
								type: 'solid',
								width: 1,
								color: 'rgb(75,188,208)'
							}
						},
						axisTick: false,
						axisLabel: {
							textStyle: {
								fontFamily: '微软雅黑',
								fontSize: 12,
								color: 'black'
							}
						},
						boundaryGap: false
					}],
					yAxis: [{
						name: '价格指数(I)',
						type: 'value',
						scale: true,
						axisLine: {
							show: true,
							lineStyle: {
								type: 'solid',
								width: 1,
								color: 'rgb(75,188,208)'
							}
						},
						axisLabel: {
							textStyle: {
								fontFamily: '微软雅黑',
								fontSize: 12,
								color: 'black'
							}
						},
						axisTick: false,
						nameTextStyle: {
							fontFamily: '微软雅黑',
							fontSize: 12,
							color: 'black'
						},
						splitNumber: 10,
						splitLine: {
							show: true,
							lineStyle: {
								type: 'dashed',
								width: 1,
								color: '#dcdcdc'
							}
						}
					}],
					series: [{
						name: legend,
						type: 'line',
						data: index,
						itemStyle: {
							normal: {
								color: 'rgb(230,85,30)'
							}
						}
					}]
				}
			});
			// chartPrice.hideLoading();
			$('div.focus-loading').hide();
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

	var l = $('.suspending-toolbar').offset().left - 50;
	var t = $('.suspending-toolbar').offset().top + 100;
	$('#fade-msg').text(text);

	$('#fade-alert').css({ 'left': l, 'top': t }).fadeIn(function () {
		setTimeout(function () {
			$('#fade-alert').fadeOut();
		}, 1000);
	});
}

function onPool(that) {
	$('#topic-tags').children().show();
	var poolHeight = $(document).height();
	$('#pool').height(poolHeight).show();
}

function destroyPool(that) {
	$('#pool').hide();
	clearSearch();
}

function clearSearch(that) {
	$('#topicPoolInput').val('');
	$('#topic-tags').children().show();
	$('#search-clear').hide();
}

function _renderTopicTags(tags) {
	var $tagsPool = $('#topic-tags');
	tags.forEach(function (cur) {
		var tag = $('<label class="label-category" ></label>');
		$(tag).attr('data-value', cur.code + '|' + cur.name + '|' + cur.event);
		$(tag).text(cur.code + '-' + cur.name + '-' + cur.event);
		$tagsPool.append(tag);
	});
}

function checkTag(e) {
	e.stopPropagation();
	if (e.target.tagName === 'LABEL') {
		destroyPool();
		var $btnCollect = $('.charts .topic-collect .btn-star');
		if ($btnCollect.hasClass('collect')) {
			$btnCollect.removeClass('collect');
		}
		var value = $(e.target).attr('data-value').split('|');
		cond.topic = value[2];
		cond.stock = value[1];

		var url = URL_TOPICHEAT + 'userId=' + loginfo.username + '&stock=' + cond.stock + '&topic=' + cond.topic;
		_renderChart(url);
	}
}