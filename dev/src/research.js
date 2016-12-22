//global parameters
var searchMap = echarts.init(document.getElementById('searchMap'), 'macarons');
var resBuy = {}, resSell = {}, resAll = {};
var resIndus = {}, resProv = {};
var mapIndex = -1;
var $resultItem = null;
var URL_SURVEY = '/cross?id=21&';
var URL_SURVEY_FILE = [];
var loginfo;
// var selfChoice = false;
var curPeriod = 0;
var selfStock;

$(document).ready(() => {
    if(window.user) {
        loginfo = window.user.replace(/&quot;/g,'"');
        loginfo = JSON.parse(loginfo);
        delete window.user;

        URL_SURVEY_FILE[0] = URL_SURVEY + 'userId=' + loginfo.username + '&period=10&keyword=&selfStocksOnly=0';
        URL_SURVEY_FILE[1] = URL_SURVEY + 'userId=' + loginfo.username + '&period=20&keyword=&selfStocksOnly=0';
        URL_SURVEY_FILE[2] = URL_SURVEY + 'userId=' + loginfo.username + '&period=30&keyword=&selfStocksOnly=0';
        //get data
        //default 10days
        _renderData(0);
    }
    $('.auto-refresh > input[name=self]').change(function(e) {
        $('.focus-loading').show();
        // selfChoice = !selfChoice;
        var loadUrl = URL_SURVEY + 'userId=' + loginfo.username + '&period=10&keyword=&selfStocksOnly=1'; 

        _clearSource();
        _clearTheme();
        _clearMap(searchMap);
        $('#stockInput').val('');
        $('#search-clear').hide();
        _hideStockList();
        if($(this)[0].checked) {
            $.ajax({
                url: loadUrl,
                method: 'GET',
                dataType: 'json',
                success: (data) => {
                    var d = JSON.parse(data);
                    d = JSON.parse(d);

                    _renderSearchResults(d);
                },
                error: (err) => {
                    console.log(err);
                }
            });
        }else {
            $('#s1').removeClass('btn-invalid').addClass('btn-valid');
            _renderData(0);
        }
    });
    //search panel
    $('#stockInput').on('input propertychange', function(e) {
        var value = $(this).val();
        if(value) {
            $('#search-clear').show();
        }
    });
    
    //echarts resize
    $(window).on('resize', () => {
        searchMap.resize();
    });

    //initialize popover
    $('body').popover({
        placement: 'right',
        trigger: 'manual'
        // delay: {hide: '5000000'}
        // selector: '[data-toggle="popover"]'
        // template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-title"></h3><pre class="popover-content"></pre></div>'
    });

});

function clearSearch(that) {
    $('#stockInput').val('');
    $(that).hide();
    _hideStockList();

    //get data
    //default 10days
    _renderData(0);
}

function customOpStock(li) {
    if(!li) {
        return;
    }

    var $li = $(li);
    var code = $li.find('span[class*="item-1"]').text();
    var name = $li.find('span[class*="item-2"]').text();
    $('#stockInput').val('');
    $('#search-clear').hide();
    $('.auto-refresh input')[0].checked = false;
    _clearSource();
    _clearTheme();
    _clearMap(searchMap);
    // console.log(code, name);
    // console.log('selfChoice', selfChoice);
    //ajax get data
    //to do later
    $('.focus-loading').show();
    var loadUrl = URL_SURVEY + 'userId=' + loginfo.username + '&period=10&keyword=' + code + '&selfStocksOnly=0'; 

    $.ajax({
        url: loadUrl,
        method: 'GET',
        dataType: 'json',
        success: (data) => {
            var d = JSON.parse(data);
            d = JSON.parse(d);

            _renderSearchResults(d);
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function _renderData(p) {

    $('div.focus-loading').show();
    if(resBuy[p] && resBuy[p].length) {
        //render industry list
        _renderTheme(resIndus[p]);

        //render map
        _renderMap(searchMap,resProv[p]);

        //render results
        _renderResults(resBuy[p]);
    }else {
        $.ajax({
            url: URL_SURVEY_FILE[p],
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                var d = JSON.parse(data);
                d = JSON.parse(d);

                resBuy[p] = d.all[0].codes;
                resSell[p] = d.all[1].codes;
                resAll[p] = resBuy[p].concat(resSell[p]);
                resIndus[p] = d.industry;
                resProv[p] = d.province;

                //render industry list
                _renderTheme(resIndus[p]);

                //render map
                _renderMap(searchMap,resProv[p]);

                //render results
                _renderResults(resBuy[p]);
            },
            error: (err) => {
                console.log(err);
            }
        });
    }
}

function onPeriod(that) {
    var $btn = $(that);
    if($btn.hasClass('btn-invalid')) {
        $('.auto-refresh input')[0].checked = false;
        $('#stockInput').val('');
        $('#search-clear').hide();
        _hideStockList();
        //clear valid period button
        _clearPeriod();
        //clear valid source button
        //and set default valid button
        _clearSource();
        $('#s0').removeClass('btn-invalid').addClass('btn-valid');
        //clear valid theme button
        _clearTheme();

        $btn.removeClass('btn-invalid').addClass('btn-valid');

        curPeriod = $btn.attr('id').substring(1);
        //get json
        //to do later
        _renderData(curPeriod);
    }
}

function _clearPeriod() {
    var children = $('#btnPeriod').children('button.btn-valid');
    Array.prototype.forEach.call(children, function(cur) {
        $(cur).removeClass('btn-valid').addClass('btn-invalid');
    });
}

function onSource(that) {
    var $btn = $(that);
    if($btn.hasClass('btn-invalid')) {
        $('.auto-refresh input')[0].checked = false;
        $('#stockInput').val('');
        $('#search-clear').hide();
        _hideStockList();
        _clearSource();
        _clearTheme();
        _clearMap(searchMap);
        $btn.removeClass('btn-invalid').addClass('btn-valid');
        //render results
        var renderId = $btn.attr('id')[1];
        switch(renderId) {
            case '0': 
                _renderResults(resAll[curPeriod]);
                break;
            case '1': 
                _renderResults(resBuy[curPeriod]);
                break;
            case '2':
                _renderResults(resSell[curPeriod]);
                break;
        }
    }
}

function _clearSource() {
    var children = $('#btnSource').children('button.btn-valid');
    Array.prototype.forEach.call(children, function(cur) {
        $(cur).removeClass('btn-valid').addClass('btn-invalid');
    });
}

function _renderTheme(indus) {
    var $btnTheme = $('#btnTheme');
    //clear all of its content
    if($btnTheme.children() || $btnTheme.children().length) {
        $btnTheme.empty();
    }
    var fragment = document.createDocumentFragment();

    indus.forEach((cur, index) => {
        var tag = document.createElement('LABEL');
        $(tag).attr('id','t'+index).addClass('research-tag-invalid').text(cur.indus[0]);
        $(fragment).append(tag);
    });

    $btnTheme.append(fragment);

}

function onTheme(that, event) {
    event.stopPropagation();
    event.preventDefault();

    var $target = $(event.target);
    var tagName = event.target.tagName;

    if(tagName === 'LABEL' && $target.hasClass('research-tag-invalid')) {
        $('.auto-refresh input')[0].checked = false;
        $('#stockInput').val('');
        $('#search-clear').hide();
        _hideStockList();
        _clearTheme();
        _clearSource();
        _clearMap(searchMap);
        $target.removeClass('research-tag-invalid').addClass('research-tag-valid');
        var themeObj = resIndus[curPeriod][$target.attr('id')[1]];
        console.log('themeObj', themeObj);
        //render results
        _renderResults(themeObj);
    }
}

function _clearTheme() {
    var children = $('#btnTheme').children('label.research-tag-valid');
    Array.prototype.forEach.call(children, function(cur) {
        $(cur).removeClass('research-tag-valid').addClass('research-tag-invalid');
    });
}

function _renderResults(data) {
    //scroll to result list
    $("html, body").animate({scrollTop: $('section#research-list').offset().top - 100}, 800);

    if($('.focus-loading').css('display') && $('.focus-loading').css('display') === 'none') {
        $('.focus-loading').show();
    }
    var $resultList = $('#result-list');

    //clear all of its content
    if($resultList.children() || $resultList.children().length) {
        $resultList.empty();
    }

    //if data is null
    if(!data) {
        $resultList.append($('<p style="font-size:2rem;">没有相关的调研记录</p>'));
        $('div.focus-loading').hide();
        return;
    }

    var res = [], num=0;

    //input parameter is Object:Industry or Province
    if(!Array.isArray(data)) {
        var code = data.code;

        code.forEach((code) => {
            resAll[curPeriod].forEach((cur) => {
                if(cur.code[0] === code) {
                    res.push(cur);
                }
            });
        });
    } else {
        res = data;
    }

	res.forEach((cur, n) => {
            cur.dates.forEach((rep, i)=>{
                    //create element
                    var fragment = document.createElement('DIV');
                    var $fragment = $(fragment);
                    $fragment.addClass('col-xs-6').addClass('col-lg-3');
                    var card = document.createElement('DIV');
                    var $card = $(card);
                    $card.addClass('research-card');
                    //render card header
                    var header = document.createElement('DIV');
                    $(header).addClass('card-header');
                    //create number
                    //rep.affs.length
                    var lDiv = document.createElement('DIV');
                    $(lDiv).addClass('research-left-header');
                    var h6 = document.createElement('H6');
                    $(h6).text(rep.affs.length);
                    $(lDiv).append(h6);
                    $(header).append(lDiv);
                    //create h5
                    var rDiv = document.createElement('DIV');
                    $(rDiv).addClass('research-right-header');
                    var h5 = document.createElement('H5');
                    $(h5).addClass('research-card-title').text(rep.date[0]);
                    $(rDiv).append(h5);
                    //create p
                    var p = document.createElement('P');
                    $(p).addClass('research-card-text').text(cur.name[0] + '(' + cur.code[0] + ')');   
                    $(rDiv).append(p);
                    $(header).append(rDiv);
                    //append header to card
                    $card.append(header);

                    //render card content
                    var content = document.createElement('DIV');
                    $(content).addClass('card-content');
                    //create item
                    var item = document.createElement('DIV');
                    var $item = $(item);
                    $item.addClass('card-item');
                    //create span
                    var span = document.createElement('SPAN');
                    $(span).addClass('item-title').text('调研机构/研究员:');
                    $item.append(span);

                    rep.affs.forEach((aff) => {
                        //create item content
                        var spanContent = document.createElement('SPAN');
                        var $spanContent = $(spanContent);
                        $spanContent.addClass('item-content').attr('data-toggle','popover');
                        //hover handler:aria-describedby
                        $spanContent.hover(function(e) {   
                            var $tar = $(e.target);
                            $tar.popover('show');
                            var popId = $tar.attr('aria-describedby');
                            var pop = $('#'+popId)[0];
                            var oldContent = $(pop).find('div.popover-content')[0];
                            var newContent = document.createElement('PRE');
                            $(newContent).text($(oldContent).text());
                            $(oldContent).text('').append(newContent);

                        }, function(e) {
                            var $tar = $(e.target);
                            var popId = $tar.attr('aria-describedby');
                            if(popId) {
                                var pop = $('#'+popId)[0];
                                var $pop = $(pop);
                                //set value for target
                                $resultItem = $tar;
                                //get mouse position
                                var clientX = e.pageX;
                                var clientY = e.pageY;
                                //get $resultItem info
                                var width = $resultItem.width();
                                var height = $resultItem.height();
                                var X = $resultItem.offset().left;
                                var Y = $resultItem.offset().top;
                                if(clientX > X && clientX < X + width + 10 && (clientY > Y + height || clientY < Y)) {
                                    $resultItem.removeClass('hover-item-content');
                                    $resultItem.popover('hide');
                                    $resultItem = null;
                                }

                                //mouseleave listener for popover
                                $pop.hover(function(e) {
                                    if($resultItem) {
                                        if(!$resultItem.hasClass('hover-item-content')) {
                                            $resultItem.addClass('hover-item-content');
                                        }
                                    }
                                }, function(e) {
                                    //get mouse position
                                    var clientX = e.pageX;
                                    var clientY = e.pageY;

                                    if($resultItem) {
                                        //get $resultItem info
                                        var width = $resultItem.width();
                                        var height = $resultItem.height();
                                        var X = $resultItem.offset().left;
                                        var Y = $resultItem.offset().top;

                                        if(clientX > X && clientY > Y && clientX < X + width + 10 && clientY < Y + height) {
                                        } else {
                                            $resultItem.removeClass('hover-item-content');
                                            $resultItem.popover('hide');
                                            $resultItem = null;
                                        }
                                    }
                                });
                            }
                        });
                        //set text
                        var repAuthor = aff.aff[0]+'/';
                        aff.persons.person.forEach((per) => {
                            repAuthor += per + ' ';
                        });
                        $spanContent.text(repAuthor);

                        //set popover content
                        if(aff.persons.report) {
                            $spanContent.append($('<i class="fa fa-bookmark" aria-hidden="true" style="color:#F6310D;"></i>'));
                            //set popover title
                            $spanContent.attr('title','相关研报:');
                            var repContent = '';
                            aff.persons.report.forEach((name) => {
                                repContent += name.reportDate + ':\n' + _newLine(name.reportName) + '\n';
                            });
                            $spanContent.attr('data-content', repContent);
                        }
                        //append to item
                        $item.append(spanContent);
                    });
                    //append to card content
                    $(content).append(item);
                    //append to card 
                    $card.append(content);
                    //append to fragment
                    $fragment.append(card);
                    //append fragment to DOM
                    $resultList.append(fragment);
            });
	});
    $('.focus-loading').hide();
}

function _renderMap(chart, data) {

    // chart = echarts.init(document.getElementById('searchMap'), 'macarons');
    //filter show data
    var max = 0;
    var showData = data.map((cur) => {
        max += parseInt(cur.count[0]);
        return {
            name: cur.prov[0],
            value: cur.count[0],
            more: {code:cur.code}
        };
    });

    // configure echart
    // chart.showLoading();

    chart.setOption({
        baseOption: {
        	tooltip: {
        		trigger: 'item'
        	},
        	visualMap: {
        		min: 0,
        		max: max,
        		splitNumber: 20,
                color: ['#D0243E', '#F75D5D', '#FFB0B0'],
		        show: false
        	},
        	series: [{
                name: '报告数',
        		type: 'map',
        		map: 'china',
        		label: {
	                normal: {
	                    show: true
	                },
                	emphasis: {
                    	show: true
                	}
            	},
            	itemStyle: {
	                emphasis: {
	                    // borderColor: '#9900ff'
	                }
            	},
            	data: showData
        	}]
        },
        media: []
    });

    //bind click
    chart.on('click', function(params) {
        console.log(params);

        var newMapIndex = params.dataIndex;

        if(newMapIndex != mapIndex) {
            // cancel highlight
            _clearSource();
            _clearTheme();
            _clearMap(chart);
            //highlight area
            mapIndex = newMapIndex;
            chart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: mapIndex
            });

            if(params.data) {
                _renderResults(params.data.more);
            } else {
                _renderResults();
            }
        }
    });

    // chart.hideLoading();
}

function _clearMap(chart) {
    if(mapIndex != -1) {
        chart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: mapIndex
        });
        mapIndex = -1;
    }
}

function _renderSearchResults(data) {
    //scroll to result list
    $("html, body").animate({scrollTop: $('section#research-list').offset().top - 100}, 800);
    $('.focus-loading').show();

    var $resultList = $('#result-list');

    //clear all of its content
    if($resultList.children() || $resultList.children().length) {
        $resultList.empty();
    }

    //if data is null
    if(!data || !data.length) {
        $resultList.append($('<p style="font-size:2rem;">没有相关的调研记录</p>'));
        $('.focus-loading').hide();
        return;
    }

    data.forEach(function(curTab) {
        //create element
        var fragment = document.createElement('DIV');
        var $fragment = $(fragment);
        $fragment.addClass('col-xs-6').addClass('col-lg-3');
        var card = document.createElement('DIV');
        var $card = $(card);
        $card.addClass('research-card');
        //render card header
        var header = document.createElement('DIV');
        $(header).addClass('card-header');
        //rep.affs.length
        var lDiv = document.createElement('DIV');
        $(lDiv).addClass('research-left-header');
        var h6 = document.createElement('H6');
        $(h6).text(curTab.reportList.length);
        $(lDiv).append(h6);
        $(header).append(lDiv);
        //create h5
        var rDiv = document.createElement('DIV');
        $(rDiv).addClass('research-right-header');
        var h5 = document.createElement('H5');
        $(h5).addClass('research-card-title').text(curTab.dytime);
        $(rDiv).append(h5);
        //create p
        var p = document.createElement('P');
        $(p).addClass('research-card-text').text(curTab.name + '(' + curTab.code + ')');
        $(rDiv).append(p);
        $(header).append(rDiv);
        //append header to card
        $card.append(header);

        //render card content
        var content = document.createElement('DIV');
        $(content).addClass('card-content');
        //create item
        var item = document.createElement('DIV');
        var $item = $(item);
        $item.addClass('card-item');
        //create span
        var span = document.createElement('SPAN');
        $(span).addClass('item-title').text('调研机构/研究员:');
        $item.append(span);

        curTab.reportList.forEach(function(curRep) {
            //create item content
            var spanContent = document.createElement('SPAN');
            var $spanContent = $(spanContent);
            $spanContent.addClass('item-content').attr('data-toggle','popover');
            // //hover handler:aria-describedby
            $spanContent.hover(function(e) {   
                var $tar = $(e.target);
                $tar.popover('show');
                var popId = $tar.attr('aria-describedby');
                var pop = $('#'+popId)[0];
                var oldContent = $(pop).find('div.popover-content')[0];
                var newContent = document.createElement('PRE');
                $(newContent).text($(oldContent).text());
                $(oldContent).text('').append(newContent);

            }, function(e) {
                var $tar = $(e.target);
                var popId = $tar.attr('aria-describedby');
                if(popId) {
                    var pop = $('#'+popId)[0];
                    var $pop = $(pop);
                    //set value for target
                    $resultItem = $tar;
                    //get mouse position
                    var clientX = e.pageX;
                    var clientY = e.pageY;
                    //get $resultItem info
                    var width = $resultItem.width();
                    var height = $resultItem.height();
                    var X = $resultItem.offset().left;
                    var Y = $resultItem.offset().top;
                    if(clientX > X && clientX < X + width + 10 && (clientY > Y + height || clientY < Y)) {
                        $resultItem.removeClass('hover-item-content');
                        $resultItem.popover('hide');
                        $resultItem = null;
                    }
                    //mouseleave listener for popover
                    $pop.hover(function(e) {
                        if($resultItem) {
                            if(!$resultItem.hasClass('hover-item-content')) {
                                $resultItem.addClass('hover-item-content');
                            }
                        }
                    }, function(e) {
                        //get mouse position
                        var clientX = e.pageX;
                        var clientY = e.pageY;

                        if($resultItem) {
                            //get $resultItem info
                            var width = $resultItem.width();
                            var height = $resultItem.height();
                            var X = $resultItem.offset().left;
                            var Y = $resultItem.offset().top;

                            if(clientX > X && clientY > Y && clientX < X + width + 10 && clientY < Y + height) {
                            } else {
                                $resultItem.removeClass('hover-item-content');
                                $resultItem.popover('hide');
                                $resultItem = null;
                            }
                        }
                    });
                }
            });

            //set text
            var repAuthor = curRep.aff + '/' + curRep.analyst;
            $spanContent.text(repAuthor);

            //set popover content
            if(!jQuery.isEmptyObject(curRep.reports[0])) {
                $spanContent.append($('<i class="fa fa-bookmark" aria-hidden="true" style="color:#F6310D;"></i>'));
                //set popover title
                $spanContent.attr('title','相关研报:');
                var repContent = '';
                curRep.reports.forEach((name) => {
                    repContent += name.pubDate + ':\n' + _newLine(name.title) + '\n';
                });
                $spanContent.attr('data-content', repContent);
            }
            //append to item
            $item.append(spanContent);
        });

        //append to card content
        $(content).append(item);
        //append to card 
        $card.append(content);
        //append to fragment
        $fragment.append(card);
        //append fragment to DOM
        $resultList.append(fragment);
    });

    $('.focus-loading').hide();
}

function _newLine(str) {

    var strRes = '';
    var str_len = 0, 
        str_length = 0,
        len = 35, 
        charCode = -1;

    for (var i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) str_len += 1;
        else str_len += 2;
    }

    for (var i = 0; i < str_len; i++) {
        var a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            str_length++;
        }
        strRes = strRes.concat(a);
        if (str_length >= len) {
            strRes = strRes.concat('\n');
            str_length = 0; 
        }
    }

    return strRes;
}