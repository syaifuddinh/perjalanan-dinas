

$(function(){
	function e(){
		if(typeof cookie_not_handle_user_settings!="undefined"&&cookie_not_handle_user_settings==true) {return}
		if($.cookie("sidebar-collapsed")=="true"){$("#sidebar").addClass("sidebar-collapsed")}
		if($.cookie("sidebar-fixed")=="true"){$("#sidebar").addClass("sidebar-fixed")}
		if($.cookie("navbar-fixed")=="true"){$("#navbar").addClass("navbar-fixed")}
		var e=$.cookie("skin-color");
		var t=$.cookie("sidebar-color");
		var n=$.cookie("navbar-color");
		if(e!==undefined){$("body").addClass("skin-"+e)}
		if(t!==undefined){$("#main-container").addClass("sidebar-"+t)}
		if(n!==undefined){$("#navbar").addClass("navbar-"+n)}
	}
	e();
	$("a[href^=#]").click(function(e) {e.preventDefault()});
	var t=$(".flaty-nav .dropdown-toggle > .icon-bell-alt + .badge");
	if($(t).length>0&&parseInt($(t).html())>0) {$(".flaty-nav .dropdown-toggle > .icon-bell-alt").addClass("anim-swing")}
	t=$(".flaty-nav .dropdown-toggle > .icon-envelope + .badge");
	if($(t).length>0&&parseInt($(t).html())>0){$(".flaty-nav .dropdown-toggle > .icon-envelope").addClass("anim-top-down")};
	$(".show-tooltip").tooltip({container:"body",delay:{show:500}});
	$(".show-popover").popover();
	window.prettyPrint&&prettyPrint();
	var n=function(){
		if($("#sidebar.sidebar-fixed").size()==0){$("#sidebar .nav").css("height","auto");return}
		if($("#sidebar.sidebar-fixed.sidebar-collapsed").size()>0){$("#sidebar .nav").css("height","auto");return}
		var e=$(window).height()-90;$("#sidebar.sidebar-fixed .nav").css("height",e+"px");
		setTimeout(function(){$("#sidebar.sidebar-fixed .nav")},9)};
	n();
	$("#sidebar a.dropdown-toggle").click(function(){var e=$(this).next(".submenu");var t=$(this).children(".arrow");
	if(t.hasClass("icon-angle-right")){t.addClass("anim-turn90")}else{t.addClass("anim-turn-90")}e.slideToggle(400,function(){if($(this).is(":hidden")){t.attr("class","arrow icon-angle-right");}else{t.attr("class","arrow icon-angle-down");n()}
	t.removeClass("anim-turn90").removeClass("anim-turn-90")})});
	
	$("#sidebar.sidebar-collapsed #sidebar-collapse > i").attr("class","icon-double-angle-right");
	$("#sidebar-collapse").click(function(){$("#sidebar").toggleClass("sidebar-collapsed");
	if($("#sidebar").hasClass("sidebar-collapsed")){$("#sidebar-collapse > i").attr("class","icon-double-angle-right");$.cookie("sidebar-collapsed","true")}else{$("#sidebar-collapse > i").attr("class","icon-double-angle-left");$.cookie("sidebar-collapsed","false")};n()});
	
	$("#sidebar .nav > li.active > a > .arrow").removeClass("icon-angle-right").addClass("icon-angle-down");
	
	$("#theme-setting > a").click(function(){
		$(this).next().animate({width:"toggle"},500,function(){if($(this).is(":hidden")){$("#theme-setting > a > i").attr("class","icon-gears icon-2x")}else{$("#theme-setting > a > i").attr("class","icon-remove icon-2x")}});
		$(this).next().css("display","inline-block")
	});
	
	$("#theme-setting ul.colors a").click(function(){
		var e=$(this).parent().get(0);
		var t=$(e).parent().get(0);
		var n=$(t).data("target");
		var r=$(t).data("prefix");
		var i=$(this).attr("class");
		var s=new RegExp("\\b"+r+".*\\b","g");$(t).children("li").removeClass("active");
		$(e).addClass("active");
		if($(n).attr("class")!=undefined){$(n).attr("class",$(n).attr("class").replace(s,"").trim())}$(n).addClass(r+i);
		if(n=="body"){var o=$(t).parent().get(0);var u=$(o).nextAll("li:lt(2)");
		$(u).find("li.active").removeClass("active");
		$(u).find("a."+i).parent().addClass("active");$("#navbar").attr("class",$("#navbar").attr("class").replace(/\bnavbar-.*\b/g,"").trim());
		$("#main-container").attr("class",$("#main-container").attr("class").replace(/\bsidebar-.*\b/g,"").trim())}
		$.cookie(r+"color",i)});var r=["blue","red","green","orange","yellow","pink","magenta","gray","black"];
		$.each(r,function(e,t){if($("body").hasClass("skin-"+t)){$("#theme-setting ul.colors > li").removeClass("active");
			$("#theme-setting ul.colors > li:has(a."+t+")").addClass("active")}});
		$.each(r,function(e,t){if($("#navbar").hasClass("navbar-"+t)){$('#theme-setting ul[data-prefix="navbar-"] > li').removeClass("active");
		$('#theme-setting ul[data-prefix="navbar-"] > li:has(a.'+t+")").addClass("active")}
		if($("#main-container").hasClass("sidebar-"+t)){$('#theme-setting ul[data-prefix="sidebar-"] > li').removeClass("active");
		$('#theme-setting ul[data-prefix="sidebar-"] > li:has(a.'+t+")").addClass("active")}
	});
		
	if($("#sidebar").hasClass("sidebar-fixed")){$('#theme-setting > ul > li > a[data-target="sidebar"] > i').attr("class","icon-check green")}
	if($("#navbar").hasClass("navbar-fixed")){$('#theme-setting > ul > li > a[data-target="navbar"] > i').attr("class","icon-check green")}
	
	$("#theme-setting > ul > li > a").click(function(){
		var e=$(this).data("target");
		var t=$(this).children("i");
		if(t.hasClass("icon-check-empty")){t.attr("class","icon-check green");
		$("#"+e).addClass(e+"-fixed");
		$.cookie(e+"-fixed","true")}else{t.attr("class","icon-check-empty");
		$("#"+e).removeClass(e+"-fixed");
		$.cookie(e+"-fixed","false")}if(e=="sidebar"){n()}
	});
	$(".box .box-tool > a").click(function(e){
		if($(this).data("action")==undefined){return}
		var t=$(this).data("action");
		var n=$(this);
		switch(t){
			case"collapse":$(n).children("i").addClass("anim-turn180");
						$(this).parents(".box").children(".box-content").slideToggle(500,function(){if($(this).is(":hidden")){$(n).children("i").attr("class","icon-chevron-down")}else{$(n).children("i").attr("class","icon-chevron-up")}});break;
			case"close":$(this).parents(".box").fadeOut(500,function(){$(this).parent().remove()});break;
		}
		e.preventDefault();
	});
	
	$(window).scroll(function(){if($(this).scrollTop()>100){$("#btn-scrollup").fadeIn()}else{$("#btn-scrollup").fadeOut()}});
	$("#btn-scrollup").click(function(){$("html, body").animate({scrollTop:0},600);return false});
	if($(".tile-active").size()>0){var i=1500;var s=5e3;var o=function(e,t,n,r){$(e).children(".tile").animate({top:"-="+r+"px"},i);setTimeout(function(){u(e,t,n,r)},n+i)};var u=function(e,t,n,r){$(e).children(".tile").animate({top:"+="+r+"px"},i);setTimeout(function(){o(e,t,n,r)},t+i)};$(".tile-active").each(function(e,t){var n,r,i,u,a;n=$(this).children(".tile").first();r=$(this).children(".tile").last();i=$(n).data("stop");u=$(r).data("stop");a=$(n).outerHeight();if(i==undefined){i=s}if(u==undefined){u=s}setTimeout(function(){o(t,i,u,a)},i)})}
	$('.table > thead > tr > th:first-child > input[type="checkbox"]').change(function(){var e=false;if($(this).is(":checked")){e=true}$(this).parents("thead").next().find('tr > td:first-child > input[type="checkbox"]').prop("checked",e)});
	if(jQuery().wysihtml5){$(".wysihtml5").wysihtml5()}
});