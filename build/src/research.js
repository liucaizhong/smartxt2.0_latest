"use strict";function clearSearch(e){$("#stockInput").val(""),$(e).hide(),_hideStockList(),_renderData(0)}function customOpStock(e){if(e){var t=$(e),a=t.find('span[class*="item-1"]').text();t.find('span[class*="item-2"]').text();$("#stockInput").val(""),$("#search-clear").hide(),$(".auto-refresh input")[0].checked=!1,_clearSource(),_clearTheme(),_clearMap(searchMap),$(".focus-loading").show();var r=URL_SURVEY+"userId="+loginfo.username+"&period=10&keyword="+a+"&selfStocksOnly=0";$.ajax({url:r,method:"GET",dataType:"json",success:function(e){var t=JSON.parse(e);t=JSON.parse(t),_renderSearchResults(t)},error:function(e){console.log(e)}})}}function _renderData(e){$("div.focus-loading").show(),resBuy[e]&&resBuy[e].length?(_renderTheme(resIndus[e]),_renderMap(searchMap,resProv[e]),_renderResults(resBuy[e])):$.ajax({url:URL_SURVEY_FILE[e],method:"GET",dataType:"json",success:function(t){var a=JSON.parse(t);a=JSON.parse(a),resBuy[e]=a.all[0].codes,resSell[e]=a.all[1].codes,resAll[e]=resBuy[e].concat(resSell[e]),resIndus[e]=a.industry,resProv[e]=a.province,_renderTheme(resIndus[e]),_renderMap(searchMap,resProv[e]),_renderResults(resBuy[e])},error:function(e){console.log(e)}})}function onPeriod(e){var t=$(e);t.hasClass("btn-invalid")&&($(".auto-refresh input")[0].checked=!1,$("#stockInput").val(""),$("#search-clear").hide(),_hideStockList(),_clearPeriod(),_clearSource(),$("#s0").removeClass("btn-invalid").addClass("btn-valid"),_clearTheme(),t.removeClass("btn-invalid").addClass("btn-valid"),curPeriod=t.attr("id").substring(1),_renderData(curPeriod))}function _clearPeriod(){var e=$("#btnPeriod").children("button.btn-valid");Array.prototype.forEach.call(e,function(e){$(e).removeClass("btn-valid").addClass("btn-invalid")})}function onSource(e){var t=$(e);if(t.hasClass("btn-invalid")){$(".auto-refresh input")[0].checked=!1,$("#stockInput").val(""),$("#search-clear").hide(),_hideStockList(),_clearSource(),_clearTheme(),_clearMap(searchMap),t.removeClass("btn-invalid").addClass("btn-valid");var a=t.attr("id")[1];switch(a){case"0":_renderResults(resAll[curPeriod]);break;case"1":_renderResults(resBuy[curPeriod]);break;case"2":_renderResults(resSell[curPeriod])}}}function _clearSource(){var e=$("#btnSource").children("button.btn-valid");Array.prototype.forEach.call(e,function(e){$(e).removeClass("btn-valid").addClass("btn-invalid")})}function _renderTheme(e){var t=$("#btnTheme");(t.children()||t.children().length)&&t.empty();var a=document.createDocumentFragment();e.forEach(function(e,t){var r=document.createElement("LABEL");$(r).attr("id","t"+t).addClass("research-tag-invalid").text(e.indus[0]),$(a).append(r)}),t.append(a)}function onTheme(e,t){t.stopPropagation(),t.preventDefault();var a=$(t.target),r=t.target.tagName;if("LABEL"===r&&a.hasClass("research-tag-invalid")){$(".auto-refresh input")[0].checked=!1,$("#stockInput").val(""),$("#search-clear").hide(),_hideStockList(),_clearTheme(),_clearSource(),_clearMap(searchMap),a.removeClass("research-tag-invalid").addClass("research-tag-valid");var n=resIndus[curPeriod][a.attr("id")[1]];console.log("themeObj",n),_renderResults(n)}}function _clearTheme(){var e=$("#btnTheme").children("label.research-tag-valid");Array.prototype.forEach.call(e,function(e){$(e).removeClass("research-tag-valid").addClass("research-tag-invalid")})}function _renderResults(e){$("html, body").animate({scrollTop:$("section#research-list").offset().top-100},800),$(".focus-loading").css("display")&&"none"===$(".focus-loading").css("display")&&$(".focus-loading").show();var t=$("#result-list");if((t.children()||t.children().length)&&t.empty(),!e)return t.append($('<p style="font-size:2rem;">没有相关的调研记录</p>')),void $("div.focus-loading").hide();var a=[];if(Array.isArray(e))a=e;else{var r=e.code;r.forEach(function(e){resAll[curPeriod].forEach(function(t){t.code[0]===e&&a.push(t)})})}a.forEach(function(e,a){e.dates.forEach(function(a,r){var n=document.createElement("DIV"),s=$(n);s.addClass("col-xs-6").addClass("col-lg-3");var o=document.createElement("DIV"),d=$(o);d.addClass("research-card");var c=document.createElement("DIV");$(c).addClass("card-header");var l=document.createElement("DIV");$(l).addClass("research-left-header");var i=document.createElement("H6");$(i).text(a.affs.length),$(l).append(i),$(c).append(l);var u=document.createElement("DIV");$(u).addClass("research-right-header");var p=document.createElement("H5");$(p).addClass("research-card-title").text(a.date[0]),$(u).append(p);var m=document.createElement("P");$(m).addClass("research-card-text").text(e.name[0]+"("+e.code[0]+")"),$(u).append(m),$(c).append(u),d.append(c);var h=document.createElement("DIV");$(h).addClass("card-content");var f=document.createElement("DIV"),v=$(f);v.addClass("card-item");var I=document.createElement("SPAN");$(I).addClass("item-title").text("调研机构/研究员:"),v.append(I),a.affs.forEach(function(e){var t=document.createElement("SPAN"),a=$(t);a.addClass("item-content").attr("data-toggle","popover"),a.hover(function(e){var t=$(e.target);t.popover("show");var a=t.attr("aria-describedby"),r=$("#"+a)[0],n=$(r).find("div.popover-content")[0],s=document.createElement("PRE");$(s).text($(n).text()),$(n).text("").append(s)},function(e){var t=$(e.target),a=t.attr("aria-describedby");if(a){var r=$("#"+a)[0],n=$(r);$resultItem=t;var s=e.pageX,o=e.pageY,d=$resultItem.width(),c=$resultItem.height(),l=$resultItem.offset().left,i=$resultItem.offset().top;s>l&&s<l+d+10&&(o>i+c||o<i)&&($resultItem.removeClass("hover-item-content"),$resultItem.popover("hide"),$resultItem=null),n.hover(function(e){$resultItem&&($resultItem.hasClass("hover-item-content")||$resultItem.addClass("hover-item-content"))},function(e){var t=e.pageX,a=e.pageY;if($resultItem){var r=$resultItem.width(),n=$resultItem.height(),s=$resultItem.offset().left,o=$resultItem.offset().top;t>s&&a>o&&t<s+r+10&&a<o+n||($resultItem.removeClass("hover-item-content"),$resultItem.popover("hide"),$resultItem=null)}})}});var r=e.aff[0]+"/";if(e.persons.person.forEach(function(e){r+=e+" "}),a.text(r),e.persons.report){a.append($('<i class="fa fa-bookmark" aria-hidden="true" style="color:#F6310D;"></i>')),a.attr("title","相关研报:");var n="";e.persons.report.forEach(function(e){n+=e.reportDate+":\n"+_newLine(e.reportName)+"\n"}),a.attr("data-content",n)}v.append(t)}),$(h).append(f),d.append(h),s.append(o),t.append(n)})}),$(".focus-loading").hide()}function _renderMap(e,t){var a=0,r=t.map(function(e){return a+=parseInt(e.count[0]),{name:e.prov[0],value:e.count[0],more:{code:e.code}}});e.setOption({baseOption:{tooltip:{trigger:"item"},visualMap:{min:0,max:a,splitNumber:20,color:["#D0243E","#F75D5D","#FFB0B0"],show:!1},series:[{name:"报告数",type:"map",map:"china",label:{normal:{show:!0},emphasis:{show:!0}},itemStyle:{emphasis:{}},data:r}]},media:[]}),e.on("click",function(t){console.log(t);var a=t.dataIndex;a!=mapIndex&&(_clearSource(),_clearTheme(),_clearMap(e),mapIndex=a,e.dispatchAction({type:"highlight",seriesIndex:0,dataIndex:mapIndex}),t.data?_renderResults(t.data.more):_renderResults())})}function _clearMap(e){mapIndex!=-1&&(e.dispatchAction({type:"downplay",seriesIndex:0,dataIndex:mapIndex}),mapIndex=-1)}function _renderSearchResults(e){$("html, body").animate({scrollTop:$("section#research-list").offset().top-100},800),$(".focus-loading").show();var t=$("#result-list");return(t.children()||t.children().length)&&t.empty(),e&&e.length?(e.forEach(function(e){var a=document.createElement("DIV"),r=$(a);r.addClass("col-xs-6").addClass("col-lg-3");var n=document.createElement("DIV"),s=$(n);s.addClass("research-card");var o=document.createElement("DIV");$(o).addClass("card-header");var d=document.createElement("DIV");$(d).addClass("research-left-header");var c=document.createElement("H6");$(c).text(e.reportList.length),$(d).append(c),$(o).append(d);var l=document.createElement("DIV");$(l).addClass("research-right-header");var i=document.createElement("H5");$(i).addClass("research-card-title").text(e.dytime),$(l).append(i);var u=document.createElement("P");$(u).addClass("research-card-text").text(e.name+"("+e.code+")"),$(l).append(u),$(o).append(l),s.append(o);var p=document.createElement("DIV");$(p).addClass("card-content");var m=document.createElement("DIV"),h=$(m);h.addClass("card-item");var f=document.createElement("SPAN");$(f).addClass("item-title").text("调研机构/研究员:"),h.append(f),e.reportList.forEach(function(e){var t=document.createElement("SPAN"),a=$(t);a.addClass("item-content").attr("data-toggle","popover"),a.hover(function(e){var t=$(e.target);t.popover("show");var a=t.attr("aria-describedby"),r=$("#"+a)[0],n=$(r).find("div.popover-content")[0],s=document.createElement("PRE");$(s).text($(n).text()),$(n).text("").append(s)},function(e){var t=$(e.target),a=t.attr("aria-describedby");if(a){var r=$("#"+a)[0],n=$(r);$resultItem=t;var s=e.pageX,o=e.pageY,d=$resultItem.width(),c=$resultItem.height(),l=$resultItem.offset().left,i=$resultItem.offset().top;s>l&&s<l+d+10&&(o>i+c||o<i)&&($resultItem.removeClass("hover-item-content"),$resultItem.popover("hide"),$resultItem=null),n.hover(function(e){$resultItem&&($resultItem.hasClass("hover-item-content")||$resultItem.addClass("hover-item-content"))},function(e){var t=e.pageX,a=e.pageY;if($resultItem){var r=$resultItem.width(),n=$resultItem.height(),s=$resultItem.offset().left,o=$resultItem.offset().top;t>s&&a>o&&t<s+r+10&&a<o+n||($resultItem.removeClass("hover-item-content"),$resultItem.popover("hide"),$resultItem=null)}})}});var r=e.aff+"/"+e.analyst;if(a.text(r),!jQuery.isEmptyObject(e.reports[0])){a.append($('<i class="fa fa-bookmark" aria-hidden="true" style="color:#F6310D;"></i>')),a.attr("title","相关研报:");var n="";e.reports.forEach(function(e){n+=e.pubDate+":\n"+_newLine(e.title)+"\n"}),a.attr("data-content",n)}h.append(t)}),$(p).append(m),s.append(p),r.append(n),t.append(a)}),void $(".focus-loading").hide()):(t.append($('<p style="font-size:2rem;">没有相关的调研记录</p>')),void $(".focus-loading").hide())}function _newLine(e){for(var t="",a=0,r=0,n=35,s=-1,o=0;o<e.length;o++)s=e.charCodeAt(o),a+=s>=0&&s<=128?1:2;for(var o=0;o<a;o++){var d=e.charAt(o);r++,escape(d).length>4&&r++,t=t.concat(d),r>=n&&(t=t.concat("\n"),r=0)}return t}var searchMap=echarts.init(document.getElementById("searchMap"),"macarons"),resBuy={},resSell={},resAll={},resIndus={},resProv={},mapIndex=-1,$resultItem=null,URL_SURVEY="/cross?id=21&",URL_SURVEY_FILE=[],loginfo,curPeriod=0,selfStock;$(document).ready(function(){window.user&&(loginfo=window.user.replace(/&quot;/g,'"'),loginfo=JSON.parse(loginfo),delete window.user,URL_SURVEY_FILE[0]=URL_SURVEY+"userId="+loginfo.username+"&period=10&keyword=&selfStocksOnly=0",URL_SURVEY_FILE[1]=URL_SURVEY+"userId="+loginfo.username+"&period=20&keyword=&selfStocksOnly=0",URL_SURVEY_FILE[2]=URL_SURVEY+"userId="+loginfo.username+"&period=30&keyword=&selfStocksOnly=0",_renderData(0)),$(".auto-refresh > input[name=self]").change(function(e){$(".focus-loading").show();var t=URL_SURVEY+"userId="+loginfo.username+"&period=10&keyword=&selfStocksOnly=1";_clearSource(),_clearTheme(),_clearMap(searchMap),$("#stockInput").val(""),$("#search-clear").hide(),_hideStockList(),$(this)[0].checked?$.ajax({url:t,method:"GET",dataType:"json",success:function(e){var t=JSON.parse(e);t=JSON.parse(t),_renderSearchResults(t)},error:function(e){console.log(e)}}):($("#s1").removeClass("btn-invalid").addClass("btn-valid"),_renderData(0))}),$("#stockInput").on("input propertychange",function(e){var t=$(this).val();t&&$("#search-clear").show()}),$(window).on("resize",function(){searchMap.resize()}),$("body").popover({placement:"right",trigger:"manual"})});