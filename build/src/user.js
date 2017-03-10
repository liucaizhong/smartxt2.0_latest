'use strict';

//global parameters
var delStocks = [];
var delThemes = [];
var delTopics = [];
//http://139.196.18.233:8087/axis2/services/smartxtAPI/getUserInfo?user=13524213611&response=application/json
var URL_PROFILE = '/cross?id=3&';
//http://139.196.18.233:8087/axis2/services/smartxtAPI/getUserConcept?user=13524213611&response=application/json
var URL_CONCEPT = '/cross?id=4&';
var URL_DELCONCEPT = '/crosspost?id=14';
//http://139.196.18.233:8087/axis2/services/smartxtAPI/getUserTopic?user=13524213611&response=application/json
var URL_TOPIC = '/cross?id=5&';
var URL_DELTOPIC = '/crosspost?id=16';
//http://139.196.18.233:8087/smartxtAPI/getSelfChoiceStocks?userId=?
var URL_STOCKS = '/cross?id=7&';
//http://139.196.18.233:8087/smartxtAPI/stockSubmit?userId= &code=
var URL_ADDSTOCK = '/crosspost?id=8';
//http://139.196.18.233:8087/smartxtAPI/stockRemoval
var URL_DELSTOCK = '/crosspost?id=9';
//http://139.196.18.233:8087/smartxtAPI/submitStatus
var URL_FRESHWORD = '/cross?id=12&';
//http://139.196.18.233:8087/smartxtAPI/profileUpdate
var URL_UPDATEPROFILE = '/crosspost?id=17';
var URL_REGISTERUSER = '/crosspost?id=26';
//0:stock,1:theme,2:topic
var opObj = 0;
var loginfo;
var sourceRange = ['投资者总体', '散户群体', '从业人群', '新闻媒体'];
var stockListFromFile = [];
var registerFlag = false;

$(document).ready(function () {
	//get user
	// console.log(window.user);
	if (window.user) {
		loginfo = window.user.replace(/&quot;/g, '"');
		loginfo = JSON.parse(loginfo);
		delete window.user;

		if (!loginfo.username.localeCompare('13524213611') || !loginfo.username.localeCompare('18917892217') || !loginfo.username.localeCompare('13817134049') || !loginfo.username.localeCompare('18611114502') || !loginfo.username.localeCompare('13602515165')) {
			$('#registerTab').show();
		} else {
			$('#registerTab').hide();
		}
		//get user profile
		$.ajax({
			url: encodeURI(URL_PROFILE + 'userId=' + loginfo.username),
			method: 'GET',
			dataType: 'json',
			cache: false,
			success: function success(data) {
				var d = JSON.parse(data);

				_renderProfileTab(d);
			},
			error: function error(err) {
				console.log(err);
			}
		});
		//get self-selected stocks
		$.ajax({
			url: encodeURI(URL_STOCKS + 'userId=' + loginfo.username),
			method: 'GET',
			dataType: 'json',
			cache: false,
			success: function success(data) {
				var d = JSON.parse(data);

				if (d && d.length) {
					_renderStockTab(d);
				}
			},
			error: function error(err) {
				console.log(err);
			}
		});
		//get fresh words
		$.ajax({
			url: encodeURI(URL_FRESHWORD + 'userId=' + loginfo.username),
			method: 'GET',
			dataType: 'json',
			cache: false,
			success: function success(data) {
				var d = JSON.parse(data);

				if (d && d.length) {
					_renderWordTab(d);
				}
			},
			error: function error(err) {
				console.log(err);
			}
		});
		//get concept
		$.ajax({
			url: encodeURI(URL_CONCEPT + 'userId=' + loginfo.username),
			method: 'GET',
			dataType: 'json',
			cache: false,
			success: function success(data) {
				var d = JSON.parse(data);

				if (d) {
					_renderConceptTab(d);
				}
			},
			error: function error(err) {
				console.log(err);
			}
		});
		//get topic
		$.ajax({
			url: encodeURI(URL_TOPIC + 'userId=' + loginfo.username),
			method: 'GET',
			dataType: 'json',
			cache: false,
			success: function success(data) {
				var d = JSON.parse(data);

				if (d) {
					_renderTopicTab(d);
				}
			},
			error: function error(err) {
				console.log(err);
			}
		});
	}

	$('#inputEmailContent').keydown(function (e) {
		var keycode = e.keyCode;
		if (keycode == 13) {
			e.preventDefault();
			onSubmitUpdateEmail();
		}
	});

	$('#form-password input').keydown(function (e) {
		var keycode = e.keyCode;
		if (keycode == 13) {
			e.preventDefault();
			onSubmitUpdatePassword();
		}
	});

	$('#registerRealName').on('input propertychange blur focus', function (e) {
		var name = $(this).val();

		if (name && name.length) {
			$('#registerRealNameErr').hide().text('');
			registerFlag = true;
		} else {
			$('#registerRealNameErr').text('姓名不能为空').show();
			registerFlag = false;
		}
	});

	$('#registerMobileContent').on('input propertychange blur focus', function (e) {
		var mobile = $(this).val();

		if (mobile.length != 11) {
			$('#registerMobileErr').text('联系方式长度不正确').show();
			registerFlag = false;
		} else {
			$('#registerMobileErr').hide().text('');
			registerFlag = true;
		}
	});

	$('#registerEmailContent').on('input propertychange blur focus', function (e) {
		var email = $(this).val();

		if (!email) {
			$('#registerEmailErr').text('邮箱地址为空').show();
			registerFlag = false;
			return;
		}

		var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
		if (!reg.test(email)) {
			$('#registerEmailErr').text('邮箱格式不正确').show();
			registerFlag = false;
			return;
		}

		$('#registerEmailErr').hide().text();
		registerFlag = true;
	});
});

function _renderProfileTab(d) {
	$('#userLevel').text(d.rating);
	$('#realName').text(d.userName);
	$('#email').text(d.email);
	$('#userName').text(d.phone);
	$('#mobile').text(d.phone);
}

function _renderWordTab(data) {
	var $wordDiv = $('#wordTableContent');
	data.forEach(function (cur) {
		var fragment = $('<div class="row table-content">\n                              <div class="col-xs-10 col-lg-10 theme-padding-top">\n                                    <span class="theme-name"></span>\n                              </div>\n                              <div class="col-xs-2 col-lg-2 theme-padding-top">\n                                    <span class="source-name"></span>\n                              </div>\n                          </div>');

		$(fragment).find('.theme-name').text(cur.concept);
		$(fragment).find('.source-name').text(cur.status);
		$wordDiv.append(fragment);
	});
}

function _renderConceptTab(data) {
	var $conceptDiv = $('#themeTableContent');
	data.forEach(function (cur) {
		var conceptName = cur.split('@')[0];
		var sourceName = '';
		cur.split('@')[1].split(';').forEach(function (s) {
			sourceName += sourceRange[+s] + ';';
		});
		sourceName = sourceName.substr(0, sourceName.length - 1);

		// var sourceName = cur.split('@')[1];
		var fragment = $('<div class="row table-content">\n                              <div class="col-xs-5 col-lg-5 theme-padding-top" onclick="onCheckTheme(event)">\n                                    <input type="checkbox">\n                                    <span class="theme-name"></span>\n                              </div>\n                              <div class="col-xs-5 col-lg-5 theme-padding-top">\n                                    <span class="source-name"></span>\n                              </div>\n                              <div class="col-xs-1 col-lg-1 span-fork theme-padding-top">\n                                    <i class="fa fa-times" aria-hidden="true" onclick="onDelTheme(this)"></i>\n                              </div>\n                              <div class="col-xs-1 col-lg-1">\n                                <button class="btn btn-primary btn-load" type="button" onclick="onLoadTheme(this)">查看</button>\n                              </div>\n                          </div>');
		$(fragment).find('.theme-name').text(conceptName);
		$(fragment).find('.source-name').text(sourceName);
		$conceptDiv.append(fragment);
	});
}

function _renderTopicTab(data) {
	var $topicDiv = $('#topicTableContent');
	data.forEach(function (cur) {
		var topicName = cur.split('@')[1];
		var sourceName = cur.split('@')[0];
		var fragment = $('<div class="row table-content">\n                              <div class="col-xs-4 col-lg-4 topic-padding-top" onclick="onCheckTopic(event)">\n                                  \t<input type="checkbox">\n                                    <span class="topic-name"></span>\n                              </div>\n                              <div class="col-xs-4 col-lg-4 topic-padding-top">\n                                    <span class="source-name"></span>\n                              </div>\n                              <div class="col-xs-2 col-lg-2 span-fork topic-padding-top">\n                                    <i class="fa fa-times" aria-hidden="true" onclick="onDelTopic(this)"></i>\n                              </div>\n                              <div class="col-xs-2 col-lg-2">\n                                <button class="btn btn-primary btn-load" type="button" onclick="onLoadTopic(this)">查看</button>\n                              </div>\n                          </div>');
		$(fragment).find('.topic-name').text(topicName);
		$(fragment).find('.source-name').text(sourceName);
		$topicDiv.append(fragment);
	});
}

function onAddStock(that) {
	var stock = $('#stockList').find('li[class*="stock-li-hover"]')[0];

	if (stock) {
		customOpStock(stock);
	}
}

function customOpStock(li) {
	if (!li) {
		return;
	}

	var $li = $(li);
	var code = $li.find('span[class*="item-1"]').text();
	var name = $li.find('span[class*="item-2"]').text();
	$('#stockInput').val('');
	//ajax post
	$.ajax({
		url: URL_ADDSTOCK,
		method: 'POST',
		data: {
			userId: loginfo.username,
			code: code
		},
		// contentType: 'application/json',
		dataType: 'json',
		success: function success(data) {
			var d = JSON.parse(data);

			if (d.flag) {
				_insertStock(code, name, true);
			} else {
				_showFadeMsg(d.msg);
			}
		},
		error: function error(err) {
			console.log(err);
		}
	});
}

function _renderStockTab(data) {
	data.forEach(function (cur) {
		_insertStock(cur.code, cur.name);
	});
}

function _insertStock(code, name, flag) {
	var tableContent = $('<div class="row table-content">\n                              <div class="col-xs-8 col-lg-8" onclick="onCheckStock(event)">\n                                    <input type="checkbox">\n                                    <span class="stock-code"></span>\n                                    <span class="stock-name"></span>\n                              </div>\n                              <div class="col-xs-4 col-lg-4 span-fork">\n                                    <i class="fa fa-times" aria-hidden="true" onclick="onDelStock(this)"></i>\n                              </div>\n                          </div>');

	$(tableContent).find('span[class*="stock-code"]').text(code);
	$(tableContent).find('span[class*="stock-name"]').text(name);

	$('#stockTableContent').append(tableContent);

	//show successful msg or error
	if (flag) _showFadeMsg('成功添加至股票列表');
}

function _showFadeMsg(text) {

	$('#fade-msg').text(text);

	$('#fade-alert').fadeIn(function () {
		setTimeout(function () {
			$('#fade-alert').fadeOut();
		}, 1000);
	});
}

function onDelAllStock(that) {
	var tableContent = $('#stockTableContent input:checked');
	var delNum = tableContent.length;
	opObj = 0;

	if (delNum) {
		delStocks = tableContent;
		$('#alertTitle').text('删除股票');
		$('#alertText').text('确定删除这些股票？');
		$('#global-alert').show();
	}
}

function onCheckAllStock(event) {
	event.stopPropagation();
	if (event.target.tagName == 'INPUT') {
		var check = document.getElementById('checkAllStock');
		if (check.checked) {
			var checkbox = document.querySelectorAll('#stockTableContent div.table-content input');
			if (checkbox.length) {
				Array.prototype.forEach.call(checkbox, function (cur) {
					if (!cur.checked) cur.checked = true;
				});
				//calculate the number of checked item
				var stockAll = $('#stockTableContent div.table-content').length;
				var stockChecked = $('div#stockTableContent input:checked').length;
				$('#stockChecked').text(stockChecked);
				$('#stockAll').text(stockAll);

				$('#del-all-stock').show(500);
			} else {
				check.checked = false;
			}
		} else {
			var checkbox = document.querySelectorAll('#stockTableContent div.table-content input');
			Array.prototype.forEach.call(checkbox, function (cur) {
				if (cur.checked) cur.checked = false;
			});
			$('#del-all-stock').hide(500);
		}
	}
}

function onCheckStock(event) {
	event.stopPropagation();
	if (event.target.tagName == 'INPUT') {
		var checkAll = document.getElementById('checkAllStock');
		var stockAll = $('div#stockTableContent div.table-content').length;
		var stockChecked = $('div#stockTableContent input:checked').length;
		if (stockChecked) {
			if (!checkAll.checked) {
				if (stockAll == stockChecked) checkAll.checked = true;
				$('#stockChecked').text(stockChecked);
				$('#stockAll').text(stockAll);
				$('#del-all-stock').show(500);
			} else {
				if (stockAll != stockChecked) checkAll.checked = false;
				$('#stockChecked').text(stockChecked);
				$('#stockAll').text(stockAll);
			}
		} else {
			checkAll.checked = false;
			$('#del-all-stock').hide(500);
		}
	}
}

function onDelStock(that) {
	delStocks = $(that);
	opObj = 0;

	var stockName = $(that).parent().parent().find('span[class*="stock-name"]').text();

	$('#alertTitle').text('删除股票');
	$('#alertText').text('确定删除股票：' + stockName + '？');
	$('#global-alert').show();
}

function _delStock() {
	var checkAll = document.getElementById('checkAllStock');
	var codes = [];

	$('#global-alert').hide();

	Array.prototype.forEach.call(delStocks, function (cur) {
		codes.push($(cur).parent().parent().find('.stock-code').text());
	});

	//ajax post request
	$.ajax({
		url: URL_DELSTOCK,
		method: 'POST',
		data: {
			userId: loginfo.username,
			code: codes
		},
		// contentType: 'application/json',
		dataType: 'json',
		success: function success(data) {
			var d = JSON.parse(data);

			if (d.flag) {
				$('#del-all-stock').hide(500);
				checkAll.checked = false;
				$('#stockTableContent').find('input:checked').each(function (idx, elem) {
					elem.checked = false;
				});

				//delete the checked stocks
				$(delStocks).parent().parent().remove();

				_showFadeMsg('成功删除股票');

				delStocks = [];
			} else {
				_showFadeMsg(d.msg);
			}
		},
		error: function error(err) {
			console.log(err);
		}
	});
}

function onConfirm() {
	switch (opObj) {
		case 0:
			_delStock();
			break;
		case 1:
			var checkAll = document.getElementById('checkAllTheme');

			$('#global-alert').hide();

			//ajax post request
			var $parentsToDel = $(delThemes).parent().parent();
			var links = '';
			Array.prototype.forEach.call($parentsToDel, function (cur) {
				links += $(cur).find('span[class*="theme-name"]').text();
				links += '@';
				var sources = $(cur).find('span[class*="source-name"]').text().split(';');
				sources.forEach(function (cur) {
					links += sourceRange.indexOf(cur) + ';';
				});
				links = links.substr(0, links.length - 1);
				links += ',';
			});
			links = links.substr(0, links.length - 1);
			$.ajax({
				url: URL_DELCONCEPT,
				method: 'POST',
				data: {
					userId: loginfo.username,
					links: links
				},
				// contentType: 'application/json',
				dataType: 'json',
				success: function success(data) {
					var d = JSON.parse(data);

					if (d[0].status) {
						$('#del-all-theme').hide(500);
						checkAll.checked = false;
						$('#themeTableContent').find('input:checked').each(function (idx, elem) {
							elem.checked = false;
						});

						//delete the checked stocks
						$parentsToDel.remove();

						_showFadeMsg('成功删除主题');

						delThemes = [];
					} else {
						_showFadeMsg(d.msg);
					}
				},
				error: function error(err) {
					console.log(err);
				}
			});

			break;
		case 2:
			var checkAll = document.getElementById('checkAllTopic');

			$('#global-alert').hide();

			//ajax post request
			var $parentsToDel = $(delTopics).parent().parent();
			var links = '';
			Array.prototype.forEach.call($parentsToDel, function (cur) {
				links += $(cur).find('span[class*="source-name"]').text();
				links += '@';
				links += $(cur).find('span[class*="topic-name"]').text();
				links += ',';
			});
			links = links.substr(0, links.length - 1);

			$.ajax({
				url: URL_DELTOPIC,
				method: 'POST',
				data: {
					userId: loginfo.username,
					links: links
				},
				// contentType: 'application/json',
				dataType: 'json',
				success: function success(data) {
					var d = JSON.parse(data);

					if (d[0].status) {
						$('#del-all-topic').hide(500);
						checkAll.checked = false;
						$('#topicTableContent').find('input:checked').each(function (idx, elem) {
							elem.checked = false;
						});

						//delete the checked stocks
						$(delTopics).parent().parent().remove();

						_showFadeMsg('成功删除话题');

						delTopics = [];
					} else {
						_showFadeMsg(d.msg);
					}
				},
				error: function error(err) {
					console.log(err);
				}
			});

			break;
	}
}

function onCancel() {
	$('#global-alert').hide();

	switch (opObj) {
		case 0:
			delStocks = [];
			break;
		case 1:
			delThemes = [];
			break;
		case 2:
			delTopics = [];
			break;
	}
}

function onCheckAllTheme(event) {
	event.stopPropagation();
	if (event.target.tagName == 'INPUT') {
		var check = document.getElementById('checkAllTheme');
		if (check.checked) {
			var checkbox = document.querySelectorAll('#themeTableContent div.table-content input');
			if (checkbox.length) {
				Array.prototype.forEach.call(checkbox, function (cur) {
					if (!cur.checked) cur.checked = true;
				});
				//calculate the number of checked item
				var themeAll = $('#themeTableContent div.table-content').length;
				var themeChecked = $('#themeTableContent input:checked').length;
				$('#themeChecked').text(themeChecked);
				$('#themeAll').text(themeAll);

				$('#del-all-theme').show(500);
			} else {
				check.checked = false;
			}
		} else {
			var checkbox = document.querySelectorAll('#themeTableContent div.table-content input');
			Array.prototype.forEach.call(checkbox, function (cur) {
				if (cur.checked) cur.checked = false;
			});
			$('#del-all-theme').hide(500);
		}
	}
}

function onDelAllTheme(that) {
	var tableContent = $('#themeTableContent input:checked');
	var delNum = tableContent.length;
	opObj = 1;

	if (delNum) {
		delThemes = tableContent;
		$('#alertTitle').text('删除主题');
		$('#alertText').text('确定删除这些主题？');
		$('#global-alert').show();
	}
}

function onCheckTheme(event) {
	event.stopPropagation();
	if (event.target.tagName == 'INPUT') {
		var checkAll = document.getElementById('checkAllTheme');
		var themeAll = $('div#themeTableContent div.table-content').length;
		var themeChecked = $('div#themeTableContent input:checked').length;
		if (themeChecked) {
			if (!checkAll.checked) {
				if (themeAll == themeChecked) checkAll.checked = true;
				$('#themeChecked').text(themeChecked);
				$('#themeAll').text(themeAll);
				$('#del-all-theme').show(500);
			} else {
				if (themeAll != themeChecked) checkAll.checked = false;
				$('#themeChecked').text(themeChecked);
				$('#themeAll').text(themeAll);
			}
		} else {
			checkAll.checked = false;
			$('#del-all-theme').hide(500);
		}
	}
}

function onDelTheme(that) {
	delThemes = $(that);
	opObj = 1;

	var themeName = $(that).parent().parent().find('span[class*="theme-name"]').text();
	var sourceName = $(that).parent().parent().find('span[class*="source-name"]').text();

	$('#alertTitle').text('删除主题');
	$('#alertText').html('确定删除主题：' + themeName + '<br>' + '来源：' + sourceName + '？');
	$('#global-alert').show();
}

function onLoadTheme(that) {
	var span = $(that).parent().parent().find('span');
	var themes = $(span[0]).text();
	var sources = $(span[1]).text();

	// $.StandardPost('/explore/theme',{
	// 	themes: encodeURIComponent(escape(themes)),
	//        sources: encodeURIComponent(escape(sources))
	// });
	var themeUrl = encodeURIComponent(escape(themes));
	var sourceUrl = encodeURIComponent(escape(sources));
	var href = '/theme?themes=' + themeUrl + '&sources=' + sourceUrl;
	window.open(href, '_blank');
}

function onDelAllTopic(that) {
	var tableContent = $('#topicTableContent input:checked');
	var delNum = tableContent.length;
	opObj = 2;

	if (delNum) {
		delTopics = tableContent;
		$('#alertTitle').text('删除话题');
		$('#alertText').text('确定删除这些话题？');
		$('#global-alert').show();
	}
}

function onCheckAllTopic(event) {
	event.stopPropagation();
	if (event.target.tagName == 'INPUT') {
		var check = document.getElementById('checkAllTopic');
		if (check.checked) {
			var checkbox = document.querySelectorAll('#topicTableContent div.table-content input');
			if (checkbox.length) {
				Array.prototype.forEach.call(checkbox, function (cur) {
					if (!cur.checked) cur.checked = true;
				});
				//calculate the number of checked item
				var topicAll = $('#topicTableContent div.table-content').length;
				var topicChecked = $('div#topicTableContent input:checked').length;
				$('#topicChecked').text(topicChecked);
				$('#topicAll').text(topicAll);

				$('#del-all-topic').show(500);
			} else {
				check.checked = false;
			}
		} else {
			var checkbox = document.querySelectorAll('#topicTableContent div.table-content input');
			Array.prototype.forEach.call(checkbox, function (cur) {
				if (cur.checked) cur.checked = false;
			});
			$('#del-all-topic').hide(500);
		}
	}
}

function onCheckTopic(event) {
	event.stopPropagation();
	if (event.target.tagName == 'INPUT') {
		var checkAll = document.getElementById('checkAllTopic');
		var topicAll = $('div#topicTableContent div.table-content').length;
		var topicChecked = $('div#topicTableContent input:checked').length;
		if (topicChecked) {
			if (!checkAll.checked) {
				if (topicAll == topicChecked) checkAll.checked = true;
				$('#topicChecked').text(topicChecked);
				$('#topicAll').text(topicAll);
				$('#del-all-topic').show(500);
			} else {
				if (topicAll != topicChecked) checkAll.checked = false;
				$('#topicChecked').text(topicChecked);
				$('#topicAll').text(topicAll);
			}
		} else {
			checkAll.checked = false;
			$('#del-all-topic').hide(500);
		}
	}
}

function onDelTopic(that) {
	delTopics = $(that);
	opObj = 2;

	var topicName = $(that).parent().parent().find('span[class*="topic-name"]').text();

	$('#alertTitle').text('删除话题');
	$('#alertText').text('确定删除话题：' + topicName + '？');
	$('#global-alert').show();
}

function onLoadTopic(that) {
	var span = $(that).parent().parent().find('span');
	var topic = $(span[0]).text();
	var stock = $(span[1]).text();

	// $.StandardPost('/explore/topic',{
	// 	topic: encodeURIComponent(escape(topic)),
	//        stock: encodeURIComponent(escape(stock))
	// });
	var topicUrl = encodeURIComponent(escape(topic));
	var stockUrl = encodeURIComponent(escape(stock));
	var href = '/explore/topic?topic=' + topicUrl + '&stock=' + stockUrl;
	window.open(href, '_blank');
}

function onUpdateMobile(that) {
	var $that = $(that);
	var state = +$that.attr('data-state');

	if (!state) {
		$that.text('取消');
		state++;
	} else {
		$that.text('修改');
		state--;
	}
	$('#inputMobile').slideToggle();
	$that.attr('data-state', state.toString());
}

function onSubmitUpdateMobile() {
	// console.log('update mobile!');

	if (!$('#inputFieldNo').val()) {
		$('#mobileErr').text('区号为空').show();
		return;
	}

	if (!$('#inputMobileContent').val()) {
		$('#mobileErr').text('号码为空').show();
		return;
	}

	//ajax
	//to do later

	//update successfully
	$('#btnUpdateMobile').text('修改');
	$('#mobileErr').hide();
	$('#inputMobile').slideToggle();
	$('#inputMobileContent').val('');
	_showFadeMsg('成功修改密码');
}

function onUpdateEmail(that) {
	var $that = $(that);
	var state = +$that.attr('data-state');

	if (!state) {
		$that.text('取消');
		state++;
	} else {
		$that.text('修改');
		state--;
	}
	$('#inputEmail').slideToggle();
	$that.attr('data-state', state.toString());
}

function onSubmitUpdateEmail() {
	// console.log('update email!');
	var newEmail = $('#inputEmailContent').val();

	if (!newEmail) {
		$('#emailErr').text('邮箱地址为空').show();
		return;
	}

	var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
	if (!reg.test(newEmail)) {
		$('#emailErr').text('邮箱格式不正确').show();
		return;
	}

	//ajax send request
	$.ajax({
		url: URL_UPDATEPROFILE,
		method: 'POST',
		data: {
			userId: loginfo.username,
			field: 'email',
			value: newEmail
		},
		// contentType: 'application/json',
		dataType: 'json',
		success: function success(data) {
			var d = JSON.parse(data);

			if (d.flag) {
				//update successfully
				$('#email').text(newEmail);
				$('#btnUpdateEmail').text('修改');
				$('#emailErr').hide();
				$('#inputEmail').slideToggle();
				$('#inputEmailContent').val('');
				_showFadeMsg('成功修改邮箱');
			} else {
				$('#emailErr').text(d.msg).show();
			}
		},
		error: function error(err) {
			console.log(err);
		}
	});
}

function onSubmitUpdatePassword() {
	// console.log('update password!');

	if (!$('#oldPassword').val()) {
		$('#changePasswordError').text('旧密码为空').fadeIn();
		return;
	}

	if (!$('#newPassword').val()) {
		$('#changePasswordError').text('新密码为空').fadeIn();
		return;
	}

	if (!$('#repeatNewPassword').val()) {
		$('#changePasswordError').text('重复新密码为空').fadeIn();
		return;
	}

	if ($('#newPassword').val().localeCompare($('#repeatNewPassword').val())) {
		$('#changePasswordError').text('两次输入密码不一致').fadeIn();
		return;
	}

	//ajax
	//to do later
	$.ajax({
		url: URL_UPDATEPROFILE,
		method: 'POST',
		data: {
			userId: loginfo.username,
			field: 'passWord',
			value: $.md5($('#newPassword').val()),
			oldvalue: $.md5($('#oldPassword').val())
		},
		// contentType: 'application/json',
		dataType: 'json',
		success: function success(data) {
			var d = JSON.parse(data);

			if (d.flag) {
				//update successfully
				$('#oldPassword').val('');
				$('#newPassword').val('');
				$('#repeatNewPassword').val('');
				$('#changePasswordError').text('成功修改密码').fadeIn();
				setTimeout(function () {
					$('#changePasswordError').fadeOut();
				}, 1000);
			} else {
				$('#changePasswordError').text(d.msg).fadeIn();
			}
		},
		error: function error(err) {
			console.log(err);
		}
	});
}

function onChangeFile(that) {
	var file = that.files[0];
	stockListFromFile = [];
	if (!$.isEmptyObject(file)) {
		var reader = new FileReader();
		reader.onload = function () {
			var codeArr = [];
			this.result.split('\n').forEach(function (cur) {
				var c = cur.substr(0, 6);
				stocks.forEach(function (cur) {
					if (cur.substr(0, 6) === c) {
						codeArr.push({
							code: c,
							name: cur.substring(6, cur.length)
						});
					}
				});
			});
			$('#fileName').val(file.name);
			// $('#btn-file-remove').show();
			$('#btn-file-submit').show();
			if (codeArr && codeArr.length != 0) {
				if (document.getElementById('btn-file-submit').disabled) {
					document.getElementById('btn-file-submit').disabled = false;
				}
				$('#fileError').hide();
				stockListFromFile = codeArr;
				console.log(stockListFromFile);
			} else {
				if (!document.getElementById('btn-file-submit').disabled) {
					document.getElementById('btn-file-submit').disabled = true;
				}
				$('#fileError').text('不存在真实有效的股票代码').show();
				return false;
			}
		};
		reader.readAsText(file);
	}
}

// function onRemoveSelectedFile() {
//
//   $('#fileName').val('');
//   $('#btn-file-remove').hide();
//   $('#btn-file-submit').hide();
//   $('#fileError').hide();
//   stockListFromFile = [];
//   console.log(stockListFromFile);
// }

function onUploadSelectedFile() {

	$('div.user-loading').show();
	var code = '';
	stockListFromFile.forEach(function (cur) {
		code += cur.code + ',';
	});
	code = code.substring(0, code.length - 1);
	console.log(code);

	// ajax to do later....
	$.ajax({
		url: URL_ADDSTOCK,
		method: 'POST',
		data: {
			userId: loginfo.username,
			code: code
		},
		// contentType: 'application/json',
		dataType: 'json',
		success: function success(data) {
			var d = JSON.parse(data);

			if (d.flag) {
				stockListFromFile.forEach(function (cur) {
					_insertStock(cur.code, cur.name);
				});
				$('#fileName').val('');
				$('#btn-file-submit').hide();
				_clearFileInput();
				_showFadeMsg('成功添加至股票列表');
			} else {
				_showFadeMsg(d.msg);
			}
			$('div.user-loading').hide();
		},
		error: function error(err) {
			console.log(err);
		}
	});
}

function _clearFileInput() {
	var isIE = navigator.userAgent.indexOf('IE') == -1 ? false : true;
	var $el = $('#input-file');
	if (isIE) {
		var $srcFrm = $el.closest('form');
		var $tmpFrm = $(document.createElement('form'));
		var $tmpEl = $(document.createElement('div'));
		$el.before($tmpEl);
		if ($srcFrm.length) {
			$srcFrm.after($tmpFrm);
		} else {
			$tmpEl.after($tmpFrm);
		}
		$tmpFrm.append($el).trigger('reset');
		$tmpEl.before($el).remove();
		$tmpFrm.remove();
	} else {
		// normal input clear behavior for other sane browsers
		$el.val('');
	}
}

function onRegisterUser() {
	if (registerFlag) {
		$.ajax({
			url: URL_REGISTERUSER,
			method: 'POST',
			data: {
				name: $('#registerRealName').val(),
				phone: $('#registerMobileContent').val(),
				email: $('#registerEmailContent').val()
			},
			// contentType: 'application/json',
			dataType: 'json',
			success: function success(data) {
				var d = JSON.parse(data);

				// if(d.flag) {
				//
				// }else {
				if (!$.isEmptyObject(d)) _showFadeMsg('注册成功！');
				// }
			},
			error: function error(err) {
				console.log(err);
			}
		});
	}
}