$(function() {
    // if ($(window).width() > 767) {
    //     $('#myVideo').attr('poster','assets/images/aplenty-poster.jpg');
    //     $('#myVideo').attr('src','assets/images/aplentya.mp4');
    // }
    // else{
    //     $('#myVideo').attr('poster','assets/images/aplenty-posters.jpg');
    //     $('#myVideo').attr('src','assets/images/aplenty.mp4');
    // }
    $('#homebanner').carousel({ interval: false });
    $('.homebvslider').owlCarousel({
        loop:true,
        autoplayHoverPause:true,
        dots:false,
        nav:true,
		autoplay:true,
		autoplayTimeout: 3000,
        navText:['<svg viewBox="0 0 64 64"><path d="m54 30h-39.899l15.278-14.552c.8-.762.831-2.028.069-2.828-.761-.799-2.027-.831-2.828-.069l-17.448 16.62c-.755.756-1.172 1.76-1.172 2.829 0 1.068.417 2.073 1.207 2.862l17.414 16.586c.387.369.883.552 1.379.552.528 0 1.056-.208 1.449-.621.762-.8.731-2.065-.069-2.827l-15.342-14.552h39.962c1.104 0 2-.896 2-2s-.896-2-2-2z"/></svg>','<svg viewBox="0 0 64 64"><path d="m37.379 12.552c-.799-.761-2.066-.731-2.827.069-.762.8-.73 2.066.069 2.828l15.342 14.551h-39.963c-1.104 0-2 .896-2 2s.896 2 2 2h39.899l-15.278 14.552c-.8.762-.831 2.028-.069 2.828.393.412.92.62 1.448.62.496 0 .992-.183 1.379-.552l17.449-16.62c.756-.755 1.172-1.759 1.172-2.828s-.416-2.073-1.207-2.862z"/></svg>'],
        responsive:{
            0:{
                items:1,
                margin:0
            },
            600:{
                items:2,
                margin:30
            },
            1000:{
                items:3,
                margin:50
            }
        }
    });
    $('.bv-slider').owlCarousel({
        loop:true,
        dots:false,
        autoplayHoverPause:true,
        autoplay:true,
        nav:true,
        navText:['<svg viewBox="0 0 64 64"><path d="m54 30h-39.899l15.278-14.552c.8-.762.831-2.028.069-2.828-.761-.799-2.027-.831-2.828-.069l-17.448 16.62c-.755.756-1.172 1.76-1.172 2.829 0 1.068.417 2.073 1.207 2.862l17.414 16.586c.387.369.883.552 1.379.552.528 0 1.056-.208 1.449-.621.762-.8.731-2.065-.069-2.827l-15.342-14.552h39.962c1.104 0 2-.896 2-2s-.896-2-2-2z"/></svg>','<svg viewBox="0 0 64 64"><path d="m37.379 12.552c-.799-.761-2.066-.731-2.827.069-.762.8-.73 2.066.069 2.828l15.342 14.551h-39.963c-1.104 0-2 .896-2 2s.896 2 2 2h39.899l-15.278 14.552c-.8.762-.831 2.028-.069 2.828.393.412.92.62 1.448.62.496 0 .992-.183 1.379-.552l17.449-16.62c.756-.755 1.172-1.759 1.172-2.828s-.416-2.073-1.207-2.862z"/></svg>'],
        responsive:{
            0:{
                items:1,
                margin:0
            },
            600:{
                items:2,
                margin:30
            },
            1000:{
                items:3,
                margin:50
            }
        }
    });
    $('.carouselbrand').carousel({
        interval: false,
      });
    
    
	$(".prettygallery a[rel^='prettyPhoto']").prettyPhoto({
		animation_speed: 'fast',
		theme: 'light_square',
		horizontal_padding: 0,
		markup: '<div class="pp_pic_holder"> \
					<div class="ppt">&nbsp;</div> \
					<div class="pp_top"> \
					</div> \
					<div class="pp_content_container"> \
						<div class="pp_left"> \
						<div class="pp_right"> \
							<div class="pp_content"> \
								<div class="pp_loaderIcon"></div> \
								<div class="pp_fade"> \
									<a href="#" class="pp_expand" title="Expand the image">Expand</a> \
									<div class="pp_hoverContainer"> \
										<a class="pp_next" href="#">next</a> \
										<a class="pp_previous" href="#">previous</a> \
									</div> \
									<div id="pp_full_res"></div> \
									<div class="pp_details"> \
										<div class="pp_nav"> \
											<a href="#" class="pp_arrow_previous">Previous</a> \
											<p class="currentTextHolder">0/0</p> \
											<a href="#" class="pp_arrow_next">Next</a> \
										</div> \
										<a target="_blank" href="javascript:void(0);" class="pp_description"></a> \
										{pp_social} \
										<a class="pp_close" href="#">Close</a> \
									</div> \
								</div> \
							</div> \
						</div> \
						</div> \
					</div> \
					<div class="pp_bottom"> \
					</div> \
				</div> \
				<div class="pp_overlay"></div>',
		gallery_markup: '<div class="pp_gallery"> \
							<a href="#" class="pp_arrow_previous">Previous</a> \
							<div> \
								<ul> \
									{gallery} \
								</ul> \
							</div> \
							<a href="#" class="pp_arrow_next">Next</a> \
						</div>',
		image_markup: '<img id="fullResImage" src="{path}" />'
	});
    new WOW().init();
});
$(window).on('scroll load', function() {
    if ($("header").offset().top > 60) {
        $(".fixed-top").addClass("top-nav-collapse");
    } else {
        $(".fixed-top").removeClass("top-nav-collapse");
    }
});
$(window).on('scroll load', function() {  
    var scroll = $(window).scrollTop();
    if (scroll >= 300) {
        $(".sticky-header").addClass("stable");
    } else {
        $(".sticky-header").removeClass("stable");
    }
});
$(document).on('click','.langdrop a', function(){
    $(this).addClass('active').siblings('a').removeClass('active');
})
var counted = 0;
$(window).scroll(function() {  

});
$(document).on('click','.bcarouselind .carousel-indicators li', function(){
    $(this).addClass('active').siblings('li').removeClass('active');
    $(this).closest('.tab-pane').siblings().find('li').removeClass('active');
});

function addHyperlink(http, thislink){
	var complink = http+'://'+thislink;
	if(http == '' && thislink ==''){
		setTimeout(() => {
			$('.pp_description').removeAttr('href');
		}, 500);
	} else {
		setTimeout(() => {
			$('.pp_description').attr('href',complink);
		}, 500);
	}
	console.log(complink);
}