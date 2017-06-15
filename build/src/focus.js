"use strict";function onForm(e,t){t.stopPropagation();var o=t.target;if("BUTTON"===o.tagName){var a=$(o),n=a.attr("id"),i=!1;switch(n[0]){case"m":if(method!=+n[1])switch(method=+n[1],i=!0,method){case 0:$("#btnPeriod").find('button[class*="btn-valid"]').removeClass("btn-valid").addClass("btn-invalid"),$("#btnPeriod").children().attr("disabled",!0),period=void 0;break;case 1:$("#btnPeriod").find('button[class*="btn-valid"]').removeClass("btn-valid").addClass("btn-invalid"),$("#p0").attr("disabled",!0),$("#p1").attr("disabled",!1).removeClass("btn-invalid").addClass("btn-valid"),$("#p2").attr("disabled",!1),$("#p3").attr("disabled",!1),period=1;break;case 2:$("#btnPeriod").find('button[class*="btn-valid"]').removeClass("btn-valid").addClass("btn-invalid"),$("#p0").attr("disabled",!1),$("#p1").attr("disabled",!1).removeClass("btn-invalid").addClass("btn-valid"),$("#p2").attr("disabled",!1),$("#p3").attr("disabled",!0),period=1}break;case"p":period!=+n[1]&&(period=+n[1],i=!0);break;case"s":source!=+n[1]&&(source=+n[1],i=!0)}if(i){$("footer.footer").hide(),$(".more-button").find("[class*=active]").removeClass("active");var s=a.siblings('button[class*="btn-valid"]');Array.prototype.forEach.call(s,function(e){$(e).removeClass("btn-valid").addClass("btn-invalid")}),a.removeClass("btn-invalid").addClass("btn-valid"),$(".focus-charts>div.container").empty(),_renderConceptList()}}}function _renderConceptList(){$("div.focus-loading").show();var e;e=method?methodRange[method]+periodRange[period]:methodRange[method];var t=CONCEPTURL+"userId="+loginfo.username+"&source="+sourceRange[source]+"&type="+e;$.ajax({url:encodeURI(t),type:"GET",async:!0,cache:!1,success:function(e){var t=JSON.parse(e);t.length?(conceptList=t,_renderCharts(conceptList.splice(0,CHARTNUM))):($("div.focus-loading").hide(),$(".focus-charts>div.container").empty().html('<div style="font-size:2rem">未找到相关记录</div>'))},error:function(e){console.log(e)}})}function _renderCharts(e){var t=conceptIndicator;conceptIndicator++,e.forEach(function(e,o){var a=HEATURL+"userId="+loginfo.username+"&concepts="+e+"&sources="+source;$.ajax({url:encodeURI(a),type:"GET",async:!1,cache:!1,success:function(e){var a=JSON.parse(e);if(-1!==a[0].flag){var n=a[1],i=[],s=[],r=[],d=[],l=[],c={name:n.concept+" H",type:"line",yAxisIndex:0,itemStyle:{normal:{areaStyle:{type:"default",color:"rgba(239,243,246,.6)"},color:"rgb(50,70,90)"}},symbol:"none"},p={name:n.concept+" I",type:"line",yAxisIndex:1,itemStyle:{normal:{areaStyle:{type:"default",color:"rgba(250,225,222,.6)"},color:"rgb(235,85,30)"}},symbol:"none"};i.push({name:n.concept+" H",icon:"line"}),i.push({name:n.concept+" I",icon:"line"}),n.heat.forEach(function(e){d.push(e.heat),l.push(e.index),s.push(e.date)}),c.data=d,r.push(c),p.data=l,r.push(p);var h=document.createElement("div"),u="c"+(t*CHARTNUM+o);$(h).attr("id",u).addClass("focus-chart").attr("data-word",n.concept),$(h).attr("onclick","onJumpTheme(this)"),$(".focus-charts>div.container").append(h);var b=echarts.init(document.getElementById(u));b.setOption({baseOption:{title:{},tooltip:{trigger:"axis"},dataZoom:[{handleColor:"rgb(75,188,208)",fillerColor:"rgb(75,188,208)",borderWidth:0,show:!1,realtime:!0,start:75.5,end:100,height:15},{type:"inside",start:5,end:25}],legend:{data:i},xAxis:{type:"category",data:s,axisTick:!1,splitLine:{show:!1},axisLine:{show:!0,lineStyle:{type:"solid",width:1,color:"rgb(75,188,208)"}},boundaryGap:!1,axisLabel:{textStyle:{fontFamily:"微软雅黑",fontSize:12,color:"black"},show:!0}},yAxis:[{name:"关注度(H)",type:"value",splitNumber:7,splitLine:{show:!0,lineStyle:{type:"dashed",width:1}},nameTextStyle:{fontFamily:"微软雅黑",fontSize:12,color:"black"},axisLine:{show:!0,lineStyle:{type:"solid",width:1,color:"rgb(75,188,208)"}},axisLabel:{textStyle:{fontFamily:"微软雅黑",fontSize:12,color:"black"},show:!0}},{name:"指数(I)",type:"value",splitNumber:7,splitLine:{show:!1,lineStyle:{type:"dashed",width:1}},nameTextStyle:{fontFamily:"微软雅黑",fontSize:12,color:"black"},axisLine:{show:!0,lineStyle:{type:"solid",width:1,color:"rgb(75,188,208)"}},axisLabel:{textStyle:{fontFamily:"微软雅黑",fontSize:12,color:"black"},show:!0}}],series:r}}),charts.push(b)}},error:function(e){console.log(e)}})}),e.length<CHARTNUM?($(".btn-more").removeClass("active"),$("footer.footer").show()):$(".btn-more").hasClass("active")?$(".btn-more").text("浏览更多"):$(".btn-more").addClass("active"),$("div.focus-loading").hide()}function onJumpTheme(e){var t=$(e).attr("data-word"),o="/theme?keyword="+encodeURIComponent(escape(t));window.open(o,"_blank")}var method=0,methodRange=["auto","h","i"],period,periodRange=["1","5","10","20"],source=2,sourceRange=[0,1,2,3],sourceName=["*","guba","(report OR announce)","news"],sourceShowName=["投资者总体","散户群体","从业人群","新闻媒体"],CONCEPTURL="/cross?id=6&",conceptList=[],conceptIndicator=0,CHARTNUM=4,HEATURL="/cross?id=0&",charts=[],loginfo;$(document).ready(function(){$(window).on("resize",function(){charts.forEach(function(e){e.resize()})}),window.user&&(loginfo=window.user.replace(/&quot;/g,'"'),loginfo=JSON.parse(loginfo),delete window.user,$("footer.footer").hide(),_renderConceptList()),$(window).scroll(function(){$(window).scrollTop()+$(window).height()==$(document).height()&&($(".btn-more").text("正在加载"),$("div.focus-loading").show(),setTimeout(function(){_renderCharts(conceptList.splice(0,CHARTNUM))},500))})});