"use strict";$(function(){var t=function(t,e){this.el=t||{},this.multiple=e||!1;var i=this.el.find(".link");i.on("click",{el:this.el,multiple:this.multiple},this.dropdown)};t.prototype.dropdown=function(t){var e=t.data.el,i=$(this),a=i.next();if(a.slideToggle(),i.parent().toggleClass("open"),a.length)var n=a.find(".active").attr("data-ref");else var n="#"+i.attr("data-rel");var l=$(n);l.siblings().hide(),l.fadeIn(700),t.data.multiple||(e.find(".submenu").not(a).slideUp(),e.find(".link").not(i).parent().removeClass("open"))};new t($("#accordion"),(!1));$(".submenu a").click(function(t){var e=$(this);e.addClass("active"),e.parent().siblings().children().removeClass("active");var i=e.attr("data-ref"),a=$(i);a.siblings().hide(),a.show()}),$(".help-section a").click(function(t){var e=$(this),i=e.attr("data-rel"),a=$('a[data-ref="'+i+'"]').parent();e.attr("data-level")||a.parent().siblings().click(),a.children().click()}),$(window).scroll(function(t){var e=document.body.scrollTop;$(".help-menu").animate({top:e+80},50)})});