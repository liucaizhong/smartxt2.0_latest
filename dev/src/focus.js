//global
var method = 0;
var methodRange = ['auto','h','i'];
var period;
var periodRange = ['1','5','10','20'];
var source = 2;
var sourceRange = [0,1,2,3];
var sourceName = ['*', 'guba', '(report OR announce)', 'news'];
var sourceShowName = ['投资者总体','散户群体','从业人群','新闻媒体']
//http://139.196.18.233:8087/axis2/services/smartxtAPI/getConceptList?src=投资者总体&type=h20&response=application/json
var CONCEPTURL = '/cross?id=6&';
var conceptList = [];
var conceptIndicator = 0;
var CHARTNUM = 4;
var HEATURL = '/cross?id=0&';
//echarts
var charts = [];
var loginfo;

$(document).ready(() => {
	//echart resize handler
	$(window).on('resize',()=>{
		charts.forEach(function(cur) {
			cur.resize();
		});
	});

	//get user info
	if(window.user) {
        loginfo = window.user.replace(/&quot;/g,'"');
        loginfo = JSON.parse(loginfo);
        delete window.user;
        console.log('user', loginfo);
       	//get concept list
		//render echarts
		$('footer.footer').hide();
		_renderConceptList();
    }

	//loading more
	$(window).scroll(function() {
	  	if ($(window).scrollTop() + $(window).height() == $(document).height()) {
	  		$('.more-button span:nth-child(1)').removeClass('active');
	  		$('.more-button span:nth-child(2)').addClass('active');

	  		_renderCharts(conceptList.splice(0,CHARTNUM)); 
	  	}
	});
});

function onForm(that, event) {
	event.stopPropagation();

	var target = event.target;

	if(target.tagName === 'BUTTON') {
		var $btn = $(target);
		var category = $btn.attr('id');
		var update = false;

		switch(category[0]) {
			case 'm':
				if(method != category[1]) {
					method = category[1];
					update = true;
					switch(method) {
						case '0':
							$('#btnPeriod').find('button[class*="btn-valid"]').removeClass('btn-valid').addClass('btn-invalid');
							$('#btnPeriod').children().attr('disabled',true);
							period = undefined;
							break;
						case '1':
							$('#btnPeriod').find('button[class*="btn-valid"]').removeClass('btn-valid').addClass('btn-invalid');
							$('#p0').attr('disabled',true);
							$('#p1').attr('disabled',false).addClass('btn-valid');
							$('#p2').attr('disabled',false);
							$('#p3').attr('disabled',false);
							period = '1';
							break;
						case '2':
							$('#btnPeriod').find('button[class*="btn-valid"]').removeClass('btn-valid').addClass('btn-invalid');
							$('#p0').attr('disabled',false).addClass('btn-valid');
							$('#p1').attr('disabled',false);
							$('#p2').attr('disabled',false);
							$('#p3').attr('disabled',true);
							period = '0';
							break;
					}
				}
				break;
			case 'p':
				if(period != category[1]) {
					period = category[1];
					update = true;
				}
				break;
			case 's':
				if(source != category[1]) {
					source = category[1];
					update = true;
				}
				break;
		}
		
		if(update) {
			$('footer.footer').hide();
			$('.more-button').find('[class*=active]').removeClass('active');
			//change button style
			var btnSiblings = $btn.siblings('button[class*="btn-valid"]');
			Array.prototype.forEach.call(btnSiblings, function(cur) {
				$(cur).removeClass('btn-valid').addClass('btn-invalid');
			});

			$btn.removeClass('btn-invalid').addClass('btn-valid');
			$('.focus-charts>div.container').empty();
			//ajax get and render charts
			//to do later
			console.log('ajax get focus data!');
			console.log(method, period, source);

			_renderConceptList();
		}
	}
}

function _renderConceptList() {
	$('div.focus-loading').show();
	// $('.loading-more').hide();
	var typeUrl; 
	if(!method) {
		typeUrl = methodRange[method];
	}else {
		typeUrl = methodRange[method] + periodRange[period];
	}
	var conceptUrl = CONCEPTURL + 'userId=' + loginfo.username + '&source='+ sourceRange[source] + '&type=' + typeUrl;
	$.ajax({
		url: conceptUrl,
		type: 'GET',
		async: true,
		dataType: 'json',
		success: (data) => {
			var d = JSON.parse(data);
			d = JSON.parse(d);
		    if(d.length) {
		        conceptList = d;  
		        _renderCharts(conceptList.splice(0,CHARTNUM)); 
		        // $('.loading-more').show();
		    } else {
		    	// $('.loading-more').hide();
		    	$('div.focus-loading').hide();
		        //show message
			    $('.focus-charts>div.container').empty().html('<div style="font-size:2rem">未找到相关记录</div>');
		    }
		},
		error: (err) => {
		    console.log(err);
		}
	});
}

function _renderCharts(concepts) {
	var conceptIdx = conceptIndicator;
	conceptIndicator++;
	//create element
	concepts.forEach(function(cur, idx) {
		//get heat data
		var heatUrl = HEATURL + 'userId=' + loginfo.username + '&concepts=' + cur + '&sources=' + source;
		$.ajax({
			url: heatUrl,
			type: 'GET',
			async: true,
			dataType: 'json',
			success: (data) => {
				var d = JSON.parse(data);
				d = JSON.parse(d);

			    if(d[0].flag !== -1) {
			    	var entry = d[1];
			    	var legend = []; 
  					var category = [];
  					var series = [];
			  		var heat = [];
				  	var index = [];

			    	var serieH = {
				  		name: entry.concept+' H',
				  		type: 'line',
				  		yAxisIndex: 0,
				  		itemStyle : {
				  			normal: {
				  				areaStyle: {
				  					type: 'default', 
				  					color:'rgba(239,243,246,.6)'
				  				}, 
				  				color: 'rgb(50,70,90)'
				  			}
				  		},
				  		symbol: 'none'
				  	};
				  	var serieI = {
				  		name: entry.concept+' I',
				  		type: 'line',
				  		yAxisIndex: 1,
				  		itemStyle : {
				  			normal: {
				  				areaStyle: {
				  					type: 'default', 
				  					color: 'rgba(250,225,222,.6)'
				  				}, 
				  				color: 'rgb(235,85,30)'
				  			}
				  		},
				  		symbol: 'none'
				  	};

			        legend.push({name:entry.concept+' H',icon: 'line'});
			        legend.push({name:entry.concept+' I',icon: 'line'});

			  		entry.heat.forEach(function(cur) {
				  		heat.push(cur.heat);
				  		index.push(cur.index);
				  		category.push(cur.date);
				  	})
				  	serieH.data = heat;
				  	series.push(serieH);

				  	serieI.data = index;
				  	series.push(serieI);

			        //set echart option
			        var chartDiv = document.createElement('div');
					var chartId = 'c'+ (conceptIdx*CHARTNUM+idx);
					$(chartDiv).attr('id', chartId).addClass('focus-chart');
					$('.focus-charts>div.container').append(chartDiv);
					var chart = echarts.init(document.getElementById(chartId));
					chart.setOption({
				        baseOption: {
				            title: {
				                // text: sourceShowName[source]
				            },
				            tooltip: {
				                trigger: 'axis'
				            },
				            dataZoom: [{
				                handleColor:'rgb(75,188,208)', 
				                fillerColor:'rgb(75,188,208)',  
				                borderWidth:0,
				                show : true,  
				                realtime: true, 
				                start:75.5, 
				                end: 100, 
				                height:15
				            }, {
				                type: 'inside',
				                start: 5,
				                end: 25
				            }],
				            legend: {
				                data: legend
				            },
				            toolbox: {
				                feature: {
				                    saveAsImage: {}
				                },
				                right: '7%'
				            },
				            xAxis: {
				            	type: 'category',
				                data: category,
				                axisTick:false, 
				                splitLine: {show: false}, 
				                axisLine: {
				                	show: true,
				                	lineStyle: {
				                		type: 'solid',
				                		width: 1,
				                		color: 'rgb(75,188,208)'
				                	}
				                },
				                boundaryGap: false,
				                axisTick: false,
				                axisLabel: {
				                	textStyle: {
				                		fontFamily : '微软雅黑', 
				                		fontSize : 12,
				                		color: 'black'
				                	}, 
				                	show: true
				                }
				            },
				            yAxis: [{
				                name: '关注度(H)',
				                type: 'value',
					  			splitNumber: 7, 
					  			splitLine: {
					  				show: true, 
					  				lineStyle:{type:'dashed', width: 1}
					  			},
					  			nameTextStyle: {
				                		fontFamily : '微软雅黑', 
				                		fontSize : 12,
				                		color: 'black'
				                },
					  			axisLine: {
					  				show: true,
					  				lineStyle: {
					  					type: 'solid',
					  					width: 1,
					  					color: 'rgb(75,188,208)'
					  				}
					  			}, 
					  			axisLabel: {
					  				textStyle: {
				                		fontFamily : '微软雅黑', 
				                		fontSize : 12,
				                		color: 'black'
				                	}, 
				                	show: true,  
				                }
				            }, {
				                name: '指数(I)',
				                type: 'value',
					  			splitNumber: 7, 
					  			splitLine: {
					  				show: false, 
					  				lineStyle:{type:'dashed', width: 1}
					  			},
					  			nameTextStyle: {
				                		fontFamily : '微软雅黑', 
				                		fontSize : 12,
				                		color: 'black'
				                },
					  			axisLine: {
					  				show: true,
					  				lineStyle: {
					  					type: 'solid',
					  					width: 1,
					  					color: 'rgb(75,188,208)'
					  				}
					  			}, 
					  			axisLabel: {
					  				textStyle: {
				                		fontFamily : '微软雅黑', 
				                		fontSize : 12,
				                		color: 'black'
				                	}, 
				                	show: true,  
				                }
				            }],
				            series: series
				        }
				    });

				    charts.push(chart);
					// console.log('charts', charts);
					if(!$('.more-button span:nth-child(1)').hasClass('active')) {
						$('.more-button span:nth-child(1)').addClass('active');
					}
					if($('.more-button span:nth-child(2)').hasClass('active')) {
						$('.more-button span:nth-child(1)').addClass('active');
	  					$('.more-button span:nth-child(2)').removeClass('active');
					}
			    } 
			    $('div.focus-loading').hide();
			},
			error: (err) => {
			    console.log(err);
			}
		});	
	});

	if(concepts.length < CHARTNUM) {
		$('.more-button').hide();
		$('footer.footer').show();
	}
}

