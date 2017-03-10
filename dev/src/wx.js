var activeCategory = ['0'];
var categoryRange = ['*'];
var INTERVAL = 30*60*1000;
var loginfo;
var URL_CHATS = '/cross?id=20&';
var URL_AFFLIST = '/cross?id=22&';
var lastId = -1;
var keyword = '';
var selfChoice = false;
var MAX_ABS = 500;
//<label class="label-category" data-id="1">安信证券</label>

$(document).ready(() => {
	$.ajax({
		url: encodeURI(URL_AFFLIST),
		type: 'GET',
		async: true,
		cache: false,
		success: (data) => {
		    var d = JSON.parse(data);

		    if(d && d.length) {
		    	d.sort(function(a, b) {
		    		return a.localeCompare(b);
		    	});
		    	var i = d.indexOf('东方证券');
		    	if(i != -1) {
		    		d.splice(i,1);
		    		d.unshift('东方证券');
		    	}
		    	d.forEach(function(cur) {
		    		if(cur.localeCompare('其他')) {
			    		var elem = $('<label class="label-category" style="margin-right: 5px;"></label>');
			    		$(elem).attr('data-id', categoryRange.length+'').text(cur);
			    		categoryRange.push(cur);
			    		$('#sources').append(elem);
			    	}
		    	});
		    }
		},
		error: (err) => {
		    console.log(err);
		}
	});

	if(window.user) {
        loginfo = window.user.replace(/&quot;/g,'"');
        loginfo = JSON.parse(loginfo);
        delete window.user;

        //first loading
        $('footer').hide();
        _renderMoreNews();
        var newsTimer = setInterval(_renderMoreNews, INTERVAL);
    }
	//loading more
	$(window).scroll(function() {
	  	if ($(window).scrollTop() + $(window).height() == $(document).height()) {
	  		$('.more-button span:nth-child(1)').removeClass('active');
	  		$('.more-button span:nth-child(2)').addClass('active');

	  		//loading more
	  		_renderMoreNews(true);
	  	}
	});

	$('#newsInput').keydown(function(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			$('footer').hide();
			$('.more-button').find('[class*=active]').removeClass('active');
			_renderMoreNews();
		}
    });

    $('#newsInput').on('input propertychange', function(e) {
    	var value = $(this).val();
	    if(value) {
	        $('#search-clear').show();
	        keyword = value;
	    }else {
	       	$('#search-clear').hide();
	       	keyword = '';
	    }
    });

    $('.auto-refresh > input[name=self]').change(function(e) {
		selfChoice = !selfChoice;
		$('footer').hide();
 		$('.more-button').find('[class*=active]').removeClass('active');
		_renderMoreNews();
		// console.log('selfChoice',selfChoice);
    });

});

function onCategory(event) {
	$('footer').hide();
	$('.more-button').find('[class*=active]').removeClass('active');
	event.stopPropagation();

	var target = event.target;
	if(target.tagName === 'LABEL') {
		var $target = $(target);

		if(!+$target.attr('data-id')) {
			$target.parent().find('[class*=active]').removeClass('active');
			if(!$target.hasClass('active')) {
				$target.addClass('active');
				activeCategory.push($target.attr('data-id'));
				activeCategory = ['0'];
			}
		}else {
			if($target.hasClass('active')) {
				$target.removeClass('active');
				var dataId = $target.attr('data-id');
				var i = activeCategory.indexOf(dataId);
				activeCategory.splice(i,1);
				if(!activeCategory.length) {
					activeCategory = ['0'];
					$target.parent().find('[data-id=0]').addClass('active');
				}
			}else {
				var activeChild = $target.parent().find('[class*=active]').length;
				var child = $target.siblings().length - 1;
				if(activeChild == child) {
					$target.parent().find('[class*=active]').removeClass('active');
					$target.parent().find('[data-id=0]').addClass('active');
					activeCategory = ['0'];
				}else {
					$target.addClass('active');
					$target.parent().find('[data-id=0]').removeClass('active');
					var i = activeCategory.indexOf('0');
					if(i != -1) {
						activeCategory.splice(i,1);
					}
					activeCategory.push($target.attr('data-id'));
				}
			}
		}
		_renderMoreNews();
	}

	// console.log('activeCategory', activeCategory);
}

function _renderMoreNews(f) {
	// console.log('Now the time is', new Date());
	// console.log('lastId', lastId);
	$('div.focus-loading').show();

	if(!f) {
		lastId = -1;
		$('.news-content>ol').empty();
	}

	var loadUrl = URL_CHATS + 'userId=' + loginfo.username + '&lastId=' + lastId;
	if(keyword) {
		loadUrl += '&keyword=' + keyword;
	}else {
		loadUrl += '&keyword=';
	}
	if(selfChoice) {
		loadUrl += '&selfStocksOnly=1';
	}else {
		loadUrl += '&selfStocksOnly=0';
	}
	if(activeCategory[0] == '0') {
		loadUrl += '&types=';
	}else {
		loadUrl += '&types=';
		activeCategory.forEach(function(cur) {
			loadUrl += '\'' + categoryRange[+cur] + '\'' + ',';
		});
		loadUrl = loadUrl.substr(0, loadUrl.length-1);
	}
	$.ajax({
		url: encodeURI(loadUrl),
		type: 'GET',
		async: true,
		cache: false,
		success: (data) => {
		    var d = JSON.parse(data);

		    if(d && d.length) {
		    	$('#error-msg').hide();
		    	if(d[0].flag != 0) {
		    		$('.more-button').find('[class*=active]').removeClass('active');
		    		$('#error-msg strong').text(d[0].msg);
		    		$('#error-msg').show();
		    	}else {
		    		if(d.length == 1) {
				         //show footer
				        if(f)
		        			$('footer').show();
				        else {
				        	$('.news-content>ol').html('<li style="font-size:2rem;">未找到相关消息</li>');
				        }
		    		}else {
				        //render
				        d.slice(1,d.length).forEach(function(cur) {
				        	_renderNewsContent(cur);
				        });
				        if(keyword) {
				        	$('.news-content').highlight(keyword);
				        }
				        if($('.more-button span:nth-child(2)').hasClass('active')) {
				        	$('.more-button span:nth-child(2)').removeClass('active');
				        }
				        $('.more-button span:nth-child(1)').addClass('active');
		    		}
			    }
			    $('div.focus-loading').hide();
		    }
		},
		error: (err) => {
		    console.log(err);
		}
	});
}

function _renderNewsContent(o) {

	var $ol = $('.news-content>ol');
	var olHasChild = lastId == -1 ? false : true;
	var newLI = false;
	var curDate = o.pubTime.split(' ')[0].split('-');
	var curMon = curDate[1];
	var curDay = curDate[2];

	if(olHasChild){
		var $lastLi = $('#'+lastId);
		var $lastUl = $lastLi.parent();
		var lastMonOfLastLi = +$lastUl.parent().find('header>.date em').text();
		var lastDayOfLastLi = +$lastUl.parent().find('header>.date b').text();

		if(lastMonOfLastLi != curMon || lastDayOfLastLi != curDay) {
			newLI = true;
		}else {
			var fragment = $(`<li class="bottom-line">
                            <div>
                                <h2 class="title"></h2>
                                <div>
                                    <p>
                                        <span class="short"></span>
                                        <span class="long none"></span>
                                        <a class="expand-btn none" href="" onclick="onExpandContent(this,event)">显示全部</a>
                                    </p>
                                </div>
                                <div class="news-footer">
                                    <span class="tag-date"></span>
                                    <span>来源：</span>
                                    <span id="tag-source" class="tag-type"></span>
                                    <span id="label-stock">相关股票：</span>
                                    <span id="tag-stock" class="tag-type"></span>
                                    <button class="collapse-btn none" onclick="onCollapseContent(this)"><i class="fa fa-hand-o-up" aria-hidden="true" style="font-size: 16px;"></i>&nbsp;收起</button>
                                </div>
                            </div>
                        </li>`);
			$(fragment).attr('id', o.increaseId);
			$(fragment).find('h2').text(o.author);
			if(o.txt) {
				fragment = _cutStr(o.txt, MAX_ABS, fragment);
			}
			$(fragment).find('span.tag-date').text(o.pubTime.split('.')[0]);
			$(fragment).find('span#tag-source').text(o.aff);
			if(o.code)
				$(fragment).find('span#tag-stock').text(o.code);
			else {
				$(fragment).find('span#label-stock').addClass('none');
				$(fragment).find('span#tag-stock').addClass('none');
			}

			$lastUl.append(fragment);
		}

	}else {
		newLI = true;
	}

	if(newLI) {
		var fragment = $(`<li class="sameday-news">
                    <header>
                        <div class="date">
                            <span><em></em>月</span>
                            <b></b>
                        </div>
                    </header>
                    <ul>
                        <li class="bottom-line">
                            <div>
                                <h2 class="title"></h2>
                                <div>
                                    <p>
                                        <span class="short"></span>
                                        <span class="long none"></span>
                                        <a class="expand-btn none" href="" onclick="onExpandContent(this,event)">显示全部</a>
                                    </p>
                                </div>
                                <div class="news-footer">
                                    <span class="tag-date"></span>
                                    <span>来源：</span>
                                    <span id="tag-source" class="tag-type"></span>
                                    <span id="label-stock">相关股票：</span>
                                    <span id="tag-stock" class="tag-type"></span>
                                    <button class="collapse-btn none" onclick="onCollapseContent(this)"><i class="fa fa-hand-o-up" aria-hidden="true" style="font-size: 16px;"></i>&nbsp;收起</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>`);

		$(fragment).find('.date em').text(curMon);
		$(fragment).find('.date b').text(curDay);
		$(fragment).find('.bottom-line').attr('id', o.increaseId);
		$(fragment).find('h2').text(o.author);
		if(o.txt) {
			fragment = _cutStr(o.txt, MAX_ABS, fragment);
		}
		$(fragment).find('span.tag-date').text(o.pubTime.split('.')[0]);
		$(fragment).find('span#tag-source').text(o.aff);
		if(o.code)
			$(fragment).find('span#tag-stock').text(o.code);
		else {
			$(fragment).find('span#label-stock').addClass('none');
			$(fragment).find('span#tag-stock').addClass('none');
		}

		$ol.append(fragment);
	}

	//record lastId
	lastId = o.increaseId;
}

//cut str
function _getStrLength(str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

function _cutStr(str, len, elem) {
    var str_len = _getStrLength(str);
    var str_length = 0;
    var str_cut = '';
    if(len >= str_len) {
    	//.short = str
    	//hide button of showing all
    	$(elem).find('span.short').html(str);
    	return elem;
    }

    for (var i = 0; i < str_len; i++) {
        var a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            //.short = str_cut + '...'; .long = str;
            //show button of showing all
            $(elem).find('span.short').html(str_cut+'......');
			$(elem).find('span.long').html(str);
			$(elem).find('.expand-btn').removeClass('none');
            return elem;
        }
    }
}

function delAlert(that) {
	$(that).parent().fadeOut();
}

function onExpandContent(that,event) {
	event.preventDefault();
	var $that = $(that);
	$that.parent().find('.short').hide();
	$that.parent().find('.long').show();
	$that.hide().parent().parent().parent().find('.collapse-btn').show();
}

function onCollapseContent(that) {
	var $that = $(that);
	$that.parent().parent().find('.short').show();
	$that.parent().parent().find('.long').hide();
	$that.parent().parent().find('.expand-btn').show();
	$that.hide();
}

function clearSearch(that) {
    $('#newsInput').val('');
    $('footer').hide();
	$('.more-button').find('[class*=active]').removeClass('active');
    $(that).hide();
    keyword = '';
    _renderMoreNews();
}
