//define global params
var method = 0;
var methodRange = [0, 1];
var period = 0;
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
var lineChart = echarts.init(document.getElementById('line-chart'), 'macarons');
var histogram = [];
var leftWidth = 0, rightWidth = 0;
var leftRatio = 55, rightRatio = 45;
var chartIndex = ['文本相关度','价格相关度','流通市值','机构持股比例','股价','5日涨幅'];
// var chartColor = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
var chartColor = ['#B8C309', '#0CF5F5'];

//ajax url
//example: concept=NB-IoT&src=*&response=application/json
// var HEATURL = '139.196.18.233:8087/axis2/services/smartxtAPI/getHeat?';
// example: concept=NB-IoT,PPP&src=news&date=20161019&period=30&response=application/json
// var STOCKURL = '139.196.18.233:8087/axis2/services/smartxtAPI/getStocks?';
var HEATURL = '/cross?id=0&';
var STOCKURL = '/cross?id=1&';

$(document).ready(() => {
    //datepicker initialization
    $('#datepicker').datetimepicker();
    var picker = $('#datepicker').data('datetimepicker');
    picker.setLocalDate(new Date());
    //echart resize handler
    $(window).on('resize', () => {
        lineChart.resize();
        // histogram.forEach(function(cur) {
        //     cur.resize();
        // })
    });
    //transfer data to json object
    if(window.concept) {
        var concept = window.concept;
        delete window['concept'];

        theme.push(concept);
        jump = true;

        // var heatUrl = HEATURL + 'concept=' + concept + '&src=*&response=application/json';
        // var date = new Date();
        // var dateStr = date.getFullYear().toString() + (date.getMonth()+1).toString() + date.getDate().toString();
         // var stockUrl = STOCKURL + 'concept=' + concept + '&date=' + searchDate + '&src=*&period=10&response=application/json';

        _renderCharts();
    }
    if(window.themes && window.sources) {
        theme = unescape(decodeURIComponent(window.themes)).split('+');
        source = [];
        var jumpSource = unescape(decodeURIComponent(window.sources)).split('+');
        jumpSource.forEach(function(cur) {
            source.push(sourceName.indexOf(cur));
        });

        delete window['themes'];
        delete window['sources'];

        jump = true;
        if(source.length > 1) {
            method = 1;
        }
        _renderCharts();

        // var themeUrl = 'concept=';
        // jumpTheme.forEach(function(cur) {
        //     themeUrl += cur.trim() + ',';
        // });
        // //remove comma at the end of str
        // themeUrl = themeUrl.substr(0, themeUrl.length-1);

        // var sourceUrl = '&src=';
        // jumpSource.forEach(function(cur) {
        //     sourceUrl += sourceRange[sourceName.indexOf(cur.trim())];
        // });
        // sourceUrl = sourceUrl.substr(0, sourceUrl.length-1);

        // var heatUrl = HEATURL + themeUrl + sourceUrl +'&response=application/json';
        // var date = new Date();
        // var dateStr = date.getFullYear().toString() + (date.getMonth()+1).toString() + date.getDate().toString();
        // var stockUrl = STOCKURL + themeUrl + '&date=' + dateStr + sourceUrl +'&period=10&response=application/json';
        // console.log(heatUrl);
        // console.log(stockUrl);
        // _renderCharts(heatUrl, stockUrl);
    }
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
    //get user
    console.log(window.user);
    if(window.user) {
        loginfo = window.user.replace(/&quot;/g,'"');
        loginfo = JSON.parse(loginfo);
        delete window.user;
    } 
});

function _loadingChart(chart) {
	chart.showLoading();

	//scroll to result list
    $("html, body").animate({scrollTop: $('#charts').offset().top - 100}, 800);
}

function _renderCharts(heatUrl, stockUrl) {
    
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

    // if(jump) {
    //     var sourceId = 'sn' + sourceName.indexOf(jumpSource[0]);
    //     var $source = $('#'+sourceId);
    //     if(!$source.hasClass('active')) {
    //         $('#sourceNavs').find('a.nav-link[class*="active"]').removeClass('active');
    //         $source.addClass('active');
    //     }
    //     $('#sourceNavs').show();
    //     jump = 0;
    // }

    // $('#inputFreshWord').show();
    // $('#btnThemeCollect').show();
    $('.theme-inputbar').show();

    //generate new URL
    if(!heatUrl) {
        heatUrl = _genUrl(HEATURL);
    }
    if(!stockUrl) {
        stockUrl = _genUrl(STOCKURL, true);
    }

    _loadingChart(lineChart);
    //ajax get request
    $.ajax({
        url: heatUrl,
        type: 'GET',
        async: true,
        dataType: 'json',
        success: (data) => {
            if(data) {
                //render line chart
                _renderLineChart(JSON.parse(data));
            } else {
                //show message
            }
        },
        error: (err) => {
            console.log(err);
        }
    });

    $.ajax({
        url: stockUrl,
        type: 'GET',
        async: true,
        dataType: 'json',
        success: (data) => {
            if(data) {
                //render line chart
                _renderHistogram(JSON.parse(data));
            } else {
                //show message
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function _genUrl(url, flag) {
	var url = url;
    var urlTheme = 'concept=';
    var urlSource = 'src=';
    var urlDate = 'date=';
    var urlPeriod = 'period=';
    //add theme to url
    theme.forEach(function(cur) {
    	urlTheme += cur.trim() + ',';
    });
    //remove comma at the end of str
    urlTheme = urlTheme.substr(0, urlTheme.length-1);
    //add source to url
    source.forEach(function(cur) {
    	urlSource += sourceRange[cur].trim() +',';
    });
	//remove comma at the end of str
	urlSource = urlSource.substr(0, urlSource.length-1);

	url = url + urlTheme + '&' + urlSource;
    if(flag) {
        //add date to url
        urlDate += $('#date-input').val().replace(/\//g,'');
        //add period to url
        urlPeriod += periodRange[period];

        url += '&' + urlDate + '&' + urlPeriod;
    }
    url += '&response=application/json';

    return url;
}

function onTriggerSlide(that) {
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

    if(jump) {
        _setDefault();
    }
}

function onMethod(that) {
    var $btn = $(that);
    var curMethod = $btn.attr('id')[1];
    if (method != curMethod) {
        method = curMethod;
        _setDefault();
        var btnSiblings = $btn.siblings('button[class*="btn-valid"]');
        Array.prototype.forEach.call(btnSiblings, function(cur) {
            $(cur).removeClass('btn-valid').addClass('btn-invalid');
        });
        $btn.removeClass('btn-invalid').addClass('btn-valid');
    }
    console.log('method:', method);
}

function _setDefault() {
    if(jump) {
        jump = !jump;
        method = 0;
    }
    //set source
    var btnChilds = $('div#btnSource').find('button[class*="btn-valid"]');
    Array.prototype.forEach.call(btnChilds, function(cur) {
        $(cur).removeClass('btn-valid').addClass('btn-invalid');
    });
    source = [];
    //modify the display of source
    $('button#s0').addClass('btn-valid').removeClass('btn-invalid');
    source[0] = '0';
    console.log('source:', source);
    //set theme
    if(method == 2) {
    	$('#theme-input').attr('placeholder','支持主题交叉搜索(半角分号隔开),例如“钢铁;煤炭”');
    } else {
    	$('#theme-input').attr('placeholder','输入关键字用于描述要查询的主题信息,例如 “钢铁”');
    }
    var tagChilds = $('div#theme-tags').empty();
    theme = [];
    console.log('theme', theme);
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
    console.log('period:', period);
}

function onSource(that) {
    if (0 == method) {
        var $btn = $(that);
        var curSource = $btn.attr('id')[1]
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
        var curSource = $btn.attr('id')[1];
        var indexOfSource = source.indexOf(curSource);
        if (-1 == indexOfSource) {
            source.push(curSource);
            $btn.removeClass('btn-invalid').addClass('btn-valid');
        } else {
            source.splice(indexOfSource, 1);
            $btn.removeClass('btn-valid').addClass('btn-invalid');
        }
    }
    console.log('source:', source);
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

    if (method != 0 && theme.length >= 1) {
        $input.val('');
        _showErr('只能输入1个关键字');
        return;
    }

    if (keyword) {
        $input.val('');
        var themeTag = $('<div class="theme-tag alert alert-success col-xs-3 col-lg-2"></div>')[0];
        var $themeTag = $(themeTag);
        //theme text
        var themeTxt = $('<span class="theme-txt"></span>')[0];
        $(themeTxt).text(keyword);
        $themeTag.append(themeTxt);
        //theme button
        var themeBtn = $('<button type="button" class="close" aria-label="Close" onclick="delThemeTag(this)"><span aria-hidden="true">&times;</span></button>')[0];
    	$themeTag.append(themeBtn);
    	//append to theme-tags
    	$('#theme-tags').append(themeTag);

    	theme.push(keyword);
    }
    console.log('theme', theme);
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
    console.log('theme', theme);
}

function delAlert(that) {
    var $btn = $(that);
    var parentId = $($btn.parent()).attr('id');
    $('div#' + parentId).hide(500);
}

function _renderLineChart(data) {
    //scroll to result list
    // $("html, body").animate({scrollTop: $('#charts').offset().top - 100}, 800);

    lineChart = echarts.init(document.getElementById('line-chart'), 'macarons'); 
    // chart.showLoading();

    var entry = data.getHeatResponse.return.entry;
    if(jQuery.isEmptyObject(entry)) {
        //show message
        lineChart.hideLoading();
        return;
    }

  	var legend = []; 
  	var category = [];
  	var series = [];

  	if(Array.isArray(entry)) {
  		var catFlag = true;

  		entry.forEach(function(cur,i) {
	  		var serieH = {
		  		name: 'H-'+cur.key,
		  		type: 'line',
		  		yAxisIndex: 0,
                // areaStyle: {
                //     normal: {}
                // }
		  	};
		  	var serieI = {
		  		name: 'I-'+cur.key,
		  		type: 'line',
		  		yAxisIndex: 1,
                // areaStyle: {
                //     normal: {}
                // }
		  	};

	  		var heat = [];
	  		var index = [];

            // if(method == 1) {
            //     var indexOfSource = sourceRange.indexOf(cur.key);
            //     legend.push(sourceName[indexOfSource] + '(H)');
            //     legend.push(sourceName[indexOfSource] + '(I)');
            // } else {
            //     legend.push(cur.key + '(H)');
            //     legend.push(cur.key + '(I)');
            // }
            legend.push('H-'+cur.key);
            legend.push('I-'+cur.key);

	  		cur.value.entry.forEach(function(data) {
	  			heat.push(data.value[0]);
	  			index.push(data.value[1]);

	  			if(catFlag) {
	  				category.push(data.key);
	  			}
	  		});

	  		if(category.length) {
	  			catFlag = false;
	  		}

	  		serieH.data = heat;
	  		series.push(serieH);

	  		serieI.data = index;
	  		series.push(serieI);
	  	});
  	} else {
  		var serieH = {
	  		name: 'H-'+entry.key,
	  		type: 'line',
	  		yAxisIndex: 0,
            // areaStyle: {
            //     normal: {}
            // }
	  	};
	  	var serieI = {
	  		name: 'I-'+entry.key,
	  		type: 'line',
	  		yAxisIndex: 1,
            // areaStyle: {
            //     normal: {}
            // }
	  	};
        if(method == 1) {
            serieH.name = 'H-'+sourceName[source[0]];
            serieI.name = 'I-'+sourceName[source[0]];
        }

  		var heat = [];
	  	var index = [];

        // if(method == 1) {
        //     var indexOfSource = sourceRange.indexOf(entry.key);
        //     legend.push(sourceName[indexOfSource] + '(H)');
        //     legend.push(sourceName[indexOfSource] + '(I)');
        // } else {
        //     legend.push(entry.key + '(H)');
        //     legend.push(entry.key + '(I)');
        // }
        legend.push('H-'+entry.key);
        legend.push('I-'+entry.key);
        if(method == 1) {
            legend[0] = 'H-'+sourceName[source[0]];
            legend[1] = 'I-'+sourceName[source[0]];
        }

  		entry.value.entry.forEach(function(data) {
	  		heat.push(data.value[0]);
	  		index.push(data.value[1]);
	  		category.push(data.key);
	  	})
	  	serieH.data = heat;
	  	series.push(serieH);

	  	serieI.data = index;
	  	series.push(serieI);
  	}

  	var chartTitle = '';
  	if(method != 1) {
  		chartTitle = sourceName[source[0]];
  	} else {
  		chartTitle = theme[0];
  	}

    // if(jump) {
    //     chartTitle = jumpSource[0];
    //     jump = 0;
    // }

  	// console.log('legend', legend);
  	// console.log('series', series);
  	// console.log('category', category);
 
    lineChart.setOption({
        baseOption: {
            title: {
                text: chartTitle
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
	  			splitNumber: 10
            }, {
                name: '指数(I)',
                type: 'value',
                min: 'auto',
                max: 'auto',
	  			splitNumber: 5
            }],
            series: series
        }
    });
    lineChart.hideLoading();
}

function _renderHistogram(data) {
    //data preprocess
    var entry = data.getStocksResponse.return.entry;
    if(jQuery.isEmptyObject(entry)) {
        return;
    }
    var legend = [];
    var chartData = [];
    //data for one tab 
    var category = [];
    var text = [];
    var price = [];
    var marketValue = [];
    var holdRatio = [];
    var stockPrice = [];
    var fiveIncrease = [];
    //get tab-list/tab-content
    var $tabList = $($('#tab-list')[0]);
    var $tabContent = $($('#tab-content')[0]);
    $tabList.empty();
    $tabContent.empty();
    histogram = [];

    if(Array.isArray(entry)) {
        entry.forEach(function(cur) {
            // if(method == 1) {
            //     var indexOfSource = sourceRange.indexOf(cur.key);
            //     legend.push(sourceName[indexOfSource]);
            // } else {
            //     legend.push(cur.key);
            // }
            legend.push(cur.key);
            if(cur.value) {
                var value = cur.value.slice(0,10);
                value.forEach(function(cur) {
                    var array = cur.array;
                    category.push(array[1]+'('+array[0]+')');
                    text.push(array[2]);
                    price.push(array[3]);
                    marketValue.push(array[4]);
                    holdRatio.push(array[5]);
                    stockPrice.push(array[6]);
                    fiveIncrease.push(array[7]);
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
    } else {
        // if(method == 1) {
        //     var indexOfSource = sourceRange.indexOf(entry.key);
        //     legend.push(sourceName[indexOfSource]);
        // } else {
        //     legend.push(entry.key);
        // }
        legend.push(entry.key);
        if(method == 1) {
            legend[0] = sourceName[source[0]];
        }

        if(entry.value) {
            var value = entry.value.slice(0,10);
            value.forEach(function(cur) {
                var array = cur.array;
                category.push(array[1]+'('+array[0]+')');
                text.push(array[2]);
                price.push(array[3]);
            });

            chartData.push({
                category: category,
                data: [text,price,marketValue,holdRatio,stockPrice,fiveIncrease]
            });
        } else {
            //add a empty obj
            chartData.push({});
        }
    }

    console.log('chartData', chartData);

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

        var isEmpty = jQuery.isEmptyObject(chartData[0]);
        if(chartData.length && !isEmpty) {
            var l = chartIndex.length;
            //render charts
            for(var n = 0; n < l; ++n) {
                if(n%2) {
                    _renderRightHistogram(chartData[i].category,chartData[i].data[n],chartIndex[n],chartColor[n%2],id);
                    echarts.connect([histogram[n-1+l*i], histogram[n+l*i]]);
                    console.log(n-1+l*i, n+l*i);
                } else {
                    _renderLeftHistogram(chartData[i].category,chartData[i].data[n],chartIndex[n],chartColor[n%2],id);
                }
            }
        } else {
            //show message
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
        var echart = echarts.init(relChart[0], 'macarons');
        histogram.push(echart);
        //set echart option
        echart.setOption({
            tooltip : {
                trigger: 'axis',
                axisPointer : {           
                    type : 'shadow'   
                }
            },
            grid: {
                containLabel: true
            },
            color: [color],
            legend: {
                data: [index]
            },
            xAxis:  {
                type: 'value',
                position:'top',
                // inverse: true
            },
            yAxis: {
                type: 'category',
                data: category,
                position: 'left',
                inverse: true
            },
            series: [
                {
                    name: index,
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
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
        var echart = echarts.init(relChart[0], 'macarons');
        histogram.push(echart);
        //set echart option
        echart.setOption({
            tooltip : {
                trigger: 'axis',
                axisPointer : {           
                    type : 'shadow'   
                }
            },
            grid: {
                containLabel: true
            },
            legend: {
                data: [index]
            },
            xAxis:  {
                type: 'value',
                position:'top'
            },
            yAxis: {
                type: 'category',
                data: category,
                position: 'left',
                inverse: true,
                axisLabel: {
                    show: false,
                    inside: true
                }
            },
            color: [color],
            series: [
                {
                    name: index,
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
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

function onStar(that) {
    var $btn = $(that);
    $btn.toggleClass('collect');

    //add event to collection
    //to do
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