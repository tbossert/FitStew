function jump_cd(){$("#whats").fadeIn(400);return false;var e=$("#message");setTimeout(function(){if(e.hasClass("top")||e.hasClass("clicked"))return false;e.animate({marginTop:"-=50"},200,function(){e.animate({marginTop:"+=50"},200,function(){e.animate({marginTop:"-=25"},200,function(){e.animate({marginTop:"50"},200,function(){e.removeAttr("style")})})})})},2500)}function err(e){e.stop(true,true).animate({opacity:0},300,function(){$(this).animate({opacity:1},300)})}function isValidEmail(e,t){if(!t)e=e.replace(/^\s+|\s+$/g,"");return/^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i.test(e)}function getRandomInt(e,t){return Math.floor(Math.random()*(t-e+1))+e}var ua=navigator.userAgent.toLowerCase();if(ua.indexOf("iphone")!=-1){window.addEventListener("load",function(){setTimeout(scrollTo,0,0,1)},false)}var lang={comm:{press:"Press Enter to subscribe",input_error:"Enter the valid email",thanks:"We will let you know!"}};var width;$(function(){var e="unknown";var t="unknown";$.getJSON("https://smart-ip.net/geoip-json?callback=?",function(n){e=n.city;t=n.region_name});$(".popup").click(function(e){var t=575,n=400,r=($(window).width()-t)/2,i=($(window).height()-n)/2,s=this.href,o="status=1"+",width="+t+",height="+n+",top="+i+",left="+r;window.open(s,"twitter",o);return false});width=$(window).width();$(window).on("resize",function(){width=$(window).width()});if(width>1024)jump_cd();$("#notice").text(lang.comm["press"]);$("#thanks").text(lang.comm["thanks"]);if($.browser.msie||$.browser.opera){var n=width>1024?120:100;$("#message > div.n > span.lable").css({marginTop:n})}$("#subscribe input").on({focus:function(){$("#social").animate({opacity:0},{duration:250,queue:false}).animate({marginTop:-32},{queue:false},function(){$(this).hide()});$("#notice").show().animate({opacity:1})},blur:function(){$("#social").show().animate({opacity:1},{duration:550,queue:false}).animate({marginTop:0},{queue:false});$("#notice").animate({opacity:0},function(){$(this).hide()})}});var r=true;$("input[name=email]").on("keyup change",function(){var e=$("input[name=email]").val();var t=!isValidEmail(e)&&e.length>0?false:true;$(this).data("valid",t);if(r==t)return false;if(t==false){r=false;$("#notice").animate({opacity:0},100,function(){$(this).text(lang.comm["input_error"]).animate({opacity:1},100)})}else{r=true;$("#notice").animate({opacity:0},100,function(){$(this).text(lang.comm["press"]).animate({opacity:1},100)})}});$("#subscribe").submit(function(){var n=$("input[name=email]");if(!n.data("valid")||n.val().length==0){err(n);return false}var r={};r["email"]=$("#email").val();r["city"]=e;r["state"]=t;jsonRegObj=JSON.stringify(r);$.ajax({beforeSend:function(e){},type:"POST",dataType:"json",contentType:"application/json",data:jsonRegObj,url:"https://www.fitstew.com/api/registerUser/",success:function(e){if(e.status=="success"){n.animate({marginTop:-35}).off();$("#social").show().animate({marginTop:0,opacity:1});$("#notice").animate({opacity:0},function(){$(this).hide()})}else err(n)}});return false})})