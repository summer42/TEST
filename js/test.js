//navbar导航
$('.navbar-a').closest("li").hover(function() {
	$(this).find('.navbar-detail').show();
}, function() {
	$(this).find('.navbar-detail').hide();
});

//侧面tab，applying
$('.admission-nav-tabs a').click(function() {
	$('.admission-nav-tabs a').css('border-bottom', '1px solid #EEEEEE');
	var duixiang = $(this).closest('li').prev('li').find('a');
	duixiang.css('border-bottom', '1px solid #E5E5E5');
});

//侧面tab，engineering
$('.engineering-nav-tabs a').click(function() {
	$('.engineering-nav-tabs a').css('border-bottom', '1px solid #EEEEEE');
	var bar1 = $(this).closest('li').prev('li').find('a');
	bar1.css('border-bottom', '1px solid #E5E5E5');
});

//手机站设置导航选中状态
function setNavbar(index) {
	//	$(".navbar").children("li").removeClass("active");
	$(".nav-list").children("li").removeClass("active");
	$(".nav-list").children("li").eq(index - 1).addClass("active");
}
//导航栏二维码
$('.qq').hover(function() {
	$('.qq-weweima').show();
}, function() {
	$('.qq-weweima').hide();
});

$('.weixin').hover(function() {
	$('.weixin-weweima').show();
}, function() {
	$('.weixin-weweima').hide();
});
$(function() {
	var article_target = $('[article-target]').attr('article-target');
	$('.engineering-nav-tabs li').eq(article_target - 1).addClass('active');

});
$('#uts-lxwm').on('click', function() {
		$('#zlstxtcnt').click();
	})

//近期活动
$('.bra-btn').on('click', function() {
	$('.zoho-form').slideDown();
})
$('.uts-pop-out-close').on('click', function() {
	$('.zoho-form').slideUp();
})

//视频点赞
$('.smalltip .zhuanfa').on('click', function() {
	$(this).addClass('active')
});

//新闻点赞
$('.interact-info .icon-share').on('click', function() {
	$(this).addClass('active');
});

//手机站
//侧面有tab的页面

$(function() {
	var holder = $('<div class="holder"></div>');
	holder.html($('.admission-banner2-r').html());
	$('.nav-tabs li.active').append(holder);
})

$('.nav-tabs li.active a[role]').on('click', function() {
		$(this).closest('li').find('.holder').slideToggle();
		$(this).find("i.caret.arrt").toggleClass("have");
	})
	//手机端菜单
$("#pageNav").on('click', function() {
	$(".nav-list").toggle("fast");
});

//手机端搜索
$(".icon-toggle").on('click', function() {
	var $searchList = $(".search_list").toggle("fast");
	if ($searchList.css('display') == 'block') {
		$(this).hide();
	} else {
		$(this).show();
	}
	return false;
});

//手机站滚动菜单消失
$(window).on('scroll', function() {
	$('#nav-list').css('display', 'none');
	$(".icon-toggle").show();
	$('.search_list').hide('fast');
});


$("body").click(function(e) {
	var $searchList = $('.search_list');
	if ($searchList.css('display') == 'block') {
		if (!$(e.target).closest('form').hasClass('search_list')) {
			$searchList.hide('fast');
			$('.icon-toggle').show();
		}
	}
});
//近期活动过期自动隐藏
$(document).ready(function() {
	var today = ChangeDateToString();
	$(".fist-ul .item-active-time").each(function() {
		//  	debugger;
		var last_time = $(this).html().substr(3, 11) + $(this).html().split('-')[1];
		
		if (today > last_time) {
			$(this).parent(".hidden-box").remove();
		}
	});
	$(".fist-ul .active-time-list").each(function() {
		if ($(this).find(".hidden-box").html() == undefined) {
			$(this).hide();
		}
	});
});

function ChangeDateToString() {
	var Year = 0;
	var Month = 0;
	var Day = 0;
	var CurrentDate = "";
	var DateIn = new Date();
	Year = DateIn.getYear();
	Month = DateIn.getMonth() + 1;
	Day = DateIn.getDate();
	var hours = DateIn.getHours();
	var minutes = DateIn.getMinutes();



	if (navigator.appName == "Netscape") {
		CurrentDate = (1900 + Year) + "/";
	}
	if (navigator.appVersion.indexOf("MSIE") != -1) {
		CurrentDate = Year + "/";
	}
	if (Month >= 10) {
		CurrentDate = CurrentDate + Month + "/";
	} else {
		CurrentDate = CurrentDate + "0" + Month + "/";
	}
	if (Day >= 10) {
		CurrentDate = CurrentDate + Day;
	} else {
		CurrentDate = CurrentDate + "0" + Day;
	}
	CurrentDate = CurrentDate + " ";
	if (hours >= 10) {
		CurrentDate = CurrentDate + hours;
	} else {
		CurrentDate = CurrentDate + "0" + hours;
	}
	CurrentDate = CurrentDate + ":";
	if (minutes >= 10) {
		CurrentDate = CurrentDate + minutes;
	} else {
		CurrentDate = CurrentDate + "0" + minutes;
	}
	return CurrentDate;
}