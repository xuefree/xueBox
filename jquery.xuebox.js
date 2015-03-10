/**
 * jQuery xueBox Plugin
 * http://blog.xuefree.com
 *
 * @version 1.0 bate
 * @copyright Copyright (C) 2014 Oliver.xue. All rights reserved.
 * @license MIT License
 * @mail admin@xuefree.com
 */
 (function($){
	var opts;
	$.xuebox = function(option){
		//设置
		opts = $.extend({}, $.xuebox.defaults, option);
		createMask();
	    $.xuebox.createBox();
	}
	
	$.xuebox.defaults = {
		boxTitle:'提示信息',
		maskId: 'xueMask',
		boxId: 'xueBox',
		closeClass:'xueClose',
		//是否显示遮罩层
		hasMask: true,
		//遮罩颜色
		maskColor: '#000',
		//点击遮罩是否关闭
		maskClose: true,
		//遮罩层透明度
		maskOpacity: 50,
		//内容框位置 center居中，top顶部，bottom底部
		boxPosition:'center'
	};
	
	//创建遮罩层
	function createMask(){
		if ($("#"+opts.maskId).length < 1){
			var maskObj = $('<div id="'+opts.maskId+'"></div>');
			var opacity = opts.maskOpacity/100;
			maskObj.appendTo("body");
			maskObj.css({
				position:'absolute',
				left:0,
				top:0,
				width:'100%',
				height:'100%',
				'z-index':20000,
				'background-color':opts.maskColor,
				filter:'alpha(opacity='+opts.maskOpacity+')',  
				opacity: opacity,
				'-moz-opacity': opacity,
				'-khtml-opacity': opacity,
				display:'none'
			});
		}
	}
	
	//获取内容框位置
	function boxPosition(boxPosition){
		var winH = $(window).height();
		var winW = $(window).width();
		var conH = $("#"+opts.boxId).height();
		var conW = $('#'+opts.boxId).width();
		var boxTop = 0, boxLeft = 0;
		switch (boxPosition){
			case 'top':
				if (conW >= winW){
					$('#'+opts.boxId).width(winW-50);
					boxLeft = 20;
				}else{
					boxLeft = (winW - conW)/2;
				}
				break;
			default:
				if (conW >= winW){
					$('#'+opts.boxId).width(winW-50);
					boxLeft = 20;
				}else{
					boxLeft = (winW - conW)/2;
				}
				if (conH >= winH)
					boxTop = 10;
				else{
					boxTop = (winH - conH)/3
				}
	
		}
		var re = [boxLeft,boxTop];
		return re;
	}
	
	//创建内容框
	$.xuebox.createBox = function(){
		if ($("#"+opts.boxId).length < 1){
			var boxObj = $('<div id="'+opts.boxId+'"><div><span id="xueTitleId"></span><a href="#" class="'+opts.closeClass+'">关闭</a><div style="clear:both;"></div></div><div id="xueConId"></div></div>');
			boxObj.appendTo("body");
			boxObj.css({
				position:'absolute',
				'background-color':'#FFFFFF',
				border:'5px solid #0099CC',
				overflow:'auto',
				padding:'2px',
				'z-index':20001,
				display:'none'
			});
			boxObj.children("div:first").css({'background-color':'#009999', 'color':'#fff', 'margin-bottom':'5px'}).find("a").css({color:'#FFF',float:'right'});
		}
	}
	
	//关闭
	$.xuebox.close = function(){
		$("#"+opts.boxId).hide("slow").find("#xueConId,#xueTitleId").html('');
		$("#"+opts.maskId).hide();
	}
	
	//打开弹出框
	$.xuebox.open = function(content,title){
		title = (title)?title:opts.boxTitle;
		var boxObj = $("#"+opts.boxId);
		boxObj.children("#xueConId").append(content);
		boxObj.find("#xueTitleId").html(title);
		$("#"+opts.maskId).show();
		boxObj.fadeIn(1000);
		//绑定关闭事件
		$("."+opts.closeClass).click($.xuebox.close);
		if(opts.maskClose){
			$("#"+opts.maskId).click($.xuebox.close);
		}
		//设置内容框位置
		position = boxPosition(opts.boxPosition);
		boxObj.css({
				top: position[1]+'px',
				left: position[0]+'px'
		});
	}
	
	//信息提示框
	$.xuebox.dialog = function(msg,title){
		var con = $('<div style="text-align:center;width:300px;"><h4>'+msg+'</h4><button class="'+opts.closeClass+'">确认</button></div>');
		con.children("button").css({'border':'1px solid #0099CC','margin-bottom':'6px'});
		$.xuebox.open(con,title);
	}
	
	//确认对话框
	$.xuebox.confirm = function(msg,redirect,title){
		var con = $('<div style="text-align:center;width:300px;"><h4>'+msg+'</h4><button class="xueYes '+opts.closeClass+'">确认</button>　　<button class="xueNo '+opts.closeClass+'">取消</button></div>');
		con.children("button").css({'border':'1px solid #0099CC','margin-bottom':'6px'});
        $.xuebox.open(con,title);
		
		$(".xueYes").click(function(){
			if (typeof redirect == 'string')
				window.location.href = redirect;
		});
		return false;
	}
	
	//获取ajax内容 暂不支持跨域
	$.xuebox.ajax = function(url, title){
		var loading = '<div id="xueLoading">Loading....</div>'
		if (typeof url == 'string'){
			$.xuebox.open(loading,title);
			$.get(url, function(data){
				var boxObj = $("#"+opts.boxId);
				boxObj.find('#xueLoading').replaceWith(data);
				position = boxPosition(opts.boxPosition);
				boxObj.css({
					top: position[1]+'px',
					left: position[0]+'px'
				});
			});
		}
	}
	
	//加载iframe内容，注意 跨域访问 效果一般
	$.xuebox.iframe = function(url, title){
		var iframeObj = $('<iframe src="'+url+'" scrolling="auto" style="margin:2px; border:0;"></iframe>');
		$.xuebox.open(iframeObj,title);
		iframeObj.load(function(){
			var a =  document.createElement('a');
			a.href = url;
		   if (location.host == a.host){
			   	var width = $(this).contents().width(); 
		        var height = $(this).contents().height();; 
		   		$(this).height(height+5);
		   		$(this).width(width+5);
		   }else{ //跨域访问 无法获取iframe内容大小
		   		$(this).height($(window).height()-50);
		   		$(this).width($(window).width()-50);
		   }
		   	   
		   position = boxPosition(opts.boxPosition);
			$("#"+opts.boxId).css({
				top: position[1]+'px',
				left: position[0]+'px'
			});
    	}); 
	}
	
	//获取本地页面selector内容
	$.xuebox.local = function(selector, title){
		var con = $(selector).clone(true);
		con.css('display','block');
		$.xuebox.open(con,title);
	}
	
})(jQuery)