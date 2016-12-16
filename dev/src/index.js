var URL_VISIT = '/crosspost?id=18';
var URL_ALLCONCEPTS = '/cross?id=23';
var curPage = 1;
var LASTPAGE = 8;

$(document).ready(function() {
    $.ajax({
        url: URL_ALLCONCEPTS,
        type: 'GET',
        async: true,
        dataType: 'json',
        success: (data) => {
            var d = JSON.parse(data);
            d = JSON.parse(d);

            if(d && d.length) {
                //render line chart
                _renderDatalist(d);
            } else {
                //show message
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
    $('#topcontrol').click(function(e) {
        e.preventDefault();
        // console.log('go top');
        curPage = 1;
        
        $('section').css('transform','translateY(0%)');
        $('footer').css('transform','translateY('+$(window).height()+'px)');
        $('#topcontrol').css({'opacity':0,'z-index':999});
    });
    // $(window).on('resize', function() {
    //     $('section').height($(window).height());
    // });
    /* ======= Fixed header when scrolled ======= */   
    $(window).on('load resize', function() {
        $('footer').css('transform','translateY('+$(window).height()+'px)');
    }); 
    toggleBind();

    $('#searchKeyword').on('input propertychange', function(e) {
    	var input = $(this)[0];

    	if($(input).val()) {
    		$('#goBtn').attr('disabled', false);
    	} else {
    		$('#goBtn').attr('disabled', true);
    	}
    });

    var postData = {
        target: 'index',
        userId: 'undefined'
    };
    if(window.user) {
        var loginfo = window.user.replace(/&quot;/g,'"');
        loginfo = JSON.parse(loginfo);
        var userName = loginfo.username;
        delete window.user;
        console.log('user', loginfo);
        postData.userId = userName;
        // $.extend({
        //     userId: userName,  
        // }, postData);
    }
    $.ajax({
        url: URL_VISIT,
        method: 'POST',
        data: postData,
        // contentType: 'application/json',
        dataType: 'json',
        success: (data) => {
            var d = JSON.parse(data);
            d = JSON.parse(d);

            console.log('log', d.flag);
        },
        error: (err) => {
            console.log(err);
        }
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
function toggleBind() {
    if (document.onmousewheel) {
        if (document.removeEventListener) {
            document.removeEventListener('DOMMouseScroll', sectionOnScroll);
        }
        document.onmousewheel = null;
    }
    else {
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', sectionOnScroll, false);
        }
        document.onmousewheel = sectionOnScroll;
    }
}

function sectionOnScroll(e) {
    fixBind();

    if(e.type === 'mousewheel') {
        // scroll down
        if(e.deltaY > 0) {
            if(curPage == LASTPAGE) {
                return;
            }
            if(curPage == (LASTPAGE-1)) {
                var windowHeight = $(window).height();
                var footerHeight = $('footer').height();
                var delta = windowHeight - footerHeight;
                setTimeout(function() {
                    $('section[class*=section-' + curPage++ + ']').css('transform','translateY(-'+footerHeight+'px)');
                    $('footer').css('transform','translateY('+delta+'px)');
                    if(curPage > 1) {
                        $('#topcontrol').css({'opacity':1,'z-index':999});
                    }else{
                        $('#topcontrol').css({'opacity':0});
                    }
                }, 600);
                
                return;
            }
            setTimeout(function() {
                $('section[class*=section-' + curPage++ + ']').css('transform','translateY(-100%)');
                if(curPage > 1) {
                    $('#topcontrol').css({'opacity':1,'z-index':999});
                }else{
                        $('#topcontrol').css({'opacity':0});
                }
            }, 600);
        }
        // scroll up
        if(e.deltaY < 0) {
            if(curPage == 1) {
                return;
            }
            if(curPage == LASTPAGE) {
                var windowHeight = $(window).height();
                // var footerHeight = $('footer').height();
                // var delta = windowHeight - footerHeight;
                setTimeout(function() {
                    $('section[class*=section-' + --curPage + ']').css('transform','translateY(0%)');
                    $('footer').css('transform','translateY('+windowHeight+'px)');
                    if(curPage > 1) {
                        $('#topcontrol').css({'opacity':1,'z-index':999});
                    }else{
                        $('#topcontrol').css({'opacity':0});
                    }
                }, 600);
                return;
            }
            setTimeout(function() {
                $('section[class*=section-' + --curPage + ']').css('transform','translateY(0%)'); 
                    if(curPage > 1) {
                        $('#topcontrol').css({'opacity':1,'z-index':999});
                    }else{
                        $('#topcontrol').css({'opacity':0});
                    }
            }, 600);           
        }

    }
}

function fixBind() {
    toggleBind();
    setTimeout(function () {
      toggleBind();
    }, 600);
}