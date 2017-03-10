//define global params
var method = 0;
var methodRange = [0, 1];
var period = 1;
var periodRange = [10, 30, 60, 90, 120];
var source = [0];
var sourceRange = ['*', 'guba', '(report OR announce)', 'news'];
var sourceName = ['投资者总体', '散户群体', '从业人群', '新闻媒体'];
var theme = [];
// var searchDate;
// var date = new Date();
// var searchDate = date.getFullYear().toString() + (date.getMonth()+1).toString() + date.getDate().toString();
var jump = false;
// var jumpTheme = [];
// var jumpSource = [];
var loginfo;
//echarts
var lineChart = echarts.init(document.getElementById('line-chart'));
var histogram = [];
var leftWidth = 0, rightWidth = 0;
var leftRatio = 55, rightRatio = 45;
var chartIndex = ['文本相关度','价格相关度','流通市值','机构持股比例','股价','5日涨幅'];
// var chartColor = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
var chartColor = ['rgba(199,194,93, .75)', 'rgba(75,188,208, .75)'];

//ajax url
//example: concept=NB-IoT&src=*&response=application/json
// var HEATURL = '139.196.18.233:8087/axis2/services/smartxtAPI/getHeat?';
// example: concept=NB-IoT,PPP&src=news&date=20161019&period=30&response=application/json
// var STOCKURL = '139.196.18.233:8087/axis2/services/smartxtAPI/getStocks?';
var HEATURL = '/cross?id=0&';
var STOCKURL = '/cross?id=1&';
var URL_ADDFRESHWORD = '/crosspost?id=10';
//http://139.196.18.233:8087/smartxtAPI/conceptFollow
var URL_COLLECT = '/crosspost?id=13';
//http://139.196.18.233:8087/smartxtAPI/conceptUnFollow
var URL_UNCOLLECT = '/crosspost?id=14';
var URL_ALLCONCEPTS = '/cross?id=23';

$(document).ready(() => {
    //get user
    if(window.user) {
        loginfo = window.user.replace(/&quot;/g,'"');
        loginfo = JSON.parse(loginfo);
        delete window.user;
    }

    $('#fresh-word').on('input propertychange', function(e) {
        var input = $(this)[0];

        if($(input).val()) {
            $('#btnFresh').attr('disabled', false);
        } else {
            $('#btnFresh').attr('disabled', true);
        }
    });

    $('#fresh-word').keydown(function(e) {
        var keycode = e.keyCode;
        if(keycode == 13) {
            e.preventDefault();
            onSearchWord();
        }
    });
    //datepicker initialization
    $('#datepicker').datetimepicker();
    var picker = $('#datepicker').data('datetimepicker');
    picker.setLocalDate(new Date());
    //echart resize handler
    $(window).on('load resize', () => {
        lineChart.resize();
        // var h = $('#line-chart').width()*0.618;
        // $('#line-chart').height(h);

        // histogram.forEach(function(cur) {
        //     cur.resize();
        // })

        var w = $(window).width();
        if(w < 1520 && w > 795) {
            $('.suspending-toolbar').css({
                'right': '8%'
            });
        }else if(w < 795) {
            $('.suspending-toolbar').css({
                'right': '5%'
            });
        }else {
            $('.suspending-toolbar').css({
                'right': '15%'
            });
        }
    });
    $(window).resize();

    //transfer data to json object
    if(window.concept) {
        var concept = window.concept;
        delete window['concept'];

        jump = true;

        // $('input#theme-input').val(concept);
        theme[0] = concept;
        _setCondition(method,theme);

        // var heatUrl = HEATURL + 'concept=' + concept + '&src=*&response=application/json';
        // var date = new Date();
        // var dateStr = date.getFullYear().toString() + (date.getMonth()+1).toString() + date.getDate().toString();
         // var stockUrl = STOCKURL + 'concept=' + concept + '&date=' + searchDate + '&src=*&period=10&response=application/json';

        _renderCharts();
    }
    if(window.word) {
        var word = unescape(decodeURIComponent(window.word));
        delete window['word'];

        jump = true;
        theme[0] = word;
        _setCondition(method,theme);
        _renderCharts();
    }
    if(window.themes && window.sources) {

        jump = true;

        source = [];
        var jumpSource = unescape(decodeURIComponent(window.sources)).split(';');
        jumpSource.forEach(function(cur) {
            source.push(sourceName.indexOf(cur));
        });

        var themeString = unescape(decodeURIComponent(window.themes));
        if(themeString.indexOf(';') != -1) {
            theme = themeString.split(';');
            method = 2;
        }else {
            theme = themeString.split(',');
            if(source.length > 1) {
                method = 1;
            }else {
                method = 0;
            }
        }

        delete window['themes'];
        delete window['sources'];

        _setCondition(method,theme,source);
        _renderCharts();
    }

        $.ajax({
            url: URL_ALLCONCEPTS,
            type: 'GET',
            async: true,
            cache: false,
            success: (data) => {
                var d = JSON.parse(data);

                if(d && d.length) {
                    // $('input#theme-input').val(d[idx]);
                    _renderDatalist(d);

                    if(!jump) {
                        var idx = Math.floor(Math.random() * (d.length>10?10:d.length));
                        theme[0] = d[idx];
                        // jump = true;
                        _setCondition(method,theme);
                        _renderCharts();
                    }
                } else {
                    //show message
                }
            },
            error: (err) => {
                console.log(err);
            }
        });

    //#form-theme submit handler
    $('#form-theme').submit(function(e) {
        e.preventDefault();

        //check date-input whether empty
        var inputDate = $('#date-input').val();
        if(!inputDate) {
        	_showErr('回溯日期不能为空!');
        	return;
        }
        //check source whether empty
        else if(!source.length) {
        	_showErr('关注人群不能为空!');
        	return;
        }
        //check theme whether empty
        else if(!theme.length) {
        	_showErr('主题信息不能为空!');
        	return;
        }
        else {
        	_hideErr();
        }

        _renderCharts();
    });

});

function _renderDatalist(d) {
    var all = $('#allConcepts');
    d.forEach(function(cur) {
        var option = document.createElement('OPTION');
        $(option).val(cur);
        all.append(option);
    });
}

function _renderCharts(heatUrl, stockUrl) {
    //scroll to result list
    $("html, body").animate({scrollTop: $('#charts').offset().top - 100}, 800);
    $('div.focus-loading').show();

    if(method != 1) {
        var sourceId = 'sn' + source[0];
        var $source = $('#'+sourceId);
        if(!$source.hasClass('active')) {
            $('#sourceNavs').find('a.nav-link[class*="active"]').removeClass('active');
            $source.addClass('active');
        }
        $('#sourceNavs').show();
    }else {
        $('#sourceNavs').hide();
    }

    $('.theme-inputbar').show();

    //generate new URL
    if(!heatUrl) {
        heatUrl = _genUrl(HEATURL);
    }
    if(!stockUrl) {
        stockUrl = _genUrl(STOCKURL, true);
    }

    //ajax get request
    $.ajax({
        url: encodeURI(heatUrl),
        type: 'GET',
        async: true,
        cache: false,
        success: (data) => {
            var d = JSON.parse(data);

            if(d && d.length) {
                //render line chart
                _renderLineChart(d);
                $('div.focus-loading').hide();
            } else {
                //show message
            }
        },
        error: (err) => {
            console.log(err);
        }
    });

    $.ajax({
        url: encodeURI(stockUrl),
        type: 'GET',
        async: true,
        cache: false,
        success: (data) => {
            var d = JSON.parse(data);

            if(d && d.length) {
                //render line chart
                _renderHistogram(d);
            } else {
                //show message
                // $('#tab-content').text('不存在股票相关指数！');
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function _genUrl(url, flag) {
	var url = url + 'userId=';
    var urlTheme = 'concepts=';
    var urlSource = 'sources=';
    var urlDate = 'date=';
    var urlPeriod = 'period=';

    if(loginfo) {
        url += loginfo.username;
    }

    //add theme to url
    if(method != 2) {
        theme.forEach(function(cur) {
        	urlTheme += cur.trim() + ';';
        });
    }else {
        theme.forEach(function(cur) {
            urlTheme += cur.trim() + ',';
        });
    }
    //remove comma at the end of str
    urlTheme = urlTheme.substr(0, urlTheme.length-1);
    // urlTheme = encodeURIComponent(escape(urlTheme));
    //add source to url
    source.forEach(function(cur) {
    	urlSource += cur +';';
    });
	//remove comma at the end of str
	urlSource = urlSource.substr(0, urlSource.length-1);

	url += '&' + urlTheme + '&' + urlSource;
    if(flag) {
        //add date to url
        urlDate += $('#date-input').val().replace(/\//g,'');
        //add period to url
        urlPeriod += periodRange[period];

        url += '&' + urlDate + '&' + urlPeriod;
    }

    return url;
}

function onTriggerSlide(that) {
    if(!loginfo) {
        $.StandardPost('/login/theme', {
            link: '/theme',
            keyword: theme[0]
        });
    }else {
        var $trigger = $(that);
        var expand = $trigger.find('i.fa-angle-double-down')[0];
        var collapse = $trigger.find('i.fa-angle-double-up')[0];
        if (expand) {
            $(expand).removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
        }
        if (collapse) {
            $(collapse).removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
        }
        $('.theme-conditions .container').slideToggle(1000);
    }
    // if(jump) {
    //     _setDefault();
    // }
}

function onMethod(that) {
    var $btn = $(that);
    var curMethod = $btn.attr('id')[1];
    if (method != +curMethod) {
        method = +curMethod;
        _setDefault();
        var btnSiblings = $btn.siblings('button[class*="btn-valid"]');
        Array.prototype.forEach.call(btnSiblings, function(cur) {
            $(cur).removeClass('btn-valid').addClass('btn-invalid');
        });
        $btn.removeClass('btn-invalid').addClass('btn-valid');
    }
    // console.log('method:', method);
}

function _setDefault() {
    // if(jump) {
    //     jump = !jump;
    //     method = 0;
    // }
    //set source
    // var btnChilds = $('div#btnSource').find('button[class*="btn-valid"]');
    // Array.prototype.forEach.call(btnChilds, function(cur) {
    //     $(cur).removeClass('btn-valid').addClass('btn-invalid');
    // });
    // source = [];
    // //modify the display of source
    // $('button#s0').addClass('btn-valid').removeClass('btn-invalid');
    // source[0] = '0';
    // console.log('source:', source);
    //set theme
    if(method == 2) {
        $('#btnAddTheme').removeClass('fa-plus-circle').addClass('fa-link');
    	$('#theme-input').attr('placeholder','请逐次输入要搜索的关键词,例如“煤炭”');
    } else {
        $('#btnAddTheme').removeClass('fa-link').addClass('fa-plus-circle');
    	$('#theme-input').attr('placeholder','输入关键字用于描述要查询的主题信息,例如 “钢铁”');
    }
    if(method == 1) {
        theme = theme.slice(0,1);
        $('#theme-tags').find('div:not([data-txt="' + theme[0].trim() + '"])').remove();
    }else {
        source = source.slice(0,1);
        $('#s' + source[0]).siblings('[class*="btn-valid"]').removeClass('btn-valid').addClass('btn-invalid');
    }
    // var tagChilds = $('div#theme-tags').empty();
    // theme = [];
    // console.log('theme', theme);
}

function onPeriod(that) {
    var $btn = $(that);
    var curPeriod = $btn.attr('id')[1];
    if (period != curPeriod) {
        period = curPeriod;
        var btnSiblings = $btn.siblings('button[class*="btn-valid"]');
        Array.prototype.forEach.call(btnSiblings, function(cur) {
            $(cur).removeClass('btn-valid').addClass('btn-invalid');
        });
        $btn.removeClass('btn-invalid').addClass('btn-valid');
    }
    // console.log('period:', period);
}

function onSource(that) {
    if (method != 1) {
        var $btn = $(that);
        var curSource = +$btn.attr('id')[1]
        if (source[0] != curSource) {
            source[0] = curSource;
            var btnSiblings = $btn.siblings('button[class*="btn-valid"]');
            Array.prototype.forEach.call(btnSiblings, function(cur) {
                $(cur).removeClass('btn-valid').addClass('btn-invalid');
            });
            $btn.removeClass('btn-invalid').addClass('btn-valid');
        }
    } else {
        var $btn = $(that);
        var curSource = +$btn.attr('id')[1];
        var indexOfSource = source.indexOf(curSource);
        if (-1 == indexOfSource) {
            source.push(curSource);
            $btn.removeClass('btn-invalid').addClass('btn-valid');
        } else {
            source.splice(indexOfSource, 1);
            $btn.removeClass('btn-valid').addClass('btn-invalid');
        }
    }
    // console.log('source:', source);
}

function _showErr(text) {
	$('div#error-msg>strong').text(text);
    $('div#error-msg').show(500);
}

function _hideErr() {
	$('div#error-msg').hide(500);
}

function addTheme(that) {
    var $input = $('input#theme-input');
    var keyword = $input.val();

    if (method == 1 && theme.length >= 1) {
        $input.val('');
        _showErr('只能输入1个关键字');
        return;
    }

    if (keyword) {
        $input.val('');
        theme.push(keyword);

        var themeTag = $('<div class="theme-tag alert alert-success col-xs-3 col-lg-2"></div>')[0];
        var $themeTag = $(themeTag);
        $themeTag.attr('data-txt', keyword);
        $themeTag.hover(function(e) {
            $(this).find('.submit-word').show();
        }, function(e) {
            $(this).find('.submit-word').hide();
        });
        //add btn for submitting new word
        var subNewWord = $('<div class="submit-word" onclick="onAddFreshWord(this)">新词提交</div>')[0];
        $(subNewWord).append($('<i class="fa fa-caret-down" aria-hidden="true"></i>'));
        $themeTag.append(subNewWord);
        //theme text
        var themeTxt = $('<span class="theme-txt"></span>')[0];
        $(themeTxt).text(keyword);
        $themeTag.append(themeTxt);
        //theme button
        var themeBtn = $('<button type="button" class="close" aria-label="Close" onclick="delThemeTag(this)"><span aria-hidden="true">&times;</span></button>')[0];
    	$themeTag.append(themeBtn);
    	//append to theme-tags
    	$('#theme-tags').append(themeTag);

    }
    // console.log('theme', theme);
}

function delThemeTag(that) {
    var $btn = $(that);
    var themeTag = $btn.parent();
    var themeText = $btn.siblings('span')[0];
    var indexOfTheme = theme.indexOf($(themeText).text());
    theme.splice(indexOfTheme, 1);
    $(themeTag).remove();
    if(!theme.length) {
    	_hideErr();
    }
    // console.log('theme', theme);
}

function delAlert(that) {
    var $btn = $(that);
    $btn.parent().hide(500);
}

function _renderLineChart(data) {
    //scroll to result list
    // $("html, body").animate({scrollTop: $('#charts').offset().top - 100}, 800);

    lineChart = echarts.init(document.getElementById('line-chart'));
    // chart.showLoading();

    var flag = data[0].flag;
    if(flag == -1) {
        // lineChart.hideLoading();
        // $('#fresh-word').val('');
        // $('#btnFresh').attr('disabled', true);
        return false;
    }else if(flag == 0) {
        var $btnStar = $('i[class*=icon-collect]');
        if($btnStar.hasClass('icon-collected')) {
            $btnStar.removeClass('icon-collected');
        }
        // $('#fresh-word').val(theme[0]);
        // $('#btnFresh').attr('disabled', false);
    }else if(flag == 1) {
        var $btnStar = $('i[class*=icon-collect]');
        if(!$btnStar.hasClass('icon-collected')) {
            $btnStar.addClass('icon-collected');
        }
        // $('#fresh-word').val(theme[0]);
        // $('#btnFresh').attr('disabled', false);
    }
    var entry = data.splice(1);

  	var legend = [];
  	var category = [];
  	var series = [];

  	if(Array.isArray(entry)) {
  		// var catFlag = true;

  		entry.forEach(function(cur) {
	  		var serieH = {
		  		name: cur.concept+' H',
		  		type: 'line',
		  		yAxisIndex: 0,
                itemStyle : {
                    normal: {
                        areaStyle: {
                            type: 'default',
                            color:'rgba(239,243,246,.6)'
                        },
                        color: 'rgb(50,70,90)'
                    }
                },
                symbol: 'none'
		  	};
		  	var serieI = {
		  		name: cur.concept+' I',
		  		type: 'line',
		  		yAxisIndex: 1,
                itemStyle : {
                    normal: {
                        areaStyle: {
                            type: 'default',
                            color: 'rgba(250,225,222,.6)'
                        },
                        color: 'rgb(235,85,30)'
                    }
                },
                symbol: 'none'
		  	};

	  		var heat = [];
	  		var index = [];

            if(method == 1) {
                legend.push({name:sourceName[+cur.source] + ' H',icon: 'line'});
                legend.push({name:sourceName[+cur.source] + ' I',icon: 'line'});
                serieH.name = sourceName[+cur.source] +' H';
                serieI.name = sourceName[+cur.source] +' I';
            } else {
                legend.push({name:cur.concept + ' H',icon: 'line'});
                legend.push({name:cur.concept + ' I',icon: 'line'});
            }

	  		cur.heat.forEach(function(data) {
	  			heat.push(data.heat);
	  			index.push(data.index);
                category.push(data.date);
	  		});

	  		serieH.data = heat;
	  		series.push(serieH);

	  		serieI.data = index;
	  		series.push(serieI);
	  	});
    }

  	var chartTitle = '';
  	if(method != 1) {
  		chartTitle = sourceName[source[0]];
  	} else {
  		chartTitle = theme[0];
  	}

    lineChart.setOption({
        baseOption: {
            title: {
                // text: chartTitle
            },
            tooltip: {
                trigger: 'axis'
            },
            dataZoom: [{
                handleColor:'rgb(75,188,208)',
                fillerColor:'rgb(75,188,208)',
                borderWidth:0,
                show : true,
                realtime: true,
                start:75.5,
                end: 100,
                height:15
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
                data: category,
                axisLine: {
                    show: true,
                    lineStyle:{
                        type:'solid',
                        width: 1,
                        color:'rgb(75,188,208)'
                    }
                },
                axisTick:false,
                axisLabel:{
                    textStyle: {
                        color:'black',
                        fontFamily : '微软雅黑',
                        fontSize : 12
                    }
                },
                boundaryGap : false
            },
            yAxis: [{
                name: '关注度(H)',
                type: 'value',
	  			splitNumber: 10,
                scale:true,
                axisLine: {
                    show: true,
                    lineStyle:{
                        type:'solid',
                        width: 1,
                        color:'rgb(75,188,208)'
                    }
                },
                axisLabel:{
                    textStyle:{
                        color:'black',
                        fontFamily : '微软雅黑',
                        fontSize : 12
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle:{
                        type:'dashed',
                        width: 1
                    }
                },
                nameTextStyle:{
                    color:'black',
                    fontFamily : '微软雅黑',
                    fontSize : 12
                }
            }, {
                name: '指数(I)',
                type: 'value',
	  			splitNumber: 10,
                scale:true,
                axisLine: {
                    show: true,
                    lineStyle:{
                        type:'solid',
                        width: 1,
                        color:'rgb(75,188,208)'
                    }
                },
                axisLabel:{
                    textStyle:{
                        color:'black',
                        fontFamily : '微软雅黑',
                        fontSize : 12
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle:{
                        type:'dashed',
                        width: 1
                    }
                },
                nameTextStyle:{
                    color:'black',
                    fontFamily : '微软雅黑',
                    fontSize : 12
                }
            }],
            series: series
        }
    });
    // lineChart.hideLoading();
}

function _renderHistogram(data) {
    var flag = data[0].flag;
    if(flag == -1) {
        return false;
    }

    //data preprocess
    var entry = data.splice(1);

    var legend = [];
    var chartData = [];

    //get tab-list/tab-content
    var $tabList = $($('#tab-list')[0]);
    var $tabContent = $($('#tab-content')[0]);
    $tabList.empty();
    $tabContent.empty();
    histogram = [];

    if(Array.isArray(entry)) {
        entry.forEach(function(cur) {
            if(method == 1) {
                legend.push(sourceName[+cur.source]);
            } else {
                legend.push(cur.concept);
            }
            //data for one tab
            var category = [];
            var text = [];
            var price = [];
            var marketValue = [];
            var holdRatio = [];
            var stockPrice = [];
            var fiveIncrease = [];
            // legend.push(cur.concept);
            if(cur.stocks && cur.stocks.length) {
                var value = cur.stocks;
                value.forEach(function(val) {
                    category.push(val.name+'('+val.code+')');
                    text.push(val.txtCor);
                    price.push(val.priceCor);
                    marketValue.push(val.MV);
                    holdRatio.push(val.HOLD);
                    stockPrice.push(val.CP);
                    fiveIncrease.push(val.RT);
                });
                chartData.push({
                    category: category,
                    data: [text,price,marketValue,holdRatio,stockPrice,fiveIncrease]
                });
            } else {
                //add a empty obj
                chartData.push({});
            }
        });
    }

    for (var i = 0, len = legend.length; i < len; ++i) {
        //render nav tabs: based on legend
        //create li:nav-item
        var id = 'c'+i;
        var navItem = $('<li class="nav-item"></li>');
        var navLink = $('<a class="nav-link" data-toggle="tab"role="tab"></a>');
        $(navLink).attr('href','#'+id).text(legend[i]);
        if(!i) {
            $(navLink).addClass('active');
        }
        $(navItem).append(navLink);
        $tabList.append(navItem);
        //create tab panel
        var tabPanel = $('<div class="tab-pane" role="tabpanel"></div>');
        $(tabPanel).attr('id',id);
        if(!i) {
            $(tabPanel).addClass('active');
        }
        $tabContent.append(tabPanel);

        var isEmpty = jQuery.isEmptyObject(chartData[i]);
        if(!isEmpty) {

            if($tabContent.hasClass('theme-error-msg')) {
              $tabContent.removeClass('theme-error-msg');
            }
            var l = chartIndex.length;
            //render charts
            for(var n = 0; n < l; ++n) {
                if(n%2) {
                    _renderRightHistogram(chartData[i].category,chartData[i].data[n],chartIndex[n],chartColor[n%2],id);
                    echarts.connect([histogram[n-1+l*i], histogram[n+l*i]]);
                    // console.log(n-1+l*i, n+l*i);
                } else {
                    _renderLeftHistogram(chartData[i].category,chartData[i].data[n],chartIndex[n],chartColor[n%2],id);
                }
            }
        } else {
            //show message
            $tabContent.text('不存在股票相关指数！').addClass('theme-error-msg');
        }

        // $('div.focus-loading').hide();
        //whether show footer
        if($('footer').hasClass('none')) {
            $('footer').show();
        }
    }

}

function _renderLeftHistogram(category,data,index,color,id) {
    if(data) {
        var relChart = $('<div class="rel-chart-l"></div>');
        var tabPanel = $('#'+id);
        if(!leftWidth) {
            leftWidth = $(tabPanel).width()*leftRatio/100;
        }
        $(relChart).css('width',leftWidth+'px');
        $(tabPanel).append(relChart);
        var echart = echarts.init(relChart[0]);
        histogram.push(echart);
        //set echart option
        echart.setOption({
            tooltip : {
                trigger: 'axis',
                axisPointer : {type : 'shadow'},
                position: function (point, params, dom) {
                    $(dom).width('200');
                    return [point[0], point[1]+18];
                }
            },
            grid: {
                containLabel: true
            },
            color: [color],
            legend: {
                data: [index],
                x: 'right',
                textStyle: {
                    fontFamily : '微软雅黑',
                    fontSize : 12,
                    color: 'black'
                }
            },
            xAxis:  {
                type: 'value',
                position:'top',
                axisLine: {show: false},
                splitNumber: 10,
                splitLine: {show: true,
                    lineStyle:{
                        type:'dashed',
                        width: 1
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontFamily : '微软雅黑',
                        fontSize : 12,
                        color: 'black'
                    }
                },
                axisTick: false
            },
            yAxis: {
                type: 'category',
                data: category,
                position: 'left',
                inverse: true,
                axisTick: false,
                axisLine: {show: false},
                splitLine: {show: false}
            },
            series: [
                {
                    name: index,
                    type: 'bar',
                    barMaxWidth: '30px',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: data
                }
            ]
        });
    } else {
        //show message
    }
}

function _renderRightHistogram(category,data,index,color,id) {
    if(data) {
        var relChart = $('<div class="rel-chart-r"></div>');
        var tabPanel = $('#'+id);
        if(!rightWidth) {
            rightWidth = $(tabPanel).width()*rightRatio/100;
        }
        $(relChart).css('width',rightWidth+'px');
        $(tabPanel).append(relChart);
        var echart = echarts.init(relChart[0]);
        histogram.push(echart);
        //set echart option
        echart.setOption({
            tooltip : {
                trigger: 'axis',
                axisPointer : {type : 'shadow'},
                position: function (point, params, dom) {
                    $(dom).width('200');
                    return [point[0], point[1]+18];
                }
            },
            grid: {
                containLabel: true
            },
            legend: {
                data: [index],
                x: 'left',
                textStyle: {
                    fontFamily : '微软雅黑',
                    fontSize : 12,
                    color: 'black'
                }
            },
            xAxis:  {
                type: 'value',
                position:'top',
                axisLine: {show: false},
                splitNumber: 10,
                splitLine: {show: true,
                    lineStyle:{
                        type:'dashed',
                        width: 1
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontFamily : '微软雅黑',
                        fontSize : 12,
                        color: 'black'
                    }
                },
                axisTick: false
            },
            yAxis: {
                type: 'category',
                data: category,
                position: 'left',
                inverse: true,
                axisLabel: {
                    show: false,
                    inside: true
                },
                axisTick: false,
                axisLine: {show: false},
                splitLine: {show: false}
            },
            color: [color],
            series: [
                {
                    name: index,
                    type: 'bar',
                    barMaxWidth: '30px',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: data
                }
            ]
        });
    } else {
        //show message
    }
}

function onEnterTheme(event) {
    event.stopPropagation();

    if(event.keyCode == 13) {
        if($('#theme-input').val()) {
            event.preventDefault();
            addTheme();
        }
    }
}

function onHelp(that) {
    if(!loginfo) {
        $.StandardPost('/login/theme', {
            link: '/theme',
            keyword: theme[0]
        });
    }
}

function onStar(that) {
    if(!loginfo) {
        $.StandardPost('/login/theme', {
            link: '/theme',
            keyword: theme[0]
        });
        return;
    }

    var $btn = $(that).find('i');
    // $btn.toggleClass('collect');

    if(!$btn.hasClass('icon-collected')) {
        var path = URL_COLLECT;
        var msg = '已收藏';
        var data = {
            userId: loginfo.username,
            concept: theme.join(';'),
            source: source.join(';')
        };
    }else {
        var path = URL_UNCOLLECT;
        var msg = '取消收藏';
        var links = '';
        links += theme.join(';')+'@';
        links += source.join(';');
        var data = {
            userId: loginfo.username,
            links: links
        };
    }

    $.ajax({
        url: path,
        method: 'POST',
        data: data,
        // contentType: 'application/json',
        dataType: 'json',
        success: (data) => {
            var d = JSON.parse(data);

            if(d.flag || d[0].status) {
                $btn.toggleClass('icon-collected');
                _showFadeMsg(msg, $('.suspending-toolbar').offset().left-100, $('.suspending-toolbar').offset().top+100);
            }else {
                _showFadeMsg(d.msg);
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function onsourceNav(that) {
    var $that = $(that);

    $('#sourceNavs').find('a.nav-link[class*="active"]').removeClass('active');
    $that.addClass('active');

    //ajax
    var sourceId = $that.attr('id');
    source[0] = sourceId.substr(sourceId.length-1,1);
    _renderCharts();
}

function _showFadeMsg(text,x ,y) {

    // var l = $('.theme-inputbar').offset().left - 50;
    // var t = $('.theme-inputbar').offset().top + 50;
    $('#fade-msg').text(text);
    if(!x) {
        x = '35%';
    }
    if(!y) {
        y = '45%';
    }

    $('#fade-alert').css({'left': x,'top': y}).fadeIn(function() {
        setTimeout(function() {
            $('#fade-alert').fadeOut();
        }, 1000);
    });
}

function onAddFreshWord(that) {
    //fresh-word
    var value = $(that).parent().find('.theme-txt').text();
    //ajax post
    $.ajax({
        url: URL_ADDFRESHWORD,
        method: 'POST',
        data: {
            userId: loginfo.username,
            concept: value
        },
        // contentType: 'application/json',
        dataType: 'json',
        success: (data) => {
            var d = JSON.parse(data);

            if(d.flag) {
                _showFadeMsg('新词：'+value+' 提交成功');
            }else {
                _showFadeMsg(d.msg);
            }
        },
        error: (err) => {
            console.log(err);
        }
    });

}

function _setCondition(m, t, s) {
    if(m) {
        $('#btnMethod').find('button[class*="btn-valid"]').removeClass('btn-valid').addClass('btn-invalid');
        $('#m'+m).removeClass('btn-invalid').addClass('btn-valid');
    }

    if(t && t.length != 0) {
        t.forEach(function(cur) {
            var themeTag = $('<div class="theme-tag alert alert-success col-xs-3 col-lg-2"></div>')[0];
            var $themeTag = $(themeTag);
            $themeTag.attr('data-txt', cur);
            $themeTag.hover(function(e) {
                $(this).find('.submit-word').show();
            }, function(e) {
                $(this).find('.submit-word').hide();
            });
            //add submit new word
            var subNewWord = $('<div class="submit-word" onclick="onAddFreshWord(this)">新词提交</div>')[0];
            $(subNewWord).append($('<i class="fa fa-caret-down" aria-hidden="true"></i>'));
            // var subNewWordDiv = $('<div></div>').append(subNewWord);
            $themeTag.append(subNewWord);
            //theme text
            var themeTxt = $('<span class="theme-txt"></span>')[0];
            $(themeTxt).text(cur);
            $themeTag.append(themeTxt);
            //theme button
            var themeBtn = $('<button type="button" class="close" aria-label="Close" onclick="delThemeTag(this)"><span aria-hidden="true">&times;</span></button>')[0];
            $themeTag.append(themeBtn);
            //append to theme-tags
            $('#theme-tags').append(themeTag);
        });
    }

    if(s && s.length != 0) {
        var $btn = $('#btnSource');
        $btn.find('button[class*="btn-valid"]').removeClass('btn-valid').addClass('btn-invalid');

        s.forEach(function(cur) {
            $('#s'+cur).removeClass('btn-invalid').addClass('btn-valid');
        });
    }
}

function onSearchWord() {
    $('#theme-tags').empty();
    theme = [$('#fresh-word').val()];
    // console.log('theme',theme);
    $('#fresh-word').val('');
    $('#btnFresh').attr('disabled', true);
    _setCondition(method,theme);
    _renderCharts();
}
