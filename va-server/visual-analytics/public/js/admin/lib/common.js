$(document).ready(function(){
	//location
	var onedepth = $('#oa_warper header ul li a.active').text();
	var twodepth = $('#oa_warper nav ul li a.active').text();
	$('#oa_warper .oa_location li:nth-child(1) a').html(onedepth);
	$('#oa_warper nav strong').html(onedepth);
	$('#oa_warper .oa_location li:nth-child(2) a').html(twodepth);

	//table_view
	$('.tb_ag22 td').not(':first-child').click(function(){
		$('.tb_ag22').next().next().hide();
		var activebox = $('.tb_ag22').next().next();
      	$(activebox).fadeIn(); 
      	return false;
	});

	//input_focus
	// $('.enableinput input').focusin(function(){
	// 	$(this).parent().addClass('ipfocus');
	// });
	// $('.enableinput input').focusout(function(){
	// 	$(this).parent().removeClass('ipfocus');
	// });
	// $( ".searchinput" ).wrap( $( ".searchinputbox" ) );
	// $('.searchinput input').focusin(function(){
	// 	$(this).parent().parent().addClass('ipfocus_b');
	// });
	// $('.searchinput input').focusout(function(){
	// 	$(this).parent().parent().removeClass('ipfocus_b');
	// });

	//gnb nav
	// $('header li a').click(function(){
	// 	$('header li a').removeClass('active');
	// 	$(this).addClass('active');
	// });
	$('nav a').click(function(){
		$('nav a').removeClass('active');
		$(this).addClass('active');
	});
	//page
	$('.page_box a').click(function(){
		$('.page_box a').removeClass('active');
		$(this).addClass('active');
	});	
	//top_btn
	$('.tp_btn').eq(0).find('a').click(function(){
		$('.tp_btn').eq(0).find('a').removeClass('active');
		$(this).addClass('active');
	});
	$('.tp_btn').eq(1).find('a').click(function(){
		$('.tp_btn').eq(1).find('a').removeClass('active');
		$(this).addClass('active');
	});
	$('.tp_btn').eq(2).find('a').click(function(){
		$('.tp_btn').eq(2).find('a').removeClass('active');
		$(this).addClass('active');
	});

	var component = null;
	
	$(window).click(function(){
		if(component){
			$(component).hide();
			component = null;
		}
	});
	
	$(".tp_cal .cmn_icon").bind("click", function(){
    	$(this).parent().find('input').focus();
    })
    
    $('table .cmn_icon').each(function(e){
    	//01_post_list.html에는 해당되지 않는다. 
    	if( !$(this).closest('table').hasClass('tb_ag02') ){
	    	$(this).closest('td').click(function(event){
	    		showLayerPopup( $(this).find('.ly_pop') );
	    		event.stopPropagation();
	    	})
    	}
    	
    	if( $(this).is( "span" )){
	    	$(this).click(function(event){
	    		showLayerPopup( $(this).next() );
	    		event.stopPropagation();
	    	})
    	}
    });
	
	$('table > thead .cmn_icon').click(function(event){
		showLayerPopup( $(this).next() );
		event.stopPropagation();
	});
	
	function showLayerPopup(newComp)
	{
		if(component){
			$(component).hide();
			component = null;
		}
		
		component = newComp;
		$(newComp).hover(
		  function() {
			  component = null;
		  }, function() {
			  component = this;
		  }
		)
		$(component).show();
	}

	$('.ly_pop .cmn_icon').click(function(){
		$(this).parent().parent().hide();
		component = $(this).parent().parent();
		$(this).next().hover(
		  function() {
			  component = null;
		  }, function() {
			  component = this;
		  }
		)
		event.stopPropagation();
	});
	$(".tb_st02.tb_ag04 tr .cmn_icon.dwbx").hide();


	$('.tb_st02.tb_ag04 tbody tr').hover(function() {
		$(".tb_st02.tb_ag04 tr .cmn_icon.dwbx").hide();
		$(this).find('.dwbx').show();
	  }, function() {
	  	$(".tb_st02.tb_ag04 tr .cmn_icon.dwbx").hide();
	  	$(this).find('.ly_pop').hide();
	  	component = null;
	  });

	// $('.tb_st02.tb_ag04 .dwbx').click(function(event){
	// 	$('.ly_pop').hide();
	// 	$(this).next().show();
	// 	event.stopPropagation();
	// });
	// $('.tb_st02.tb_ag04 td .ly_pop a').click(function(event){
	// 	$(this).parent().parent().parent().show();
	// 	event.stopPropagation();
	// });

	//slideToggle
	//$('.pop_tb ul li .tb_st02').hide();
	//$('.pop_tb ul li:first-child .tb_st02').show();
	//$('.pop_tb ul li:first-child .tbtt_box').addClass('active');
	$('.tbtt_box').click(function(){
		$(this).next().slideToggle(0).siblings(".tb_st02:visible").slideUp("fast");
		$(this).toggleClass("active").siblings(".tbtt_box.active").removeClass("active");
	});

	//cal 
	$('.t_tab a').click(function(){
		$('.t_tab a').removeClass('active');
		$(this).addClass('active');

	});

    $(".b_tabbox").eq(0).show(); 
    $("ul.t_tab li a").click(function() {
      $("ul.t_tab li a").removeClass("active"); 
      $(this).addClass("active"); 
     $(".l_tabbox").hide(); 
      var activeTab = $(this).attr("href");
      $(activeTab).fadeIn();
      return false;
    });
    $("ul.c_tab li a").click(function() {
      $("ul.c_tab li a").removeClass("active"); 
      $(this).addClass("active"); 
     $(".b_tabbox").hide(); 
      var activeTab = $(this).attr("href");
      $(activeTab).fadeIn(); 
      //$('.view_clo').change();
      return false;
    });

    //list_btn
	$('.chrbtn').click(function(){
	  $('.tb_listshow').hide();
	  $('.tb_schshow').show();
	  $('.tb_headview .tb_st02').css("display","none");
	});
	$('.tb_schshow_clo').click(function(){
	  $('.tb_listshow').show();
	  $('.tb_schshow').hide();
	  $('.tb_headview .tb_st02').css("display","table");
	});
	
	//scroll
	if( $(".container:has(div[class=tb_headview])").length > 0 ){
		var tb_show = $('.tb_show').height();//70;
		var thead = $(".tb_headview").find('.tb_st02 > thead').height();//35;
		var headviewpos = $(".tb_headview").find('.tb_st02').offset().top - tb_show - thead;
		
	    $(window).scroll(function(){ 
	      if($(window).scrollTop() >= headviewpos) { 
	        //$(".tb_headview .tb_show").show();
	        $(".tb_headview .tb_show").fadeIn(2);
	        $(window).resize(function(){
	          var width = parseInt($(this).width());
	          if (width < 1185) {
	        	  $(".tb_headview").css("position","fixed"); 
	              $(".tb_headview").css("top","0");
	              $(".tb_headview").css("left","280px");
	              $(".tb_headview").css("margin-left","0");
	              
	              //foot
	              $(".tb_choibox.active").css("position","fixed"); 
	              $(".tb_choibox.active").css("bottom","0");
	              $(".tb_choibox.active").css("left","280px");
	              $(".tb_choibox.active").css("margin-left","0");
				 // $(".tb_choibox.active").addClass("del");
				 // $(".tb_choinone").css("height","147px");
	              
	          } else if (width > 1185) {
	              $(".tb_headview").css("position","fixed"); 
	              $(".tb_headview").css("top","0");
	              $(".tb_headview").css("left","50%");
	              $(".tb_headview").css("margin-left","-310px");
	              
	              //foot
	              $(".tb_choibox.active").css("position","fixed"); 
	              $(".tb_choibox.active").css("bottom","0");
	              $(".tb_choibox.active").css("left","50%");
	              $(".tb_choibox.active").css("margin-left","-310px");
				//  $(".tb_choibox.active").addClass("del");
				//  $(".tb_choinone").css("height","147px");
	          }
	        }).resize();
	      } else {
	    	  
	        $(".tb_headview .tb_show").hide();
	        $(".tb_headview .tb_schshow").hide();
	        $(".tb_headview .tb_listshow").show();
	        $('.tb_headview .tb_st02').css("display","table");
	        $(window).resize(function(){
	          var width = parseInt($(this).width());
	          if (width < 1185) {
	            $(".tb_headview").css("position","relative"); 
	            $(".tb_headview").css("top",""); 
	            $(".tb_headview").css("left",""); 
	            $(".tb_headview").css("margin-left","");
	            //foot
	            $(".tb_choibox.active").css("position","absolute"); 
	            $(".tb_choibox.active").css("bottom",""); 
	            $(".tb_choibox.active").css("left",""); 
	            $(".tb_choibox.active").css("margin-left","");
				$(".tb_choibox.active").removeClass("del");
				$(".tb_choinone").css("height","40px");
	          } else if (width > 1185) {
	            $(".tb_headview").css("position","relative"); 
	            $(".tb_headview").css("top",""); 
	            $(".tb_headview").css("left",""); 
	            $(".tb_headview").css("margin-left","");
	            //foot
	            $(".tb_choibox.active").css("position","absolute"); 
	            $(".tb_choibox.active").css("bottom",""); 
	            $(".tb_choibox.active").css("left",""); 
	            $(".tb_choibox.active").css("margin-left","");
				$(".tb_choibox.active").removeClass("del");
				$(".tb_choinone").css("height","40px");
	          }
	        }).resize();
	      } 
	    });   
	  }

});

