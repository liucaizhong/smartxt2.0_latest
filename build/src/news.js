'use strict';

//set timer for refresh website
// var newsTimer = setInterval(_renderMoreNews, INTERVAL);
var INTERVAL = 60 * 10 * 1000;
var abstract = false;
var selfChoice = false;
var activeCategory = [];
var categoryRange = ['*', '业绩预报', '业绩快报', '项目收购', '人事变动', '利润分配', '增持减持', '资金用途', '资产重组', '增发预案', '重大合同', '年度报告'];
var activeIndustry = [];
var industryCategory = ['*', '非银金融', '传媒', '交通运输', '建筑材料', '纺织服装', '房地产', '医药生物', '有色金属', '轻工制造', '采掘', '农林牧渔', '休闲服务', '家用电器', '钢铁', '汽车', '国防军工', '综合', '机械设备', '公用事业', '银行', '化工', '电气设备', '通信', '商业贸易', '计算机', '电子', '食品饮料', '建筑装饰'];
var keyword = '';

$(document).ready(function () {
	//loading more
	$(window).scroll(function () {
		if ($(window).scrollTop() + $(window).height() == $(document).height()) {
			$('.more-button span:nth-child(1)').removeClass('active');
			$('.more-button span:nth-child(2)').addClass('active');

			//to do ajax

		}
	});

	$('#newsInput').on('input propertychange', function (e) {
		var value = $(this).val();
		if (value) {
			$('#search-clear').show();
			keyword = value;
		} else {
			$('#search-clear').hide();
			keyword = '';
		}
		$('.news-content').highlight(keyword);
	});

	$('.auto-refresh > input[name=refresh]').change(function (e) {
		if (this.checked) {
			newsTimer = setInterval(_renderMoreNews, INTERVAL);
		} else {
			clearInterval(newsTimer);
		}
	});

	$('.auto-refresh > input[name=abstract]').change(function (e) {
		abstract = !abstract;
		console.log('abstract', abstract);
	});

	$('.auto-refresh > input[name=self]').change(function (e) {
		selfChoice = !selfChoice;
		console.log('selfChoice', selfChoice);
	});
});

function onExpandContent(that, event) {
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
	$(that).hide();
	keyword = '';
	$('.news-content').highlight(keyword);
}

function _renderMoreNews() {
	console.log('Now the time is', new Date());
}

function onCategory(event) {
	event.stopPropagation();

	var target = event.target;
	if (target.tagName === 'LABEL') {
		var $target = $(target);

		if (!+$target.attr('data-id')) {
			$target.parent().find('[class*=active]').removeClass('active');
			if (!$target.hasClass('active')) {
				$target.addClass('active');
				activeCategory.push($target.attr('data-id'));
				activeCategory = ['0'];
			}
		} else {
			if ($target.hasClass('active')) {
				$target.removeClass('active');
				var dataId = $target.attr('data-id');
				var i = activeCategory.indexOf(dataId);
				activeCategory.splice(i, 1);
				if (!activeCategory.length) {
					activeCategory = ['0'];
					$target.parent().find('[data-id=0]').addClass('active');
				}
			} else {
				var activeChild = $target.parent().find('[class*=active]').length;
				var child = $target.siblings().length - 1;
				if (activeChild == child) {
					$target.parent().find('[class*=active]').removeClass('active');
					$target.parent().find('[data-id=0]').addClass('active');
					activeCategory = ['0'];
				} else {
					$target.addClass('active');
					$target.parent().find('[data-id=0]').removeClass('active');
					var i = activeCategory.indexOf('0');
					if (i != -1) {
						activeCategory.splice(i, 1);
					}
					activeCategory.push($target.attr('data-id'));
				}
			}
		}
	}

	console.log('activeCategory', activeCategory);
}

function onIndustry(event) {
	event.stopPropagation();

	var target = event.target;
	if (target.tagName === 'LABEL') {
		var $target = $(target);

		if (!+$target.attr('data-id')) {
			$target.parent().find('[class*=active]').removeClass('active');
			if (!$target.hasClass('active')) {
				$target.addClass('active');
				activeIndustry.push($target.attr('data-id'));
				activeIndustry = ['0'];
			}
		} else {
			if ($target.hasClass('active')) {
				$target.removeClass('active');
				var dataId = $target.attr('data-id');
				var i = activeIndustry.indexOf(dataId);
				activeIndustry.splice(i, 1);
				if (!activeIndustry.length) {
					activeIndustry = ['0'];
					$target.parent().find('[data-id=0]').addClass('active');
				}
			} else {
				var activeChild = $target.parent().find('[class*=active]').length;
				var child = $target.siblings().length - 1;
				if (activeChild == child) {
					$target.parent().find('[class*=active]').removeClass('active');
					$target.parent().find('[data-id=0]').addClass('active');
					activeIndustry = ['0'];
				} else {
					$target.addClass('active');
					$target.parent().find('[data-id=0]').removeClass('active');
					var i = activeIndustry.indexOf('0');
					if (i != -1) {
						activeIndustry.splice(i, 1);
					}
					activeIndustry.push($target.attr('data-id'));
				}
			}
		}
	}

	console.log('activeIndustry', activeIndustry);
}

//cut str
function _getStrLength(str) {
	var realLength = 0,
	    len = str.length,
	    charCode = -1;
	for (var i = 0; i < len; i++) {
		charCode = str.charCodeAt(i);
		if (charCode >= 0 && charCode <= 128) realLength += 1;else realLength += 2;
	}
	return realLength;
};

function _cutStr(str, len) {
	var str_len = _getStrLength(str);
	var str_length = 0;
	var str_cut = '';
	if (len >= str_len) {
		//.short = str
		//hide button of showing all
		return;
	}

	for (var i = 0; i < str_len; i++) {
		a = str.charAt(i);
		str_length++;
		if (escape(a).length > 4) {
			str_length++;
		}
		str_cut = str_cut.concat(a);
		if (str_length >= len) {
			//.short = str_cut; .long = str;
			//show button of showing all
			return;
		}
	}
}