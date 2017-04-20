"use strict";function _renderProfileTab(e){$("#userLevel").text(e.rating),$("#realName").text(e.userName),$("#email").text(e.email),$("#userName").text(e.phone),$("#mobile").text(e.phone)}function _renderWordTab(e){var t=$("#wordTableContent");e.forEach(function(e){var o=$('<div class="row table-content">\n                              <div class="col-xs-10 col-lg-10 theme-padding-top">\n                                    <span class="theme-name"></span>\n                              </div>\n                              <div class="col-xs-2 col-lg-2 theme-padding-top">\n                                    <span class="source-name"></span>\n                              </div>\n                          </div>');$(o).find(".theme-name").text(e.concept),$(o).find(".source-name").text(e.status),t.append(o)})}function _renderConceptTab(e){var t=$("#themeTableContent");e.forEach(function(e){var o=e.split("@")[0],n="";e.split("@")[1].split(";").forEach(function(e){n+=sourceRange[+e]+";"}),n=n.substr(0,n.length-1);var a=$('<div class="row table-content">\n                              <div class="col-xs-5 col-lg-5 theme-padding-top" onclick="onCheckTheme(event)">\n                                    <input type="checkbox">\n                                    <span class="theme-name"></span>\n                              </div>\n                              <div class="col-xs-5 col-lg-5 theme-padding-top">\n                                    <span class="source-name"></span>\n                              </div>\n                              <div class="col-xs-1 col-lg-1 span-fork theme-padding-top">\n                                    <i class="fa fa-times" aria-hidden="true" onclick="onDelTheme(this)"></i>\n                              </div>\n                              <div class="col-xs-1 col-lg-1">\n                                <button class="btn btn-primary btn-load" type="button" onclick="onLoadTheme(this)">查看</button>\n                              </div>\n                          </div>');$(a).find(".theme-name").text(o),$(a).find(".source-name").text(n),t.append(a)})}function _renderTopicTab(e){var t=$("#topicTableContent");e.forEach(function(e){var o=e.split("@")[1],n=e.split("@")[0],a=$('<div class="row table-content">\n                              <div class="col-xs-4 col-lg-4 topic-padding-top" onclick="onCheckTopic(event)">\n                                  \t<input type="checkbox">\n                                    <span class="topic-name"></span>\n                              </div>\n                              <div class="col-xs-4 col-lg-4 topic-padding-top">\n                                    <span class="source-name"></span>\n                              </div>\n                              <div class="col-xs-2 col-lg-2 span-fork topic-padding-top">\n                                    <i class="fa fa-times" aria-hidden="true" onclick="onDelTopic(this)"></i>\n                              </div>\n                              <div class="col-xs-2 col-lg-2">\n                                <button class="btn btn-primary btn-load" type="button" onclick="onLoadTopic(this)">查看</button>\n                              </div>\n                          </div>');$(a).find(".topic-name").text(o),$(a).find(".source-name").text(n),t.append(a)})}function onAddStock(e){var t=$("#stockList").find('li[class*="stock-li-hover"]')[0];t&&customOpStock(t)}function customOpStock(e){if(e){var t=$(e),o=t.find('span[class*="item-1"]').text(),n=t.find('span[class*="item-2"]').text();$("#stockInput").val(""),$.ajax({url:URL_ADDSTOCK,method:"POST",data:{userId:loginfo.username,code:o},dataType:"json",success:function(e){var t=JSON.parse(e);t.flag?_insertStock(o,n,!0):_showFadeMsg(t.msg)},error:function(e){console.log(e)}})}}function _renderStockTab(e){e.forEach(function(e){_insertStock(e.code,e.name)})}function _insertStock(e,t,o){var n=$('<div class="row table-content">\n                              <div class="col-xs-8 col-lg-8" onclick="onCheckStock(event)">\n                                    <input type="checkbox">\n                                    <span class="stock-code"></span>\n                                    <span class="stock-name"></span>\n                              </div>\n                              <div class="col-xs-4 col-lg-4 span-fork">\n                                    <i class="fa fa-times" aria-hidden="true" onclick="onDelStock(this)"></i>\n                              </div>\n                          </div>');$(n).find('span[class*="stock-code"]').text(e),$(n).find('span[class*="stock-name"]').text(t),$("#stockTableContent").append(n),o&&_showFadeMsg("成功添加至股票列表")}function _showFadeMsg(e){$("#fade-msg").text(e),$("#fade-alert").fadeIn(function(){setTimeout(function(){$("#fade-alert").fadeOut()},1e3)})}function onDelAllStock(e){var t=$("#stockTableContent input:checked"),o=t.length;opObj=0,o&&(delStocks=t,$("#alertTitle").text("删除股票"),$("#alertText").text("确定删除这些股票？"),$("#global-alert").show())}function onCheckAllStock(e){if(e.stopPropagation(),"INPUT"==e.target.tagName){var t=document.getElementById("checkAllStock");if(t.checked){var o=document.querySelectorAll("#stockTableContent div.table-content input");if(o.length){Array.prototype.forEach.call(o,function(e){e.checked||(e.checked=!0)});var n=$("#stockTableContent div.table-content").length,a=$("div#stockTableContent input:checked").length;$("#stockChecked").text(a),$("#stockAll").text(n),$("#del-all-stock").show(500)}else t.checked=!1}else{var o=document.querySelectorAll("#stockTableContent div.table-content input");Array.prototype.forEach.call(o,function(e){e.checked&&(e.checked=!1)}),$("#del-all-stock").hide(500)}}}function onCheckStock(e){if(e.stopPropagation(),"INPUT"==e.target.tagName){var t=document.getElementById("checkAllStock"),o=$("div#stockTableContent div.table-content").length,n=$("div#stockTableContent input:checked").length;n?t.checked?(o!=n&&(t.checked=!1),$("#stockChecked").text(n),$("#stockAll").text(o)):(o==n&&(t.checked=!0),$("#stockChecked").text(n),$("#stockAll").text(o),$("#del-all-stock").show(500)):(t.checked=!1,$("#del-all-stock").hide(500))}}function onDelStock(e){delStocks=$(e),opObj=0;var t=$(e).parent().parent().find('span[class*="stock-name"]').text();$("#alertTitle").text("删除股票"),$("#alertText").text("确定删除股票："+t+"？"),$("#global-alert").show()}function _delStock(){var e=document.getElementById("checkAllStock"),t=[];$("#global-alert").hide(),Array.prototype.forEach.call(delStocks,function(e){t.push($(e).parent().parent().find(".stock-code").text())}),$.ajax({url:URL_DELSTOCK,method:"POST",data:{userId:loginfo.username,code:t},dataType:"json",success:function(t){var o=JSON.parse(t);o.flag?($("#del-all-stock").hide(500),e.checked=!1,$("#stockTableContent").find("input:checked").each(function(e,t){t.checked=!1}),$(delStocks).parent().parent().remove(),_showFadeMsg("成功删除股票"),delStocks=[]):_showFadeMsg(o.msg)},error:function(e){console.log(e)}})}function onConfirm(){switch(opObj){case 0:_delStock();break;case 1:var e=document.getElementById("checkAllTheme");$("#global-alert").hide();var t=$(delThemes).parent().parent(),o="";Array.prototype.forEach.call(t,function(e){o+=$(e).find('span[class*="theme-name"]').text(),o+="@";var t=$(e).find('span[class*="source-name"]').text().split(";");t.forEach(function(e){o+=sourceRange.indexOf(e)+";"}),o=o.substr(0,o.length-1),o+=","}),o=o.substr(0,o.length-1),$.ajax({url:URL_DELCONCEPT,method:"POST",data:{userId:loginfo.username,links:o},dataType:"json",success:function(o){var n=JSON.parse(o);n[0].status?($("#del-all-theme").hide(500),e.checked=!1,$("#themeTableContent").find("input:checked").each(function(e,t){t.checked=!1}),t.remove(),_showFadeMsg("成功删除主题"),delThemes=[]):_showFadeMsg(n.msg)},error:function(e){console.log(e)}});break;case 2:var e=document.getElementById("checkAllTopic");$("#global-alert").hide();var t=$(delTopics).parent().parent(),o="";Array.prototype.forEach.call(t,function(e){o+=$(e).find('span[class*="source-name"]').text(),o+="@",o+=$(e).find('span[class*="topic-name"]').text(),o+=","}),o=o.substr(0,o.length-1),$.ajax({url:URL_DELTOPIC,method:"POST",data:{userId:loginfo.username,links:o},dataType:"json",success:function(t){var o=JSON.parse(t);o[0].status?($("#del-all-topic").hide(500),e.checked=!1,$("#topicTableContent").find("input:checked").each(function(e,t){t.checked=!1}),$(delTopics).parent().parent().remove(),_showFadeMsg("成功删除话题"),delTopics=[]):_showFadeMsg(o.msg)},error:function(e){console.log(e)}})}}function onCancel(){switch($("#global-alert").hide(),opObj){case 0:delStocks=[];break;case 1:delThemes=[];break;case 2:delTopics=[]}}function onCheckAllTheme(e){if(e.stopPropagation(),"INPUT"==e.target.tagName){var t=document.getElementById("checkAllTheme");if(t.checked){var o=document.querySelectorAll("#themeTableContent div.table-content input");if(o.length){Array.prototype.forEach.call(o,function(e){e.checked||(e.checked=!0)});var n=$("#themeTableContent div.table-content").length,a=$("#themeTableContent input:checked").length;$("#themeChecked").text(a),$("#themeAll").text(n),$("#del-all-theme").show(500)}else t.checked=!1}else{var o=document.querySelectorAll("#themeTableContent div.table-content input");Array.prototype.forEach.call(o,function(e){e.checked&&(e.checked=!1)}),$("#del-all-theme").hide(500)}}}function onDelAllTheme(e){var t=$("#themeTableContent input:checked"),o=t.length;opObj=1,o&&(delThemes=t,$("#alertTitle").text("删除主题"),$("#alertText").text("确定删除这些主题？"),$("#global-alert").show())}function onCheckTheme(e){if(e.stopPropagation(),"INPUT"==e.target.tagName){var t=document.getElementById("checkAllTheme"),o=$("div#themeTableContent div.table-content").length,n=$("div#themeTableContent input:checked").length;n?t.checked?(o!=n&&(t.checked=!1),$("#themeChecked").text(n),$("#themeAll").text(o)):(o==n&&(t.checked=!0),$("#themeChecked").text(n),$("#themeAll").text(o),$("#del-all-theme").show(500)):(t.checked=!1,$("#del-all-theme").hide(500))}}function onDelTheme(e){delThemes=$(e),opObj=1;var t=$(e).parent().parent().find('span[class*="theme-name"]').text(),o=$(e).parent().parent().find('span[class*="source-name"]').text();$("#alertTitle").text("删除主题"),$("#alertText").html("确定删除主题："+t+"<br>来源："+o+"？"),$("#global-alert").show()}function onLoadTheme(e){var t=$(e).parent().parent().find("span"),o=$(t[0]).text(),n=$(t[1]).text(),a=encodeURIComponent(escape(o)),c=encodeURIComponent(escape(n)),l="/theme?themes="+a+"&sources="+c;window.open(l,"_blank")}function onDelAllTopic(e){var t=$("#topicTableContent input:checked"),o=t.length;opObj=2,o&&(delTopics=t,$("#alertTitle").text("删除话题"),$("#alertText").text("确定删除这些话题？"),$("#global-alert").show())}function onCheckAllTopic(e){if(e.stopPropagation(),"INPUT"==e.target.tagName){var t=document.getElementById("checkAllTopic");if(t.checked){var o=document.querySelectorAll("#topicTableContent div.table-content input");if(o.length){Array.prototype.forEach.call(o,function(e){e.checked||(e.checked=!0)});var n=$("#topicTableContent div.table-content").length,a=$("div#topicTableContent input:checked").length;$("#topicChecked").text(a),$("#topicAll").text(n),$("#del-all-topic").show(500)}else t.checked=!1}else{var o=document.querySelectorAll("#topicTableContent div.table-content input");Array.prototype.forEach.call(o,function(e){e.checked&&(e.checked=!1)}),$("#del-all-topic").hide(500)}}}function onCheckTopic(e){if(e.stopPropagation(),"INPUT"==e.target.tagName){var t=document.getElementById("checkAllTopic"),o=$("div#topicTableContent div.table-content").length,n=$("div#topicTableContent input:checked").length;n?t.checked?(o!=n&&(t.checked=!1),$("#topicChecked").text(n),$("#topicAll").text(o)):(o==n&&(t.checked=!0),$("#topicChecked").text(n),$("#topicAll").text(o),$("#del-all-topic").show(500)):(t.checked=!1,$("#del-all-topic").hide(500))}}function onDelTopic(e){delTopics=$(e),opObj=2;var t=$(e).parent().parent().find('span[class*="topic-name"]').text();$("#alertTitle").text("删除话题"),$("#alertText").text("确定删除话题："+t+"？"),$("#global-alert").show()}function onLoadTopic(e){var t=$(e).parent().parent().find("span"),o=$(t[0]).text(),n=$(t[1]).text(),a=encodeURIComponent(escape(o)),c=encodeURIComponent(escape(n)),l="/explore/topic?topic="+a+"&stock="+c;window.open(l,"_blank")}function onUpdateMobile(e){var t=$(e),o=+t.attr("data-state");o?(t.text("修改"),o--):(t.text("取消"),o++),$("#inputMobile").slideToggle(),t.attr("data-state",o.toString())}function onSubmitUpdateMobile(){return $("#inputFieldNo").val()?$("#inputMobileContent").val()?($("#btnUpdateMobile").text("修改"),$("#mobileErr").hide(),$("#inputMobile").slideToggle(),$("#inputMobileContent").val(""),void _showFadeMsg("成功修改密码")):void $("#mobileErr").text("号码为空").show():void $("#mobileErr").text("区号为空").show()}function onUpdateEmail(e){var t=$(e),o=+t.attr("data-state");o?(t.text("修改"),o--):(t.text("取消"),o++),$("#inputEmail").slideToggle(),t.attr("data-state",o.toString())}function onSubmitUpdateEmail(){var e=$("#inputEmailContent").val();if(!e)return void $("#emailErr").text("邮箱地址为空").show();var t=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;return t.test(e)?void $.ajax({url:URL_UPDATEPROFILE,method:"POST",data:{userId:loginfo.username,field:"email",value:e},dataType:"json",success:function(t){var o=JSON.parse(t);o.flag?($("#email").text(e),$("#btnUpdateEmail").text("修改"),$("#emailErr").hide(),$("#inputEmail").slideToggle(),$("#inputEmailContent").val(""),_showFadeMsg("成功修改邮箱")):$("#emailErr").text(o.msg).show()},error:function(e){console.log(e)}}):void $("#emailErr").text("邮箱格式不正确").show()}function onSubmitUpdatePassword(){return $("#oldPassword").val()?$("#newPassword").val()?$("#repeatNewPassword").val()?$("#newPassword").val().localeCompare($("#repeatNewPassword").val())?void $("#changePasswordError").text("两次输入密码不一致").fadeIn():void $.ajax({url:URL_UPDATEPROFILE,method:"POST",data:{userId:loginfo.username,field:"passWord",value:$.md5($("#newPassword").val()),oldvalue:$.md5($("#oldPassword").val())},dataType:"json",success:function(e){var t=JSON.parse(e);t.flag?($("#oldPassword").val(""),$("#newPassword").val(""),$("#repeatNewPassword").val(""),$("#changePasswordError").text("成功修改密码").fadeIn(),setTimeout(function(){$("#changePasswordError").fadeOut()},1e3)):$("#changePasswordError").text(t.msg).fadeIn()},error:function(e){console.log(e)}}):void $("#changePasswordError").text("重复新密码为空").fadeIn():void $("#changePasswordError").text("新密码为空").fadeIn():void $("#changePasswordError").text("旧密码为空").fadeIn()}function onChangeFile(e){var t=e.files[0];if(stockListFromFile=[],!$.isEmptyObject(t)){var o=new FileReader;o.onload=function(){var e=[];return this.result.split("\n").forEach(function(t){var o=t.substr(0,6);stocks.forEach(function(t){t.substr(0,6)===o&&e.push({code:o,name:t.substring(6,t.length)})})}),$("#fileName").val(t.name),$("#btn-file-submit").show(),e&&0!=e.length?(document.getElementById("btn-file-submit").disabled&&(document.getElementById("btn-file-submit").disabled=!1),$("#fileError").hide(),stockListFromFile=e,console.log(stockListFromFile),void 0):(document.getElementById("btn-file-submit").disabled||(document.getElementById("btn-file-submit").disabled=!0),$("#fileError").text("不存在真实有效的股票代码").show(),!1)},o.readAsText(t)}}function onUploadSelectedFile(){$("div.user-loading").show();var e="";stockListFromFile.forEach(function(t){e+=t.code+","}),e=e.substring(0,e.length-1),console.log(e),$.ajax({url:URL_ADDSTOCK,method:"POST",data:{userId:loginfo.username,code:e},dataType:"json",success:function(e){var t=JSON.parse(e);t.flag?(stockListFromFile.forEach(function(e){_insertStock(e.code,e.name)}),$("#fileName").val(""),$("#btn-file-submit").hide(),_clearFileInput(),_showFadeMsg("成功添加至股票列表")):_showFadeMsg(t.msg),$("div.user-loading").hide()},error:function(e){console.log(e)}})}function _clearFileInput(){var e=navigator.userAgent.indexOf("IE")!=-1,t=$("#input-file");if(e){var o=t.closest("form"),n=$(document.createElement("form")),a=$(document.createElement("div"));t.before(a),o.length?o.after(n):a.after(n),n.append(t).trigger("reset"),a.before(t).remove(),n.remove()}else t.val("")}function onRegisterUser(){registerFlag&&$.ajax({url:URL_REGISTERUSER,method:"POST",data:{name:$("#registerRealName").val(),phone:$("#registerMobileContent").val(),email:$("#registerEmailContent").val()},dataType:"json",success:function(e){var t=JSON.parse(e);_showFadeMsg($.isEmptyObject(t)?"注册失败！请用机构邮箱。":"注册成功！")},error:function(e){console.log(e)}})}var delStocks=[],delThemes=[],delTopics=[],URL_PROFILE="/cross?id=3&",URL_CONCEPT="/cross?id=4&",URL_DELCONCEPT="/crosspost?id=14",URL_TOPIC="/cross?id=5&",URL_DELTOPIC="/crosspost?id=16",URL_STOCKS="/cross?id=7&",URL_ADDSTOCK="/crosspost?id=8",URL_DELSTOCK="/crosspost?id=9",URL_FRESHWORD="/cross?id=12&",URL_UPDATEPROFILE="/crosspost?id=17",URL_REGISTERUSER="/crosspost?id=26",opObj=0,loginfo,sourceRange=["投资者总体","散户群体","从业人群","新闻媒体"],stockListFromFile=[],registerFlag=!1;$(document).ready(function(){window.user&&(loginfo=window.user.replace(/&quot;/g,'"'),loginfo=JSON.parse(loginfo),delete window.user,loginfo.username.localeCompare("13524213611")&&loginfo.username.localeCompare("18917892217")&&loginfo.username.localeCompare("13817134049")&&loginfo.username.localeCompare("18611114502")&&loginfo.username.localeCompare("13602515165")?$("#registerTab").hide():$("#registerTab").show(),$.ajax({url:encodeURI(URL_PROFILE+"userId="+loginfo.username),method:"GET",dataType:"json",cache:!1,success:function(e){var t=JSON.parse(e);_renderProfileTab(t)},error:function(e){console.log(e)}}),$.ajax({url:encodeURI(URL_STOCKS+"userId="+loginfo.username),method:"GET",dataType:"json",cache:!1,success:function(e){var t=JSON.parse(e);t&&t.length&&_renderStockTab(t)},error:function(e){console.log(e)}}),$.ajax({url:encodeURI(URL_FRESHWORD+"userId="+loginfo.username),method:"GET",dataType:"json",cache:!1,success:function(e){var t=JSON.parse(e);t&&t.length&&_renderWordTab(t)},error:function(e){console.log(e)}}),$.ajax({url:encodeURI(URL_CONCEPT+"userId="+loginfo.username),method:"GET",dataType:"json",cache:!1,success:function(e){var t=JSON.parse(e);t&&_renderConceptTab(t)},error:function(e){console.log(e)}}),$.ajax({url:encodeURI(URL_TOPIC+"userId="+loginfo.username),method:"GET",dataType:"json",cache:!1,success:function(e){var t=JSON.parse(e);t&&_renderTopicTab(t)},error:function(e){console.log(e)}})),$("#inputEmailContent").keydown(function(e){var t=e.keyCode;13==t&&(e.preventDefault(),onSubmitUpdateEmail())}),$("#form-password input").keydown(function(e){var t=e.keyCode;13==t&&(e.preventDefault(),onSubmitUpdatePassword())}),$("#registerRealName").on("input propertychange blur focus",function(e){var t=$(this).val();t&&t.length?($("#registerRealNameErr").hide().text(""),registerFlag=!0):($("#registerRealNameErr").text("姓名不能为空").show(),registerFlag=!1)}),$("#registerMobileContent").on("input propertychange blur focus",function(e){var t=$(this).val();11!=t.length?($("#registerMobileErr").text("联系方式长度不正确").show(),registerFlag=!1):($("#registerMobileErr").hide().text(""),registerFlag=!0)}),$("#registerEmailContent").on("input propertychange blur focus",function(e){var t=$(this).val();if(!t)return $("#registerEmailErr").text("邮箱地址为空").show(),void(registerFlag=!1);var o=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;return o.test(t)?($("#registerEmailErr").hide().text(),void(registerFlag=!0)):($("#registerEmailErr").text("邮箱格式不正确").show(),void(registerFlag=!1))})});