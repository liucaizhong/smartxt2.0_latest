var URL_VISIT = '/crosspost?id=18';
var URL_ALLCONCEPTS = '/cross?id=23';

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
    /* ======= Fixed header when scrolled ======= */    
    $(window).on('scroll load', function() {
         
         if ($(window).scrollTop() > 0) {
             $('#header').addClass('scrolled');
         }
         else {
             $('#header').removeClass('scrolled');         
         }
    });

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