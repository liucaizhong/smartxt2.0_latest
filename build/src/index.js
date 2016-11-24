'use strict';

var URL_VISIT = '/crosspost?id=18';
var userName;

$(document).ready(function () {
    /* ======= Fixed header when scrolled ======= */
    $(window).on('scroll load', function () {

        if ($(window).scrollTop() > 0) {
            $('#header').addClass('scrolled');
        } else {
            $('#header').removeClass('scrolled');
        }
    });

    $('#searchKeyword').on('input propertychange', function (e) {
        var input = $(this)[0];

        if ($(input).val()) {
            $('#goBtn').attr('disabled', false);
        } else {
            $('#goBtn').attr('disabled', true);
        }
    });

    if (window.user) {
        var loginfo = window.user.replace(/&quot;/g, '"');
        loginfo = JSON.parse(loginfo);
        userName = loginfo.username;
        delete window.user;
        console.log('user', loginfo);
    }
    $.ajax({
        url: URL_VISIT,
        method: 'POST',
        data: {
            userId: userName,
            target: 'index'
        },
        // contentType: 'application/json',
        dataType: 'json',
        success: function success(data) {
            var d = JSON.parse(data);
            d = JSON.parse(d);

            console.log('log', d.flag);
        },
        error: function error(err) {
            console.log(err);
        }
    });
});

// function customOpStock(li) {

// }