//global parameters
var delStocks = [];
var delThemes = [];
var delTopics = [];
//http://139.196.18.233:8087/axis2/services/smartxtAPI/getUserInfo?user=13524213611&response=application/json
var URL_PROFILE = '/cross?id=3&';
//http://139.196.18.233:8087/axis2/services/smartxtAPI/getUserConcept?user=13524213611&response=application/json
var URL_CONCEPT = '/cross?id=4&';
//http://139.196.18.233:8087/axis2/services/smartxtAPI/getUserTopic?user=13524213611&response=application/json
var URL_TOPIC = '/cross?id=5&';
//0:stock,1:theme,2:topic
var opObj = 0;
var loginfo;

$(document).ready(function() {
	//get user
    console.log(window.user);
    if(window.user) {
        loginfo = window.user.replace(/&quot;/g,'"');
        loginfo = JSON.parse(loginfo);
        delete window.user;
        //get user profile
	    $.ajax({
	    	url: URL_PROFILE + 'user=' + loginfo.username + '&response=application/json',
	        method: 'GET',
	        dataType: 'json',
	    	success: (data) => {
	    		var d = JSON.parse(data);
	    		d = d.getUserInfoResponse.return.entry;
	    		if(d) {
	            	_renderProfileTab(d);
	    		}
	        },
	    	error: (err) => {
	            console.log(err);
	    	}
	    });
	    //get concept 
	    $.ajax({
	    	url: URL_CONCEPT + 'user=' + loginfo.username + '&response=application/json',
	        method: 'GET',
	        dataType: 'json',
	    	success: (data) => {
	    		var d = JSON.parse(data);
	    		d = d.getUserConceptResponse.return;
	    		if(d) {
	            	_renderConceptTab(d);
	    		}
	        },
	    	error: (err) => {
	            console.log(err);
	    	}
	    });
	    //get topic
	    $.ajax({
	    	url: URL_TOPIC + 'user=' + loginfo.username + '&response=application/json',
	        method: 'GET',
	        dataType: 'json',
	    	success: (data) => {
	    		var d = JSON.parse(data);
	    		d = d.getUserTopicResponse.return;
	    		if(d) {
	            	_renderTopicTab(d);
	    		}
	        },
	    	error: (err) => {
	            console.log(err);
	    	}
	    });
    } 
});

function _renderProfileTab(data) {
	data.forEach(function(cur) {
		switch(cur.key) {
			case 'rating':
				$('#userLevel').text(cur.value);
				break;
			case 'userName':
				$('#realName').text(cur.value);
				break;
			case 'email':
				$('#email').text(cur.value);
				break;
			case 'phone':
				$('#userName').text(cur.value);
				$('#mobile').text(cur.value);
				break;
		}
	});
}

function _renderConceptTab(data) {
	var $conceptDiv = $('#themeTableContent');
	data.forEach(function(cur) {
		var conceptName = cur.split('#')[0];
		var sourceName = cur.split('#')[1];
		var fragment = $(`<div class="row table-content">
                              <div class="col-xs-5 col-lg-5 theme-padding-top" onclick="onCheckTheme(event)">
                                    <input type="checkbox">
                                    <span class="theme-name"></span>
                              </div>
                              <div class="col-xs-5 col-lg-5 theme-padding-top">
                                    <span class="source-name"></span>
                              </div>
                              <div class="col-xs-1 col-lg-1 span-fork theme-padding-top">
                                    <i class="fa fa-times" aria-hidden="true" onclick="onDelTheme(this)"></i>
                              </div>
                              <div class="col-xs-1 col-lg-1">
                                <button class="btn btn-primary btn-load" type="button" onclick="onLoadTheme(this)">查看</button>
                              </div>
                          </div>`);
		$(fragment).find('.theme-name').text(conceptName);
		$(fragment).find('.source-name').text(sourceName);
		$conceptDiv.append(fragment);
	});
}

function _renderTopicTab(data) {
	var $topicDiv = $('#topicTableContent');
	data.forEach(function(cur) {
		var topicName = cur.split('#')[1];
		var sourceName = cur.split('#')[0];
		var fragment = $(`<div class="row table-content">
                              <div class="col-xs-4 col-lg-4 topic-padding-top" onclick="onCheckTopic(event)">
                                  	<input type="checkbox">
                                    <span class="topic-name"></span>
                              </div>
                              <div class="col-xs-4 col-lg-4 topic-padding-top">
                                    <span class="source-name"></span>
                              </div>
                              <div class="col-xs-2 col-lg-2 span-fork topic-padding-top">
                                    <i class="fa fa-times" aria-hidden="true" onclick="onDelTopic(this)"></i>
                              </div>
                              <div class="col-xs-2 col-lg-2">
                                <button class="btn btn-primary btn-load" type="button" onclick="onLoadTopic(this)">查看</button>
                              </div>
                          </div>`);
		$(fragment).find('.topic-name').text(topicName);
		$(fragment).find('.source-name').text(sourceName);
		$topicDiv.append(fragment);
	});
}

function onAddStock(that) {
	var stock = $('#stockList').find('li[class*="stock-li-hover"]')[0];

	if(stock) {
		customOpStock(stock);
	}
}

function customOpStock(li) {
	if(!li) {
		return;
	}
	
	var $li = $(li);
	var code = $li.find('span[class*="item-1"]').text();
	var name = $li.find('span[class*="item-2"]').text();
	$('#stockInput').val('');
	//ajax post
	//to do later

	var tableContent = $(`<div class="row table-content">
                              <div class="col-xs-8 col-lg-8" onclick="onCheckStock(event)">
                                    <input type="checkbox">
                                    <span class="stock-code"></span>
                                    <span class="stock-name"></span>
                              </div>
                              <div class="col-xs-4 col-lg-4 span-fork">
                                    <i class="fa fa-times" aria-hidden="true" onclick="onDelStock(this)"></i>
                              </div>
                          </div>`);

	$(tableContent).find('span[class*="stock-code"]').text(code);
	$(tableContent).find('span[class*="stock-name"]').text(name);

	$('#stockTableContent').append(tableContent);

	//show successful msg or error
	_showFadeMsg('成功添加至股票列表');
}

function _showFadeMsg(text) {

	$('#fade-msg').text(text);

	$('#fade-alert').fadeIn(function() {
		setTimeout(function() {
			$('#fade-alert').fadeOut();
		}, 1000);
	});
}

function onDelAllStock(that) {
	var tableContent = $('#stockTableContent input:checked');
	var delNum = tableContent.length;
	opObj = 0;

	if(delNum) {
		delStocks = tableContent;
		$('#alertTitle').text('删除股票');
		$('#alertText').text('确定删除这些股票？');
		$('#global-alert').show();
	}
}

function onCheckAllStock(event) {
	event.stopPropagation();
	if(event.target.tagName == 'INPUT') {	
		var check = document.getElementById('checkAllStock');
		if(check.checked) {
			var checkbox = document.querySelectorAll('#stockTableContent div.table-content input');
			if(checkbox.length) {
				Array.prototype.forEach.call(checkbox, function(cur) {
					if(!cur.checked)
						cur.checked = true;
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
			Array.prototype.forEach.call(checkbox, function(cur) {
				if(cur.checked)
					cur.checked = false;
			});
			$('#del-all-stock').hide(500);
		}
	}
}

function onCheckStock(event) {
	event.stopPropagation();
	if(event.target.tagName == 'INPUT') {
		var checkAll = document.getElementById('checkAllStock');
		var stockAll = $('div#stockTableContent div.table-content').length;
		var stockChecked = $('div#stockTableContent input:checked').length;
		if(stockChecked) {
			if(!checkAll.checked) {
				checkAll.checked = true;
				$('#stockChecked').text(stockChecked);
				$('#stockAll').text(stockAll);
				$('#del-all-stock').show(500);
			} else {
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

function onConfirm() {
	switch (opObj) {
		case 0:
			var checkAll = document.getElementById('checkAllStock');

			$('#global-alert').hide();

			//ajax post request
			//to do later
			
			$('#del-all-stock').hide(500);
			checkAll.checked = false;
			$('#stockTableContent').find('input:checked').each(function(idx, elem) {
				elem.checked = false;
			});

			//delete the checked stocks
			$(delStocks).parent().parent().remove();

			_showFadeMsg('成功删除股票');

			delStocks = [];
			break;
		case 1:
			var checkAll = document.getElementById('checkAllTheme');

			$('#global-alert').hide();

			//ajax post request
			//to do later
			
			$('#del-all-theme').hide(500);
			checkAll.checked = false;
			$('#themeTableContent').find('input:checked').each(function(idx, elem) {
				elem.checked = false;
			});
			
			//delete the checked stocks
			$(delThemes).parent().parent().remove();

			_showFadeMsg('成功删除主题');
			
			delThemes = [];
			break;
		case 2:
			var checkAll = document.getElementById('checkAllTopic');

			$('#global-alert').hide();

			//ajax post request
			//to do later
			
			$('#del-all-topic').hide(500);
			checkAll.checked = false;
			$('#topicTableContent').find('input:checked').each(function(idx, elem) {
				elem.checked = false;
			});
			
			//delete the checked stocks
			$(delTopics).parent().parent().remove();

			_showFadeMsg('成功删除话题');
			
			delTopics = [];
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
	if(event.target.tagName == 'INPUT') {	
		var check = document.getElementById('checkAllTheme');
		if(check.checked) {
			var checkbox = document.querySelectorAll('#themeTableContent div.table-content input');
			if(checkbox.length) {
				Array.prototype.forEach.call(checkbox, function(cur) {
					if(!cur.checked)
						cur.checked = true;
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
			Array.prototype.forEach.call(checkbox, function(cur) {
				if(cur.checked)
					cur.checked = false;
			});
			$('#del-all-theme').hide(500);
		}
	}
}

function onDelAllTheme(that) {
	var tableContent = $('#themeTableContent input:checked');
	var delNum = tableContent.length;
	opObj = 1;

	if(delNum) {
		delThemes = tableContent;
		$('#alertTitle').text('删除主题');
		$('#alertText').text('确定删除这些主题？');
		$('#global-alert').show();
	}
}

function onCheckTheme(event) {
	event.stopPropagation();
	if(event.target.tagName == 'INPUT') {
		var checkAll = document.getElementById('checkAllTheme');
		var themeAll = $('div#themeTableContent div.table-content').length;
		var themeChecked = $('div#themeTableContent input:checked').length;
		if(themeChecked) {
			if(!checkAll.checked) {
				checkAll.checked = true;
				$('#themeChecked').text(themeChecked);
				$('#themeAll').text(themeAll);
				$('#del-all-theme').show(500);
			} else {
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

	$('#alertTitle').text('删除主题');
	$('#alertText').text('确定删除主题：' + themeName + '？');
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
	var href = '/explore/theme?themes='+themeUrl+'&sources='+sourceUrl;
	window.open(href, '_blank');
}

function onDelAllTopic(that) {
	var tableContent = $('#topicTableContent input:checked');
	var delNum = tableContent.length;
	opObj = 2;

	if(delNum) {
		delTopics = tableContent;
		$('#alertTitle').text('删除话题');
		$('#alertText').text('确定删除这些话题？');
		$('#global-alert').show();
	}
}

function onCheckAllTopic(event) {
	event.stopPropagation();
	if(event.target.tagName == 'INPUT') {	
		var check = document.getElementById('checkAllTopic');
		if(check.checked) {
			var checkbox = document.querySelectorAll('#topicTableContent div.table-content input');
			if(checkbox.length) {
				Array.prototype.forEach.call(checkbox, function(cur) {
					if(!cur.checked)
						cur.checked = true;
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
			Array.prototype.forEach.call(checkbox, function(cur) {
				if(cur.checked)
					cur.checked = false;
			});
			$('#del-all-topic').hide(500);
		}
	}
}

function onCheckTopic(event) {
	event.stopPropagation();
	if(event.target.tagName == 'INPUT') {
		var checkAll = document.getElementById('checkAllTopic');
		var topicAll = $('div#topicTableContent div.table-content').length;
		var topicChecked = $('div#topicTableContent input:checked').length;
		if(topicChecked) {
			if(!checkAll.checked) {
				checkAll.checked = true;
				$('#topicChecked').text(topicChecked);
				$('#topicAll').text(topicAll);
				$('#del-all-topic').show(500);
			} else {
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
	var href = '/explore/topic?topic='+topicUrl+'&stock='+stockUrl;
	window.open(href, '_blank');
}

function onUpdateMobile(that) {
	var $that = $(that);
	var state = +$that.attr('data-state');

	if(!state) {
		$that.text('取消');
		state++;
	}else {
		$that.text('修改');
		state--;
	}
	$('#inputMobile').slideToggle();
	$that.attr('data-state',state.toString());
}

function onSubmitUpdateMobile() {
	console.log('update mobile!');

	if(!$('#inputFieldNo').val()) {
		$('#mobileErr').text('区号为空').show();
		return;
	}

	if(!$('#inputMobileContent').val()) {
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

	if(!state) {
		$that.text('取消');
		state++;
	}else {
		$that.text('修改');
		state--;
	}
	$('#inputEmail').slideToggle();
	$that.attr('data-state',state.toString());
}

function onSubmitUpdateEmail() {
	console.log('update email!');

	if(!$('#inputEmailContent').val()) {
		$('#emailErr').text('邮箱地址为空').show();
		return;
	}

	var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
	if(!reg.test($('#inputEmailContent').val())) {
		$('#emailErr').text('邮箱格式不正确').show();
		return;
	}

	//update successfully
	$('#btnUpdateEmail').text('修改');
	$('#emailErr').hide();
	$('#inputEmail').slideToggle();
	$('#inputEmailContent').val('');
	_showFadeMsg('成功修改邮箱');
}

function onSubmitUpdatePassword() {
	console.log('update password!');

	if(!$('#oldPassword').val()) {
		$('#changePasswordError').text('旧密码为空')
		//error exists
		$('#changePasswordError').fadeIn();
		return;
	}

	if(!$('#newPassword').val()) {
		$('#changePasswordError').text('新密码为空')
		//error exists
		$('#changePasswordError').fadeIn();
		return;
	}

	if(!$('#repeatNewPassword').val()) {
		$('#changePasswordError').text('重复新密码为空')
		//error exists
		$('#changePasswordError').fadeIn();
		return;
	}

	if($('#newPassword').val().localeCompare($('#repeatNewPassword').val())) {
		$('#changePasswordError').text('两次输入密码不一致')
		//error exists
		$('#changePasswordError').fadeIn();
		return;
	}

	//ajax
	//to do later
	
	//successfully
	$('#oldPassword').val('');
	$('#newPassword').val('');
	$('#repeatNewPassword').val('');
	$('#changePasswordError').fadeOut();
	_showFadeMsg('成功修改密码');
}