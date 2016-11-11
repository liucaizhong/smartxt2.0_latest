$(function() {

	var Accordion = function(el, multiple) {
		this.el = el || {};
		this.multiple = multiple || false;

		// Variables privadas
		var links = this.el.find('.link');
		// Evento
		links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
	}

	Accordion.prototype.dropdown = function(e) {
		var $el = e.data.el,
			$this = $(this),
			$next = $this.next();

		$next.slideToggle();
		$this.parent().toggleClass('open');

		if(!$next.length) {
			var showId = '#'+$this.attr('data-rel');
		}else{
			var showId = $next.find('.active').attr('data-ref');
		}
		var $showDiv = $(showId);
		$showDiv.siblings().hide();
		$showDiv.fadeIn(700);

		if (!e.data.multiple) {
			$el.find('.submenu').not($next).slideUp();
			$el.find('.link').not($this).parent().removeClass('open');
		};
	}	

	var accordion = new Accordion($('#accordion'), false);

	$('.submenu a').click(function(e) {
		var $this = $(this);
		$this.addClass('active');
		$this.parent().siblings().children().removeClass('active');
		var showId = $this.attr('data-ref');
		var $showDiv = $(showId);
		$showDiv.siblings().hide();
		$showDiv.show();
	});

	$('.help-section a').click(function(e) {
		var $this = $(this);
		var showId = $this.attr('data-rel');
		var $showLi = $('a[data-ref="'+showId+'"]').parent();
		if(!$this.attr('data-level')) {
			$showLi.parent().siblings().click();
		}
		$showLi.children().click();
	});

	$(window).scroll(function(e) {
		var scrollTop = document.body.scrollTop;
		$(".help-menu").animate({top: scrollTop + 80},50);
	});
});