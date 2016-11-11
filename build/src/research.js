'use strict';

//global parameters
var searchMap = echarts.init(document.getElementById('searchMap'), 'macarons');
var resBuy = [],
    resSell = [],
    resAll = [];
var resIndus = [],
    resProv = [];
var mapIndex = -1;
var $resultItem = null;
var URL_SURVEY = '/survey.20160929.json';

$(document).ready(function () {
    //ajax get stock list
    $.ajax({
        url: URL_STOCKLIST,
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function success(data) {
            data.stocklist.forEach(function (cur) {
                stocks.push(cur.code + cur.name);
            });
        },
        error: function error(err) {
            console.log(err);
        }
    });

    //search panel
    $('#stockInput').on('input propertychange', function (e) {
        var value = $(this).val();
        if (value) {
            $('#search-clear').show();
        }
    });

    //echarts resize
    $(window).on('resize', function () {
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

    //hover handler:aria-describedby
    // $('[data-toggle="popover"]').hover(function(e) {   
    //     var $tar = $(e.target);
    //     $tar.popover('show');

    // }, function(e) {
    //     var $tar = $(e.target);
    //     var popId = $tar.attr('aria-describedby');
    //     if(popId) {
    //         var pop = $('#'+popId)[0];
    //         var $pop = $(pop);
    //         //set value for target
    //         $resultItem = $tar;

    //         //mouseleave listener for popover
    //         $pop.hover(function(e) {
    //             if($resultItem) {
    //                 if(!$resultItem.hasClass('hover-item-content')) {
    //                     $resultItem.addClass('hover-item-content');
    //                 }
    //             }
    //         }, function(e) {
    //             //get mouse position
    //             var clientX = e.pageX;
    //             var clientY = e.pageY;

    //             if($resultItem) {
    //                 //get $resultItem info
    //                 var width = $resultItem.width();
    //                 var height = $resultItem.height();
    //                 var X = $resultItem.offset().left;
    //                 var Y = $resultItem.offset().top;

    //                 if(clientX > X && clientY > Y && clientX < X + width + 10 && clientY < Y + height) {
    //                 } else {
    //                     $resultItem.removeClass('hover-item-content');
    //                     $resultItem.popover('hide');
    //                     $resultItem = null;
    //                 }
    //             }
    //         });
    //     }
    // });

    //get data
    //default 10days
    $.ajax({
        url: URL_SURVEY,
        method: 'GET',
        dataType: 'json',
        success: function success(data) {
            _renderData(data);
        },
        error: function error(err) {
            console.log(err);
        }
    });
});

function clearSearch(that) {
    $('#stockInput').val('');
    $(that).hide();
    _hideStockList();
}

function customOpStock(li) {
    if (!li) {
        return;
    }

    var $li = $(li);
    var code = $li.find('span[class*="item-1"]').text();
    var name = $li.find('span[class*="item-2"]').text();
    $('#stockInput').val('');
    console.log(code, name);
    //ajax get data
    //to do later

    $("html, body").animate({ scrollTop: $('section#research-list').offset().top - 100 }, 800);
}

function _renderData(data) {
    console.log(data);
    resBuy = data.all[0].codes;
    resSell = data.all[1].codes;
    resAll = resBuy.concat(resSell);
    resIndus = data.industry;
    resProv = data.province;

    //render industry list
    _renderTheme(resIndus);

    //render map
    _renderMap(searchMap, resProv);

    //render results
    _renderResults(resAll);
}

function onPeriod(that) {
    var $btn = $(that);
    if ($btn.hasClass('btn-invalid')) {
        //clear valid period button
        _clearPeriod();
        //clear valid source button
        //and set default valid button
        _clearSource();
        $('#s0').removeClass('btn-invalid').addClass('btn-valid');
        //clear valid theme button
        _clearTheme();

        $btn.removeClass('btn-invalid').addClass('btn-valid');
        //get json
        //to do later
    }
}

function _clearPeriod() {
    var children = $('#btnPeriod').children('button.btn-valid');
    Array.prototype.forEach.call(children, function (cur) {
        $(cur).removeClass('btn-valid').addClass('btn-invalid');
    });
}

function onSource(that) {
    var $btn = $(that);
    if ($btn.hasClass('btn-invalid')) {
        _clearSource();
        _clearTheme();
        _clearMap(searchMap);
        $btn.removeClass('btn-invalid').addClass('btn-valid');
        //render results
        var renderId = $btn.attr('id')[1];
        switch (renderId) {
            case '0':
                _renderResults(resAll);
                break;
            case '1':
                _renderResults(resBuy);
                break;
            case '2':
                _renderResults(resSell);
                break;
        }
    }
}

function _clearSource() {
    var children = $('#btnSource').children('button.btn-valid');
    Array.prototype.forEach.call(children, function (cur) {
        $(cur).removeClass('btn-valid').addClass('btn-invalid');
    });
}

function _renderTheme(indus) {
    var fragment = document.createDocumentFragment();

    indus.forEach(function (cur, index) {
        var tag = document.createElement('SPAN');
        $(tag).attr('id', 't' + index).addClass('research-tag-invalid').text(cur.indus[0]);
        $(fragment).append(tag);
    });

    $('#btnTheme').append(fragment);
}

function onTheme(that, event) {
    event.stopPropagation();
    event.preventDefault();

    var $target = $(event.target);
    var tagName = event.target.tagName;

    if (tagName === 'SPAN' && $target.hasClass('research-tag-invalid')) {
        _clearTheme();
        _clearSource();
        _clearMap(searchMap);
        $target.removeClass('research-tag-invalid').addClass('research-tag-valid');
        var themeObj = resIndus[$target.attr('id')[1]];
        console.log('themeObj', themeObj);
        //render results
        _renderResults(themeObj);
    }
}

function _clearTheme() {
    var children = $('#btnTheme').children('span.research-tag-valid');
    Array.prototype.forEach.call(children, function (cur) {
        $(cur).removeClass('research-tag-valid').addClass('research-tag-invalid');
    });
}

function _renderResults(data) {

    var $resultList = $('#result-list');

    //clear all of its content
    if ($resultList.children() || $resultList.children().length) {
        $resultList.empty();
    }

    //if data is null
    if (!data) {
        $resultList.append($('<p>没有相关的调研记录</p>'));
        return;
    }

    var res = [],
        num = 0;

    //input parameter is Object:Industry or Province
    if (!Array.isArray(data)) {
        var code = data.code;

        code.forEach(function (code) {
            resAll.forEach(function (cur) {
                if (cur.code[0] === code) {
                    res.push(cur);
                }
            });
        });
    } else {
        res = data;
    }

    res.forEach(function (cur, n) {
        cur.dates.forEach(function (rep, i) {
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
            //create h5
            var h5 = document.createElement('H5');
            $(h5).addClass('research-card-title').text(rep.date[0]);
            $(header).append(h5);
            //create p
            var p = document.createElement('P');
            $(p).addClass('research-card-text').text(cur.name[0] + '(' + cur.code[0] + ')');
            $(header).append(p);
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
            $(span).addClass('item-title').text('调查机构/研究员:');
            $item.append(span);

            rep.affs.forEach(function (aff) {
                //create item content
                var spanContent = document.createElement('SPAN');
                var $spanContent = $(spanContent);
                $spanContent.addClass('item-content').attr('data-toggle', 'popover');
                //hover handler:aria-describedby
                $spanContent.hover(function (e) {
                    var $tar = $(e.target);
                    $tar.popover('show');
                    var popId = $tar.attr('aria-describedby');
                    var pop = $('#' + popId)[0];
                    var oldContent = $(pop).find('div.popover-content')[0];
                    var newContent = document.createElement('PRE');
                    $(newContent).text($(oldContent).text());
                    $(oldContent).text('').append(newContent);
                }, function (e) {
                    var $tar = $(e.target);
                    var popId = $tar.attr('aria-describedby');
                    if (popId) {
                        var pop = $('#' + popId)[0];
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
                        if (clientX > X && clientX < X + width + 10 && (clientY > Y + height || clientY < Y)) {
                            $resultItem.removeClass('hover-item-content');
                            $resultItem.popover('hide');
                            $resultItem = null;
                        }

                        //mouseleave listener for popover
                        $pop.hover(function (e) {
                            if ($resultItem) {
                                if (!$resultItem.hasClass('hover-item-content')) {
                                    $resultItem.addClass('hover-item-content');
                                }
                            }
                        }, function (e) {
                            //get mouse position
                            var clientX = e.pageX;
                            var clientY = e.pageY;

                            if ($resultItem) {
                                //get $resultItem info
                                var width = $resultItem.width();
                                var height = $resultItem.height();
                                var X = $resultItem.offset().left;
                                var Y = $resultItem.offset().top;

                                if (clientX > X && clientY > Y && clientX < X + width + 10 && clientY < Y + height) {} else {
                                    $resultItem.removeClass('hover-item-content');
                                    $resultItem.popover('hide');
                                    $resultItem = null;
                                }
                            }
                        });
                    }
                });
                //set text
                var repAuthor = aff.aff[0] + '/';
                aff.persons.person.forEach(function (per) {
                    repAuthor += per + ' ';
                });
                $spanContent.text(repAuthor);

                //set popover content
                if (aff.persons.report) {
                    //set popover title
                    $spanContent.attr('title', '相关研报:');
                    var repContent = '';
                    aff.persons.report.forEach(function (name) {
                        repContent += name.reportDate + ':' + name.reportName + '\n';
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

    //scroll to result list
    $("html, body").animate({ scrollTop: $('section#research-list').offset().top - 100 }, 800);
}

function _renderMap(chart, data) {

    //filter show data
    var max = 0;
    var showData = data.map(function (cur) {
        max += parseInt(cur.count[0]);
        return {
            name: cur.prov[0],
            value: cur.count[0],
            more: { code: cur.code }
        };
    });

    // configure echart
    chart.showLoading();

    chart.setOption({
        baseOption: {
            tooltip: {
                trigger: 'item'
            },
            visualMap: {
                min: 0,
                max: max,
                splitNumber: 20,
                color: ['#d94e5d', '#50a3ba', '#eac736'],
                textStyle: {
                    color: '#fff'
                },
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
                        borderColor: '#9900ff'
                    }
                },
                data: showData
            }]
        },
        media: []
    });

    //bind click
    chart.on('click', function (params) {
        console.log(params);

        var newMapIndex = params.dataIndex;

        if (newMapIndex != mapIndex) {
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

            if (params.data) {
                _renderResults(params.data.more);
            } else {
                _renderResults();
            }
        }
    });

    chart.hideLoading();
}

function _clearMap(chart) {
    if (mapIndex != -1) {
        chart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: mapIndex
        });
        mapIndex = -1;
    }
}