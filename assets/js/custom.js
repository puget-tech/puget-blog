var $ = jQuery.noConflict();

"use strict";

function debouncer(func, timeout) {
	var timeoutID, timeout = timeout || 500;
	return function () {
		var scope = this,
			args = arguments;
		clearTimeout(timeoutID);
		timeoutID = setTimeout(function () {
			func.apply(scope, Array.prototype.slice.call(args));
		}, timeout);
	}
}
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 */
(function (window) {

	'use strict';

	// class helper functions from bonzo https://github.com/ded/bonzo

	function classReg(className) {
		return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}

	// classList support for class management
	// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;

	if ('classList' in document.documentElement) {
		hasClass = function (elem, c) {
			return elem.classList.contains(c);
		};
		addClass = function (elem, c) {
			elem.classList.add(c);
		};
		removeClass = function (elem, c) {
			elem.classList.remove(c);
		};
	} else {
		hasClass = function (elem, c) {
			return classReg(c).test(elem.className);
		};
		addClass = function (elem, c) {
			if (!hasClass(elem, c)) {
				elem.className = elem.className + ' ' + c;
			}
		};
		removeClass = function (elem, c) {
			elem.className = elem.className.replace(classReg(c), ' ');
		};
	}

	function toggleClass(elem, c) {
		var fn = hasClass(elem, c) ? removeClass : addClass;
		fn(elem, c);
	}

	var classie = {
		// full names
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		toggleClass: toggleClass,
		// short names
		has: hasClass,
		add: addClass,
		remove: removeClass,
		toggle: toggleClass
	};

	// transport
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(classie);
	} else {
		// browser global
		window.classie = classie;
	}

})(window);

/* Initialize All Scripts */
$(document).ready(function () {

	var windowW = $(window).width(),
		prevW = windowW;

	var menuneg = '-100%';
	var menuBreakPoint = 992;

	// Remove Loader
	$('body').addClass('loaded');

	// Show rev slider

	if ($(".tp-banner-container").length) {
		$(".tp-banner-container").css({
			height: 'auto'
		}).animate({
			"opacity": "1"
		}, 500);
	}

	// Menu Initialization

	function menuIni(windowW) {

		if (windowW > menuBreakPoint) {
			$('ul.navbar-nav > li').addClass('hovernav');
			$('ul.navbar-nav > li.hovernav')
				.on('mouseenter', function () {
					$(this).addClass("open")
				})
				.on('mouseleave', function () {
					$(this).removeClass("open")
				});
			$('ul.navbar-nav > li li')
				.on('mouseenter', function () {
					if ($(this).children('ul.level-menu__dropdown').length) {
						$(this).addClass('active');
						$(this).children('ul.level-menu__dropdown').show().css({
							'opacity': 0,
							'left': $(this).width()
						})
						var off = $(this).children('ul.level-menu__dropdown').offset();
						var l = off.left;
						var w = $(this).children('ul.level-menu__dropdown').width();
						var docW = $(".container").width();
						var isEntirelyVisible = (l + w <= docW);

						if (!isEntirelyVisible) {
							$(this).children('ul.level-menu__dropdown').show().css({
								'opacity': 1,
								'right': $(this).width(),
								'left': 'auto'
							})
						} else {
							$(this).children('ul.level-menu__dropdown').show().css({
								'opacity': 1,
								'left': $(this).width()
							})
						}

					}
				})
				.on('mouseleave', function () {
					if ($(this).children('ul.level-menu__dropdown').length) {
						$(this).removeClass('active');
						$(this).children('ul.level-menu__dropdown').hide().css({
							'left': 'auto',
							'right': 'auto'
						})
					}
				});

		} else {
			$('ul.navbar-nav > li').removeClass('hovernav');
			$('ul.navbar-nav > li li').unbind('mouseenter mouseleave');
			$('.touch ul.navbar-nav > li > a').on('click', function (e) {
				e.preventDefault();
			})
			$('.touch ul.navbar-nav > li a span.caret').on('click', function (e) {
				$(this).parent().parent('li').toggleClass('open');
			});
			$('.touch ul.navbar-nav > li a span.link-name').on('click', function (e) {
				var url = $(this).parent('a').attr("href");
				window.location = url;
			});

		};
		$('.no-touch .hovernav a').on('click', function (e) {
			window.location = this.href;
		});
	}

	// Modal Search Popup

	function modalSearch() {
		if ($('.overlay').length && $('.search-open').length) {
			var triggerBttn = $('.search-open'),
				overlay = document.querySelector('div.overlay'),
				closeBttn = overlay.querySelector('button.overlay-close');
			transEndEventNames = {
					'WebkitTransition': 'webkitTransitionEnd',
					'MozTransition': 'transitionend',
					'OTransition': 'oTransitionEnd',
					'msTransition': 'MSTransitionEnd',
					'transition': 'transitionend'
				},
				transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
				support = {
					transitions: Modernizr.csstransitions
				};

			function toggleOverlay() {
				if (classie.has(overlay, 'open')) {
					$('body').removeClass('modal-open');
					classie.remove(overlay, 'open');
					classie.add(overlay, 'close');
					var onEndTransitionFn = function (ev) {
						if (support.transitions) {
							if (ev.propertyName !== 'visibility') return;
							this.removeEventListener(transEndEventName, onEndTransitionFn);
						}
						classie.remove(overlay, 'close');
					};
					if (support.transitions) {
						overlay.addEventListener(transEndEventName, onEndTransitionFn);
					} else {
						onEndTransitionFn();
					}
				} else if (!classie.has(overlay, 'close')) {
					classie.add(overlay, 'open');
					$('body').addClass('modal-open');
				}

				return false;
			}
			triggerBttn.on('click', toggleOverlay);
			closeBttn.addEventListener('click', toggleOverlay);
		}
	}

	// Slide menu small Header

	function openSlidemenu() {
		$("#openSlidemenu").on('click', function (e) {
			$(".header--small #slidemenu").slideToggle(250, function () {
				$(".header--small #slidemenu").toggleClass('open')
			});
			return false;
		});
	}

	// Slide mobile info

	function slideMobileInfo(toggle, slide) {
		var $toggle = $(toggle),
			$slide = $(slide);
		$toggle.on("click", function (e) {
			$(this).parent().toggleClass('open');
			$slide.slideToggle(300).toggleClass('open');
		})
	}

	// Slide menu mobile

	function slideMobileMenu(windowW) {

		var toggler = '.navbar-toggle';
		var pagewrapper = '#pageContent';
		var footer = '.footer';
		var navigationwrapper = '.navbar-header';
		var menuwidth = '100%';
		var slidewidth = '80%';

		$("#slidemenu .slidemenu-close").on("click", function (e) {

			$('body').removeClass('modal-open');

			if ($('html').css('direction').toLowerCase() == 'rtl') {
				$('#slidemenu').stop().animate({
					right: menuneg
				});
			} else {
				$('#slidemenu').stop().animate({
					left: menuneg
				});
			}
		});

		$("#navbar").on("click", toggler, function (e) {

			$('body').addClass('modal-open');

			var selected = $(this).hasClass('slide-active');


			if ($('html').css('direction').toLowerCase() == 'rtl') {
				$('#slidemenu').stop().show().animate({
					right: selected ? menuneg : '0px'
				});
			} else {
				$('#slidemenu').stop().show().animate({
					left: selected ? menuneg : '0px'
				});
			}

		});
	}

	// Sticky Header

	function stickyHeaderIni(windowW) {

		var sticky = 0;

		var stickyHeader = function (windowW) {
			if ($('header.header--max.header--sticky').length && windowW > (menuBreakPoint - 1)) {
				sticky = new Waypoint.Sticky({
					element: $('header #slidemenu')[0],
					offset: -1
				})
			} else {
				if ($('header.header--sticky .navbar').length) {
					sticky = new Waypoint.Sticky({
						element: $('header .navbar')[0],
						offset: -1
					})
				}
			}
		}

		if ($('header').length) {
			if ($(document).scrollTop() > 150) {
				$('header .navbar').addClass('stuck--smaller');
			}
			stickyHeader(windowW);
		}


		$("body").on("touchend", function () {
			if ($(document).scrollTop() > 150) {
				if (!$('header .navbar').hasClass('stuck--smaller')) {
					setTimeout(function () {
						$('header .navbar').addClass('stuck--smaller');
					}, 300);
				}
			} else {
				$('header .navbar').removeClass('stuck--smaller');
			}
		});


		var waypoints = $('.no-touch header .navbar').waypoint(function (direction) {
			if (direction === 'down') {
				$('.no-touch header .navbar').addClass('stuck--smaller');
			}
		}, {
			offset: -350
		})
		var waypoints = $('.no-touch header .navbar').waypoint(function (direction) {
			if (direction === 'up') {
				$('.no-touch header .navbar').removeClass('stuck--smaller');
			}
		}, {
			offset: -350
		});

		$(window).resize(function () {

			var curW = window.innerWidth || $(window).width();

			if ($('header').length) {
				sticky.destroy();
				sticky = 0;
				stickyHeader(curW);
			}

			if ($(document).scrollTop() > 50) {
				$('header .navbar').addClass('stuck--smaller');
			}

		});

	}

	// Mobile footer collapse

	function footerCollapse() {
		$('.mobile-collapse__title').on('click', function (e) {
			e.preventDefault;
			$(this).parent('.mobile-collapse').toggleClass('open');
		})
	}

	// Parallax

	function parallaxIni() {
		if ($('.content--parallax').length) {
			$('.content--parallax').each(function () {
				var attr = $(this).attr('data-image');
				$(this).css({
					'background-image': 'url(' + attr + ')'
				}).parallax("50%", 0.01);
			})
		}

		if ($('.parallax').length) {
			$('.parallax').each(function () {
				var attr = $(this).attr('data-image');
				$(this).css({
					'background-image': 'url(' + attr + ')'
				}).parallax("50%", 0);
			})
		}
	}

	// Waypoint
	function onScrollInit(windowW, items) {
		var windowW = windowW;
		if (windowW > 991) {
			if (!$('body').data('firstInit')) {
				items.each(function () {
					var $element = $(this),
						animationClass = $element.attr('data-animation'),
						animationDelay = $element.attr('data-animation-delay');
					$element.removeClass('no-animate');
					$element.css({
						'-webkit-animation-delay': animationDelay,
						'-moz-animation-delay': animationDelay,
						'animation-delay': animationDelay
					});
					var trigger = $element;
					trigger.waypoint(function () {
						$element.addClass('animated').addClass(animationClass);
						if ($element.hasClass('hoveranimation')) {
							$element.on("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd", function () {
								$(this).removeClass("animated").removeClass("animation").removeClass(animationClass);
							});
						}
					}, {
						triggerOnce: true,
						offset: '90%'
					});
				});
				$('body').data('firstInit', true);
			}
		} else {
			items.each(function () {
				var $element = $(this);
				$element.addClass('no-animate');
			});
		}
	}

	// Post Isotope
	function setPostSize() {
		var windowW = window.innerWidth || $window.width(),
			itemsInRow = 1;
		if (windowW > 1199) {
			itemsInRow = 3;
		} else if (windowW > 767) {
			itemsInRow = 3;
		} else if (windowW > 480) {
			itemsInRow = 1;
		}
		var containerW = $postgallery.parent('.container').width() - 60,
			galleryW = containerW / itemsInRow;

		$postgallery.find('.blog-post').each(function () {
			if (windowW > 767) {
				if ($(this).hasClass('doubleW')) {
					$(this).css({
						width: galleryW * 2 + 30 + 'px',
					});
				} else {
					$(this).css({
						width: galleryW + 'px'
					});
				}
			} else {
				$(this).css({
					width: galleryW + 60 + 'px'
				});
			}
		});

		setTimeout(function () {
			$('.slick-initialized').slick('setPosition');
			$postgallery.isotope('layout');
		}, 100);
	}
	if ($('.blog-isotope').length) {
		var $postgallery = $('.blog-isotope');
		$postgallery.imagesLoaded(function () {
			setPostSize();
		});
		$postgallery.isotope({
			itemSelector: '.blog-post',
			masonry: {
				gutter: 30,
				columnWidth: '.blog-post:not(.doubleW)'
			}
		});
	}
	// Post More
	$('.view-more-post').on('click', function () {
		var item;
		var target = $(this).attr('data-load');
		$(this).hide();
		$.ajax({
			url: target,
			success: function (data) {
				$('#postPreload').append(data);
				if ($('.blog-isotope').length) {
					$('#postPreload > div').each(function () {
						item = $(this);
						$postgallery.append(item).isotope('appended', item);
						setPostSize();
					});
				}
			}
		});
	})

	// Testimonials More
	$('.view-more-testimonials').on('click', function () {
		var item;
		var target = $(this).attr('data-load');
		$(this).hide();
		$('#moreLoader').addClass('visible')
		$.ajax({
			url: target,
			success: function (data) {
				$('.testimonial-row-wrapper').append(data);
				$('#moreLoader').removeClass('visible')
			}
		});
	})

	//Isotope

	function isotopeGallery(gallery) {

		var gallery = $(gallery),
			$galerymoreShow = $('.js-more-gallery'),
			$galerymoreAjax = $('.view-more-gallery');

		if (gallery.length) {
			gallery.imagesLoaded(function () {
				gallery.isotope({
					itemSelector: '.gallery__item',
					masonry: {
						columnWidth: '.gallery__item:not(.doubleW)'
					}
				});
			})
		}

		$galerymoreShow.on('click', function (e) {
			gallery.addClass('all-showed').isotope('layout');
			$(this).remove();
			e.preventDefault();
		})

		$galerymoreAjax.on('click', function () {

			var item;
			var target = $(this).attr('data-load');

			$(this).hide();

			$.ajax({
				url: target,
				success: function (data) {
					$('#galleryPreload').append(data);

					$('#galleryPreload > div').each(function () {
						item = $(this);
						gallery.append(item).isotope('appended', item);
					});

				}
			});

		})
	}

	// Isotope Filters (for gallery)

	function isotopeFilters(gallery) {
		var gallery = $(gallery);
		if (gallery.length) {
			var container = gallery;
			var optionSets = $(".filters-by-category .option-set"),
				optionLinks = optionSets.find("a");
			optionLinks.on('click', function (e) {
				var thisLink = $(this);
				if (thisLink.hasClass("selected")) return false;
				var optionSet = thisLink.parents(".option-set");
				optionSet.find(".selected").removeClass("selected");
				thisLink.addClass("selected");
				var options = {},
					key = optionSet.attr("data-option-key"),
					value = thisLink.attr("data-option-value");
				value = value === "false" ? false : value;
				options[key] = value;
				if (key === "layoutMode" && typeof changeLayoutMode === "function") changeLayoutMode($this, options);
				else {
					container.isotope(options);
				}
				return false
			})
		}
	}

	// Gallery magnific Popup

	function galleryPopup(gallery) {
		var gallery = $(gallery);
		if (gallery.length) {
			$('a.btn', gallery).magnificPopup({
				type: 'image',
				gallery: {
					enabled: true
				}
			});
		}
	}

	// Icon Animation

	function iconAnimation(icon) {
		$(icon).on('mouseenter', function () {
			$(this).addClass('hovered');
		}).on('mouseleave', function () {
			var $this = $(this);
			setTimeout(function () {
				$this.removeClass('hovered');
			}, 500);
		});
	}

	// Services

	function slickServices(windowW, carousel) {
		if (windowW < 992) {
			if (!$(carousel).hasClass('slick-initialized')) {
				$(carousel).slick({
					infinite: true,
					autoplay: true,
					autoplaySpeed: 2000,
					arrows: false,
					dots: true,
					slidesToShow: 3,
					slidesToScroll: 1,
					responsive: [{
						breakpoint: 700,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 1,
						}
				}, {
						breakpoint: 479,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
						}
				}]
				});
			}
		} else {
			if ($(carousel).hasClass('slick-initialized')) {
				$(carousel).slick('unslick');
			}
		}
	}

	// Package

	function slickPackage(carousel) {
		$(carousel).slick({
			mobileFirst: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 2000,
			arrows: false,
			dots: false,
			responsive: [{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
					dots: true
				}
				}, {
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					dots: true
				}
				}]
		})
	}

	// Package

	function slickBlogPreviews(carousel) {
		$(carousel).slick({
			mobileFirst: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 2000,
			arrows: false,
			dots: false,
			responsive: [{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
          dots: true
				}
				}, {
				breakpoint: 479,
				settings: {
					slidesToShow: 1,
          dots: true
				}
				}]
		})
	}

	// Icon Circle

	function slickIconcircle(carousel) {
		$(carousel).slick({
			mobileFirst: false,
			slidesToShow: 5,
			slidesToScroll: 1,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 2000,
			arrows: false,
			dots: false,
			responsive: [{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
					dots: true
				}
			}, {
				breakpoint: 767,
				settings: {
					slidesToShow: 2,
					dots: true
				}
			}, {
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					dots: true
				}
			}]
		})
	}


	// testimomialsCarousel
	function testimonialCarousel(carousel) {
		$(carousel).slick({
			slidesToShow: 2,
			slidesToScroll: 1,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 2000,
			arrows: false,
			dots: true,
			responsive: [{
				breakpoint: 992,
				settings: {
					slidesToShow: 1
				}
			}]
		});
	}


	// post carousel
	function postCarousel(carousel) {
		$(carousel).slick({
			mobileFirst: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 2000,
			arrows: true,
			dots: false
		});
	}

	// double click fo touch devices

	function doubleTapIni(windowW) {
		$('.touch category-block__list a').doubleTapToGo();
		if (windowW > 767) {
			$('.touch ul.navbar-nav > li').each(function () {
				if ($(this).find('a').hasClass('dropdown-toggle')) {
					$(this).doubleTapToGo()
				}
			})
		}
	}

	// Add active class to opened accordion panel

	function panelActive(panel) {
		$(panel)
			.on('show.bs.collapse', function (e) {
				$(e.target).prev('.panel-heading').addClass('active');
			})
			.on('hide.bs.collapse', function (e) {
				$(e.target).prev('.panel-heading').removeClass('active');
			});
	}

	// Contact page form

	function contactForm(form) {
		var form = $(form);
		form.validate({
			rules: {
				name: {
					required: true,
					minlength: 2
				},
				message: {
					required: true,
					minlength: 20
				},
				email: {
					required: true,
					email: true
				}

			},
			messages: {
				name: {
					required: "Please enter your name",
					minlength: "Your name must consist of at least 2 characters"
				},
				message: {
					required: "Please enter message",
					minlength: "Your message must consist of at least 20 characters"
				},
				email: {
					required: "Please enter your email"
				}
			},
			submitHandler: function (form) {
				$(form).ajaxSubmit({
					type: "POST",
					data: $(form).serialize(),
					url: "process-contact.php",
					success: function () {
						$('#success').fadeIn();
						$('#contactform').each(function () {
							this.reset();
						});
					},
					error: function () {
						$('#contactform').fadeTo("slow", 0, function () {
							$('#error').fadeIn();
						});
					}
				});
			}
		});
	}

	function quoteForm(form) {
		if ($(form).length) {
			var $quoteForm = $(form);
			$quoteForm.validate({
				rules: {
					name: {
						required: true,
						minlength: 2
					},
					message: {
						required: true,
						minlength: 20
					},
					email: {
						required: true,
						email: true
					}

				},
				messages: {
					name: {
						required: "Please enter your name",
						minlength: "Your name must consist of at least 2 characters"
					},
					message: {
						required: "Please enter message",
						minlength: "Your message must consist of at least 20 characters"
					},
					email: {
						required: "Please enter your email"
					}
				},
				submitHandler: function (form) {
					var $this = $(form);
					$(form).ajaxSubmit({
						type: "POST",
						data: $(form).serialize(),
						url: "process-quote.php",
						success: function () {
							console.log($this)
							$('.successQuote', $this).fadeIn();
							$('.quote-form').each(function () {
								this.reset();
							});
						},
						error: function () {
							$('.quote-form').fadeTo("slow", 0, function () {
								$('.errorQuote', $this).fadeIn();
							});
						},
					});
				}
			});
		}
	}

	function rangePrice(range) {
		if ($(range).length) {
			var rangeSlider1 = document.getElementById('rangeSlider1');
			noUiSlider.create(rangeSlider1, {
				start: [100, 2000],
				connect: true,
				step: 100,
				padding: 100,
				range: {
					'min': 0,
					'max': 10100,
				}
			});
			var number1_1 = document.getElementById('number-1-1');
			var number1_2 = document.getElementById('number-1-2');
			rangeSlider1.noUiSlider.on('update', function (values, handle) {
				var value = values[handle];
				if (handle) {
					number1_1.textContent = Math.round(value);
				} else {
					number1_2.textContent = Math.round(value);
				}
			});
			number1_1.addEventListener('change', function () {
				rangeSlider1.noUiSlider.set([this.textContent, null]);
			});
			number1_2.addEventListener('change', function () {
				rangeSlider1.noUiSlider.set([null, this.textContent]);
			});
		}
	}

	// product gallery
	function productGallery(gallery) {
		if ($(gallery).length) {
			$(gallery).elevateZoom({
				gallery: 'productPreviews',
				cursor: 'pointer',
				galleryActiveClass: 'active',
				zoomWindowPosition: 1,
				zoomWindowFadeIn: 500,
				zoomWindowFadeOut: 500,
				lensFadeIn: 500,
				lensFadeOut: 500
			});
			var ezApi = $(gallery).data('elevateZoom');
			if ((window.innerWidth || $window.width()) < 769) {
				ezApi.changeState('disable');
			}
			$(window).on('resize', function () {
				if ((window.innerWidth || $window.width()) < 769) {
					ezApi.changeState('disable')
				} else {
					ezApi.changeState('enable');
				}
			})
			$('#productPreviews > a').on('click', function () {
				$(gallery).attr({
					src: $(this).attr('data-image'),
					'data-zoom-image': $(this).attr('data-zoom-image')
				})
			})
		}
	}

	// icrease/decrease input
	function changeInput() {
		$(document).on('click', '.count-add, .count-reduce', function (e) {
			var $this = $(e.target),
				input = $this.parent().find('.count-input'),
				v = $this.hasClass('count-reduce') ? (input.val() - 1) : (input.val() * 1 + 1),
				min = input.attr('data-min') ? input.attr('data-min') : 1;
			if (v >= min) input.val(v);
			e.preventDefault();
		});
	}

	// products carousel
	function prdCarousel(сarousel) {
		if ($(сarousel).length) {
			$(сarousel).slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: true,
				dots: false,
				arrows: true,
				responsive: [{
					breakpoint: 1299,
					settings: {
						dots: true,
						arrows: false
					}
					}, {
					breakpoint: 991,
					settings: {
						slidesToShow: 3
					}
					}, {
					breakpoint: 767,
					settings: {
						slidesToShow: 2
					}
					}, {
					breakpoint: 480,
					settings: {
						slidesToShow: 1
					}
					}]
			});
		}
	}

	function popupForm(link) {
		if ($(link).length) {
			$(link).on('click', function (e) {
				var $next = $(this).next(),
					$slide = $(this).closest('.slick-slide'),
					$slick = $(this).closest('.slick-list');
				if ($next.hasClass('opened')) {
					$next.removeClass('opened');
					$slide.removeClass('above');
					$slick.removeClass('visible');
				} else {
					$('.form-popup').each(function () {
						$(this).removeClass('opened');
						$slide.removeClass('above');
					});
					$next.addClass('opened');
					$slide.addClass('above');
					$slick.addClass('visible');
				}
				e.preventDefault();
			})
			$(document).on('click', function (event) {
				if (!$(event.target).closest('.form-popup-wrap').length) {
					if ($('.form-popup').hasClass("opened")) {
						$('.form-popup').removeClass('opened');
					}
					$('.slick-slide').removeClass('above');
					$('.slick-list').removeClass('visible');
				}
			})
			$('.form-popup-close').on('click', function (event) {
				if ($('.form-popup').hasClass("opened")) {
					$('.form-popup').removeClass('opened');
				}
				$('.slick-slide').removeClass('above');
				$('.slick-list').removeClass('visible');
			})
		}
	}
	// Header Cart dropdown menu
	function toggleCart(cart, drop) {
		$('> a', $(cart)).on('click', function () {
			$(cart).toggleClass('opened');
		});
		$(document).on('click', function (e) {
			if (!$(e.target).closest(cart).length) {
				if ($(cart).hasClass("opened")) {
					$(cart).removeClass('opened');
				}
			}
		})
	}

	function modalPopup(drop) {
		if ($(drop).length) {
			$(drop).magnificPopup({
				type: 'inline',
				midClick: true,
				removalDelay: 300,
				mainClass: 'mfp-fade'
			});
		}
	}

	// back to top
	function backToTop(button) {
		var $button = $(button);
		$(window).on('scroll', function () {
			if ($(this).scrollTop() >= 500) {
				$button.addClass('visible');
			} else {
				$button.removeClass('visible');
			}
		});
		$button.on('click', function () {
			$('body,html').animate({
				scrollTop: 0
			}, 1000);
		});
	}

	//Initialize fuctions & methods
	menuIni(windowW);
	slideMobileInfo('.js-info-toggle', '.header-info-mobile');
	slideMobileMenu(windowW);
	stickyHeaderIni(windowW);
	modalSearch();
	openSlidemenu();
	footerCollapse();
	parallaxIni();
	onScrollInit(windowW, $('.animation'));
	isotopeGallery('.gallery');
	isotopeFilters('.gallery');
	galleryPopup('#gallery');
	iconAnimation('.iconmove');
	panelActive('.panel-group');
	doubleTapIni(windowW);
	rangePrice('#rangeSlider1');
	changeInput();
	productGallery('#mainImage');
	toggleCart('.header-cart', '.header-cart-dropdown');
	backToTop('.back-to-top');
	if ($('.price-table').length) {
		$('.price-table').stacktable();
	}
	if ($('#contactform').length) {
		contactForm('#contactform');
	}
	if ($('.quote-form').length) {
		$('.quote-form').each(function () {
			quoteForm(this);
		});
	}
	// Carousel Initialization
	if ($('.iconcircle-wrap').length) {
		$('.iconcircle-wrap').imagesLoaded(function () {
			slickIconcircle('.iconcircle-wrap');
		})
	}
	if ($('.services-block').length) {
		$('.services-block').imagesLoaded(function () {
			slickServices(windowW, '.services-block');
		})
	}
	if ($('.post-carousel').length) {
		$('.post-carousel').imagesLoaded(function () {
			postCarousel('.post-carousel');
		})
	}
	if ($('.testimonials-style2-row').length) {
		$('.testimonials-style2-row').imagesLoaded(function () {
			testimonialCarousel('.testimonials-style2-row');
		})
	}
	if ($('.package-carousel').length) {
		$('.package-carousel').imagesLoaded(function () {
			slickPackage('.package-carousel');
		})
	}
	if ($('.blog-preview-carousel').length) {
		$('.blog-preview-carousel').imagesLoaded(function () {
			slickBlogPreviews('.blog-preview-carousel');
		})
	}
	prdCarousel('.prd-carousel');
  popupForm('.form-popup-link');
  modalPopup('.modal-popup-link');
  
	$(window).resize(debouncer(function (e) {
		var currentW = $(window).width();
		if (currentW != prevW) {
			// start resize events
			menuIni(currentW);
      onScrollInit(currentW, $('.animation'));
			if ($('.services-block').length) {
				slickServices(currentW, '.services-block');
			}
			if (currentW < (menuBreakPoint-1)) {
				$(".header--small #slidemenu").show().removeClass('open');
			} else {
				$(".header--small #slidemenu").hide()
			}
			if (currentW > (menuBreakPoint - 1)) {
				$('body').removeClass('modal-open');
				$('#slidemenu').stop().animate({
					left: menuneg
				});
			}
			if ($('.blog-isotope').length) {
				setPostSize();
			}
			// end resize events
		}
		prevW = window.innerWidth || $(window).width();
	}));
})