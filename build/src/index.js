"use strict";function _renderDatalist(t){var o=$("#allConcepts");t.forEach(function(t){var e=document.createElement("OPTION");$(e).val(t),o.append(e)})}function toggleBind(){document.onmousewheel?(document.removeEventListener&&document.removeEventListener("DOMMouseScroll",sectionOnScroll),document.onmousewheel=null):(document.addEventListener&&document.addEventListener("DOMMouseScroll",sectionOnScroll,!1),document.onmousewheel=sectionOnScroll)}function sectionOnScroll(t){if(fixBind(),"mousewheel"===t.type||"DOMMouseScroll"===t.type){var o=t.deltaY||-t.wheelDelta||t.detail;if(o>0){if(curPage==LASTPAGE)return;if(curPage==LASTPAGE-1){var e=$(window).height(),n=$("footer").height(),s=e-n;return void setTimeout(function(){$("section[class*=section-"+curPage++ +"]").css("transform","translateY(-"+n+"px)"),$("footer").css("transform","translateY("+s+"px)"),curPage>1?$("#topcontrol").css({opacity:1,"z-index":999}):$("#topcontrol").css({opacity:0})},300)}setTimeout(function(){$("section[class*=section-"+curPage++ +"]").css("transform","translateY(-100%)"),curPage>1?$("#topcontrol").css({opacity:1,"z-index":999}):$("#topcontrol").css({opacity:0})},300)}if(o<0){if(1==curPage)return;if(curPage==LASTPAGE){var e=$(window).height();return void setTimeout(function(){$("section[class*=section-"+--curPage+"]").css("transform","translateY(0%)"),$("footer").css("transform","translateY("+e+"px)"),curPage>1?$("#topcontrol").css({opacity:1,"z-index":999}):$("#topcontrol").css({opacity:0})},300)}setTimeout(function(){$("section[class*=section-"+--curPage+"]").css("transform","translateY(0%)"),curPage>1?$("#topcontrol").css({opacity:1,"z-index":999}):$("#topcontrol").css({opacity:0})},300)}}}function fixBind(){toggleBind(),setTimeout(function(){toggleBind()},600)}function scrollUp(){if(fixBind(),1!=curPage){if(curPage==LASTPAGE){var t=$(window).height();return void setTimeout(function(){$("section[class*=section-"+--curPage+"]").css("transform","translateY(0%)"),$("footer").css("transform","translateY("+t+"px)"),curPage>1?$("#topcontrol").css({opacity:1,"z-index":999}):$("#topcontrol").css({opacity:0})},300)}setTimeout(function(){$("section[class*=section-"+--curPage+"]").css("transform","translateY(0%)"),curPage>1?$("#topcontrol").css({opacity:1,"z-index":999}):$("#topcontrol").css({opacity:0})},300)}}function scrollDown(){if(fixBind(),curPage!=LASTPAGE){if(curPage==LASTPAGE-1){var t=$(window).height(),o=$("footer").height(),e=t-o;return void setTimeout(function(){$("section[class*=section-"+curPage++ +"]").css("transform","translateY(-"+o+"px)"),$("footer").css("transform","translateY("+e+"px)"),curPage>1?$("#topcontrol").css({opacity:1,"z-index":999}):$("#topcontrol").css({opacity:0})},300)}setTimeout(function(){$("section[class*=section-"+curPage++ +"]").css("transform","translateY(-100%)"),curPage>1?$("#topcontrol").css({opacity:1,"z-index":999}):$("#topcontrol").css({opacity:0})},300)}}var URL_VISIT="/crosspost?id=18",URL_ALLCONCEPTS="/cross?id=23",curPage=1,LASTPAGE=8;$(document).ready(function(){$.ajax({url:encodeURI(URL_ALLCONCEPTS),type:"GET",async:!0,cache:!1,success:function(t){var o=JSON.parse(t);o=JSON.parse(o),o&&o.length&&_renderDatalist(o)},error:function(t){console.log(t)}}),$("#topcontrol").click(function(t){t.preventDefault(),curPage=1,$("section").css("transform","translateY(0%)"),$("footer").css("transform","translateY("+$(window).height()+"px)"),$("#topcontrol").css({opacity:0,"z-index":999})}),$(window).on("load resize",function(){$("footer").css("transform","translateY("+$(window).height()+"px)");var t=Math.max($(".banner img").width(),.9*$(this).width()),o=Math.min(.618*t,.5*$(this).height());t=o/.618,$(".banner img").width(t).height(o)}),$(window).resize(),toggleBind(),$("#searchKeyword").on("input propertychange",function(t){var o=$(this)[0];$(o).val()?$("#goBtn").attr("disabled",!1):$("#goBtn").attr("disabled",!0)});var t={target:"index",userId:"undefined"};if(window.user){var o=window.user.replace(/&quot;/g,'"');o=JSON.parse(o);var e=o.username;delete window.user,console.log("user",o),t.userId=e}$.ajax({url:URL_VISIT,method:"POST",data:t,dataType:"json",success:function(t){var o=JSON.parse(t);o=JSON.parse(o),console.log("log",o.flag)},error:function(t){console.log(t)}})});