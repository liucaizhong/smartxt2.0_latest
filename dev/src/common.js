//http://139.196.18.233:8087/smartxtAPI/getStockMap
var URL_STOCKLIST = '/cross?id=11';
var stocks = [];
var LISTMAX = 10;
var listTop = 0, listLeft = 0, listWidth = 0, listHeight = 0;
var stockHover = 0;

$(document).ready(() => {
// for use in the future
//     // load i18n at first
//     var lang = navigator.language;
//     var path = '/i18n/';
//     switch (lang) {
//         case 'zh-CN':
//         case 'en':
//             $.ajax({
//                 url: path + lang + '.json',
//                 async: false,
//                 success: (data) => {
//                     i18n.translator.add(data);
//                 },
//                 error: (err) => {
//                     console.log(err);
//                 }
//             });
//             break;
//         default:
//             $.ajax({
//                 url: path + 'zh-CN.json',
//                 async: false,
//                 success: (data) => {
//                     i18n.translator.add(data);
//                 },
//                 error: (err) => {
//                     console.log(err);
//                 }
//             });
//     };

    /* ======= Twitter Bootstrap hover dropdown ======= */
    /* Ref: https://github.com/CWSpear/bootstrap-hover-dropdown */
    /* apply dropdownHover to all elements with the data-hover="dropdown" attribute */

    // $('[data-hover="dropdown"]').dropdownHover();

    /* ======= jQuery Placeholder ======= */
    /* Ref: https://github.com/mathiasbynens/jquery-placeholder */

    $(window).resize(function(e) {
        if($(this).width() > 991) {
            var $mainNav = $('#main-nav');
            if($mainNav.hasClass('my-navbar'))
                $mainNav.removeClass('my-navbar');
        }
    });

    $('input, textarea').placeholder();

    // hover show QRcode for weixin
    // apple to do .....
    $('.weixin').hover(function(e) {
        // console.log(e);
        var top = e.pageY - 200;
        var left = e.pageX - 80;
        var qrCode = document.createElement('IMG');
        qrCode.id = 'weixin-qr';
        qrCode.src = '../img/icon/weixin.jpg';
        $(qrCode).css({
            'display':'block',
            'position': 'absolute',
            'top': top,
            'left': left,
            'z-index': 999
        });

        $('body').append(qrCode);
    }, function(e) {
        $('img').remove('#weixin-qr');
    });

    $('.apple').hover(function(e) {
        // console.log(e);
        var top = e.pageY - 200;
        var left = e.pageX - 80;
        var qrCode = document.createElement('IMG');
        qrCode.id = 'apple-qr';
        qrCode.src = '../img/icon/apple.png';
        $(qrCode).css({
            'display':'block',
            'position': 'absolute',
            'top': top,
            'left': left,
            'z-index': 999
        });

        $('body').append(qrCode);
    }, function(e) {
        $('img').remove('#apple-qr');
    });

    //hover event
    $('[data-hover="dropdown"]').hover(function(e) {
        // console.log('hover start!');
        var $this = $(this);
        $this.find('div.dropdown-menu').css('display', 'block');
    }, function(e) {
        // console.log('hover stop!');
        var $this = $(this);
        var div = $this.find('div')[0];
        var num = $(div).children().length + 1;
        var top = $this.offset().top;
        var left = $this.offset().left;
        var width = left + 100;
        var height = top + num*60;
        var clientX = e.pageX;
        var clientY = e.pageY;

        if(clientX <= left || clientX >= width || clientY <= top || clientY >= height) {
            $this.find('div.dropdown-menu').css('display', 'none');
        }
    });

    //stock list
    //ajax get stock list
    $.ajax({
        url: encodeURI(URL_STOCKLIST),
        type: 'GET',
        async: true,
        cache: false,
        // dataType: 'json',
        success: (data) => {
            var d = JSON.parse(data);

            d.forEach(function(cur) {
                stocks.push(cur.code+cur.name);
            });
            _renderIndexStocklist(d);
        },
        error: (err) => {
            console.log(err);
        }
    });

    //search panel
    $('#stockInput').on('input propertychange', function(e) {
        var value = $(this).val();
        if($(this).hasClass('error'))
            $(this).removeClass('error');
        if(!value) {
            _hideStockList();
            return;
        }
        var len = value.length;
        var reg = new RegExp(value,'ig');
        var indicator = 0;
        var stockUl = $('ul[class*="stock-ul"')[0];
        var $stockUl = $(stockUl);
        if($stockUl.children()) {
            $stockUl.empty();
        }

        stocks.every(function(cur) {
            var i = cur.search(reg);
            if(i != -1) {
                if(i < 6 && i + len <= 6) {
                    var item1 = $('<span class="item-1"></span>');
                    var str = cur.substring(0,i) + '<strong>' + cur.substr(i,len) + '</strong>';
                    str += cur.substring(len+i, 6);
                    $(item1).html(str);

                    var item2 = $('<span class="item-2"></span>').text(cur.slice(6));
                    var div = $('<div></div>').attr('rel', indicator);
                    $(div).append(item1).append(item2);

                    var li = $('<li></li>').append(div);
                    if(!indicator) {
                        $(li).addClass('stock-li-hover');
                    }
                    _addHandlerToLI(li);

                    $stockUl.append(li);

                    ++indicator;
                }

                if(i >= 6) {
                    var item1 = $('<span class="item-1"></span>').text(cur.substring(0,6));

                    var item2 = $('<span class="item-2"></span>');
                    var str = cur.substring(6,i) + '<strong>' + cur.substr(i,len) + '</strong>';
                    str += cur.slice(len+i);
                    $(item2).html(str);

                    var div = $('<div></div>').attr('rel', indicator);
                    $(div).append(item1).append(item2);

                    var li = $('<li></li>').append(div);
                    if(!indicator) {
                        $(li).addClass('stock-li-hover');
                    }
                    _addHandlerToLI(li);

                    $stockUl.append(li);

                    ++indicator;
                }

                if(indicator >= LISTMAX) {
                    _showStockList();
                    return false;
                }
            }

            return true;
        });

        if(indicator > 0) {
            _showStockList();
        } else {
            $stockUl.append($('<li class="stock-not-found">未找到符合条件的结果</li>'));
            if(!$(this).hasClass('error'))
                $(this).addClass('error');
            _showStockList();
        }
    });
    $('#stockInput').focus(function(event) {
        if($(this).val()) {
            // _showStockList();
            $(this).trigger('input');
        }
    });
    $(window).click(function(event) {

        var clientX = event.pageX;
        var clientY = event.pageY;

        // console.log(listTop,listLeft,listWidth,listHeight);

        if($('#stockInput:focus').length == 0) {
            if(listTop && listLeft && listWidth && listHeight) {
                if(clientX <= listLeft || clientX >= listLeft+listWidth || clientY <= listTop || clientY >= listTop+listHeight) {
                    _hideStockList();
                }
            }
        }
    });
    $('#stockInput').keydown(function(e) {

        var keycode = e.keyCode;
        // console.log('keycode',keycode);
        var curLI = $('li[class*="stock-li-hover"]')[0];
        var rel = +$(curLI).find('div').attr('rel');
        var len = $('#stockList li').children().length;

        switch(keycode) {
            case 13:
                e.preventDefault();
                $(this).blur();
                _hideStockList();
                customOpStock(curLI);
                break;
            case 38:
                e.preventDefault();
                if(rel != 0 && (rel-1) >= 0) {
                    $('#stockList>ul li:nth-child('+ (rel+1) + ')').removeClass('stock-li-hover');
                    $('#stockList>ul li:nth-child('+ (rel) + ')').addClass('stock-li-hover');
                }
                break;
            case 40:
                e.preventDefault();
                if(rel != 9 && (rel+1) < len) {
                    $('#stockList>ul li:nth-child('+ (rel+1) + ')').removeClass('stock-li-hover');
                    $('#stockList>ul li:nth-child('+ (rel+2) + ')').addClass('stock-li-hover');
                }
                break;
        }
    });
});

//load highlight function to jQuery
$.fn.extend({
    highlight: function(keyword, config) {
        if (typeof(keyword) == 'undefined') return;
        var config = $.extend({
            insensitive: true,
            hlClass: 'highlight',
            clearLast: true
        }, config);
        if (config.clearLast) {
            $(this).find("strong." + config.hlClass).each(function() {
                $(this).after($(this).text());
                $(this).remove();
            })
        }
        return this.each((index, element) => {
            $(element).highregx(keyword, config);
        });
    },
    highregx: function(query, config) {
        query = this.unicode(query);
        var regex = new RegExp("(<[^>]*>)|(" + query + ")", config.insensitive ? "ig" : "g");
        this.html(this.html().replace(regex, function(a, b, c) {
            return (a.charAt(0) == "<") ? a : "<strong class=\"" + config.hlClass + "\">" + c + "</strong>";
        }));
    },
    unicode: function(s) {
        var rs = '';
        s = s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        for (let i = 0; i < s.length; i++) {
            // console.log('rs:',rs);
            if (s.charCodeAt(i) > 255)
                rs += "\\u" + s.charCodeAt(i).toString(16);
            else
                rs += s.charAt(i);
        }
        return rs;
    }
});

//implement standard post
$.extend({
    StandardPost:function(url,args){
        var body = document.body,
            form = $("<form method='post'></form>")[0],
            input;
        $(form).attr({'action':url}).css('display', 'none');
        $.each(args,function(key,value){
            input = $("<input type='hidden'>");
            input.attr({"name":key});
            input.val(value);
            $(form).append(input);
        });

        body.appendChild(form);
        form.submit();
        body.removeChild(form);
    }
});

//stock list

function clearSearch(that) {
    $('#stockInput').val('');
    $(that).hide();
    _hideStockList();
}

function _showStockList() {
    var stockList = $('#stockList')[0];
    $(stockList).show();
    listTop = stockList.offsetTop;
    listLeft = stockList.offsetLeft;
    listWidth = stockList.offsetWidth;
    listHeight = stockList.offsetHeight;

    // console.dir(stockList);
    // console.log(listTop, listLeft, listWidth, listHeight);
}

function _hideStockList() {
    $('#stockList').hide();
    listTop = 0;
    listLeft = 0;
    listWidth = 0;
    listHeight = 0;
}

function _addHandlerToLI(li) {
    $(li).click(function(e) {
        _hideStockList();
        customOpStock(this);
    }).hover(function(e) {
        $(this).siblings('li[class*="stock-li-hover"]').removeClass('stock-li-hover');
        if(!$(this).hasClass('stock-li-hover')) {
            $(this).addClass('stock-li-hover');
        }
        stockHover = $(this).find('div').attr('rel');
        // console.log('stockHover', stockHover);
    }, function(e) {
        var clientX = e.pageX;
        var clientY = e.pageY;

        if(listTop && listLeft && listWidth && listHeight) {
            if(clientX <= listLeft || clientX >= listLeft+listWidth || clientY <= listTop || clientY >= listTop+listHeight) {
            }else {
                if($(this).hasClass('stock-li-hover')) {
                    $(this).removeClass('stock-li-hover');
                }
            }
        }
    });
}

function expandNavbar(e, f) {
    e.preventDefault();

    var $mainNav = $('#main-nav');

    if(f)
        $mainNav.addClass('my-index-navbar');
    else
        $mainNav.addClass('my-navbar');
}

function _renderIndexStocklist(d) {
    var all = $('#allConcepts');
    d.forEach(function(cur) {
        var option = document.createElement('OPTION');
        $(option).val(cur.name).text('股票代码：'+cur.code);
        all.append(option);
    });
}
