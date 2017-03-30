function showfaqs(doid) {
	var strfid = "faqs_" + doid;
	if ($("#" + strfid).is(":hidden")) {
		$("#" + strfid).show();
	} else {
		$("#" + strfid).hide();
	}
}
$(function() {
	var W_width = $("body").width();
	var _left = (W_width - 980) / 2 + 982;
	$("#JS_backToTop").css("left", _left);
	$(window).scroll(function() {
		var obj = $("#JS_backToTop");
		obj.fadeIn();
		if ($(window).scrollTop() == 0) {
			obj.fadeOut();
		}
	})
	$("#JS_backToTop").click(function() {
		var _this = $(this);
		a = setInterval(function() {
			var top = $(window).scrollTop();
			$(window).scrollTop(top - 50);
			if (top <= 0) {
				clearInterval(a);
			}
		}, 10)
	})
})
$(document).ready(function() {
	$('.qq-tab').hover(function() {
		$(this).toggleClass('list-bg');
		$('.qq-tab-first').toggleClass('list-bg');
	});
	$('.time-info').hover(function() {
		$('.time-info>.time-list').toggle();
	});
});
$(document).ready(function() {
	if ($('.pop_video').length > 0) {
		$(".pop_video").fancybox({
			'autoScale': false,
			'transitionIn': 'none',
			'transitionOut': 'none',
			'type': 'iframe',
			'width': 685,
			'height': 435,
			'showNavArrows': false
		});
	}
});
jQuery.cookie = function(name, value, options) {
	if (typeof value != 'undefined') {
		options = options || {};
		if (value === null) {
			value = '';
			options.expires = -1;
		}
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString();
		}
		var path = options.path ? '; path=' + options.path : '';
		var domain = options.domain ? '; domain=' + options.domain : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	} else {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};

function showVideo(domid, vid, autoplay) {
	player = new YKU.Player(domid, {
		client_id: '4eb667b5467dcc7b',
		vid: vid,
		show_related: false,
		autoplay: autoplay,
		styleid: '6'
	});
}
$(function() {
	var degree = ['', '很差', '差', '中', '良', '优', '未评分'];
	$(document).on('click', 'i[cjmark]', function() {
		var num = $(this).index();
		var pmark = $(this).parents('.revinp');
		var mark = pmark.prevAll('input');
		if (mark.prop('checked')) return false;
		var list = $(this).parent().find('i');
		for (var i = 0; i <= num; i++) {
			list.eq(i).attr('class', 'level_solid');
		}
		for (var i = num + 1, len = list.length - 1; i <= len; i++) {
			list.eq(i).attr('class', 'level_hollow');
		}
		$('#account_level').val(num + 1);
	})
})