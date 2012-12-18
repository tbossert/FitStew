/* 
 * Implementation of the widgets and their functionalities
 */

//Configuration parameters
//var ZUNEFIT_BASE_URL = "https://api.zunefit.com/api/";
//Janrain API instance
var ZUNEFIT = new ZuneFit({
    url:ZUNEFIT_BASE_URL,
    start:function(){
        startAjax();
    },
    end:function(){
        endAjax();
    }
});

//Loading widgets
$(function(){
    this.widgets = new Widgets();
    this.widgets.init();
});  

/**
 *This function is calling when the ajax call is started
 */
var startAjax = function()
{
    div = $("#waiting");
    div.css({
        //top:(screen.height + $(document).scrollTop() - 100),
        bottom:10,
        right:10,
        position:'fixed'
    });
    div.show();
}

/**
 *This function is calling when the ajax call is end
 */
var endAjax = function()
{
    div = $("#waiting");
    div.hide();
    div.removeAttr("style");
}

var Widgets = function()
{
    /**
     * Initialize the widgets
     */
    this.init = function()
    {
        this.lb = new LoginBox("wsn", "msg");
        this.lb.bind();
        this.gim = new Gym();
        this.gim.bind();
       
       
        
    }
    
    this.login = function()
    {
        un = $('#username').val();
        pw = $('#password').val();
        this.lb.login(un, pw);     
    }
}


var LoginBox = function(formId,msgId)
{
    _fid = formId;
    _mid = msgId;
    /**
     * Bind fancybox
     */
    this.bind = function()
    {                   
        fb = $("#" + _fid);
        
        if(fb)
        {
            fb.fancybox({
                'scrolling'		: 'no',
                'titleShow'		: false,
                'onStart'               : function() {
                    
                },
                'onClosed'		: function() {
                    $("#" + _mid).hide();
                }
            });
        
            $("#username , #password").keyup(function(){
             
                $("#loginError").html("");    
             
            });
         
        }         
    }
    
    this.login = function(username,password)
    {
        if(!this.validate())
        {
            //Form is not valid
            return;
        }
        data = {};
        data["username"] = username;
        data["password"] = Sha1.hash(password);
        
        ZUNEFIT.postJSON({
            url:'gymLogin/',
            data:data,
            success:function(response){
                result = eval(response)[0];

                if(result.status == "success")
                {
                  
                    $("#token").val(result.token);
                    $("#frmOwnersLogin").submit();
                    return;
                }
                else
                {
                   
                    $("#loginError").html("Login incorrect");                    
                }                
            },
            error:function(){
          
            }
        })
    } 
    
    this.validate = function()
    {
        return $("#frmOwnersLogin").valid();
    }
    
}





var Gym = function()
{
    this.init = function()
    {
        this.bind();
    }
    
    this.bind = function()
    { 
       
      
        this.getGymStat();
        this.getGymBal(); 
        this.getGymInfo(); 
        this.getSchedule();
        this.allTags();
       
        this.delClass(12);
        this.getdisbursement();
        this.getDayclasses(new Date());
    
       
    }
    this.update_class = function(cid)
    {
        data = {};
        //  data['gymid'] = $('#gid').val();
        data['classid'] = cid;
        data['service'] = $('#up_class_name').val();
        data['price'] = $('#up_class_price').val();
        var date = new Date("2012-10-10 "+$('#up_class_mon').val()); 
       var dates = Date.UTC(
        date.getFullYear()
        , date.getMonth()
        , date.getDate()
        , date.getHours()
        , date.getMinutes()
        , date.getSeconds()
        , date.getMilliseconds()
    );
        
      //  alert(dates);
       // now = now.getUTCHours()+" "+ now.getUTCMinutes();
       
      //  alert(now);
        if($('#up_class_mon').val().length>0){
            now = new Date("2012-10-10 "+$('#up_class_mon').val()); 
            //var hrs = now.getUTCHours();
           // var min = now.getUTCMinutes();
            hrs = (now.getUTCHours() < 10) ? '0'+now.getUTCHours() : now.getUTCHours() ;
            min = (now.getUTCMinutes() < 10) ? '0'+now.getUTCMinutes() : now.getUTCMinutes() ;
            data['monday'] = hrs+":"+min;
        }
        data['monday']     = $('#up_class_mon').val().length>0 ? $('#up_class_mon').val()    : null;
        data['tuesday']     = $('#up_class_tue').val().length>0 ? $('#up_class_tue').val()    : null;
        data['wednesday']   = $('#up_class_wed').val().length>0 ? $('#up_class_wed').val()    : null;
        data['thursday']    = $('#up_class_thu').val().length>0 ? $('#up_class_thu').val()    : null;
        data['friday']      = $('#up_class_fri').val().length>0 ? $('#up_class_fri').val()    : null;
        data['saturday']    =$('#up_class_sat').val().length>0 ? $('#up_class_sat').val()     : null;
        data['sunday']      = $('#up_class_sun').val().length>0 ? $('#up_class_sun').val()    : null;
        ZUNEFIT.postJSON({
            url:'updateClass/',
            token : $('#token').val(),
            data : data,
            success:function(data){
                results = eval(data)[0];
                
               
              
            },
            error:function(){
          
            }
        });
    }
    
    this.getInfo = function(cid)
    {
        ZUNEFIT.getJSON({
            url:'getClass/'+cid,
           
            success:function(data){
                results = eval(data)[0];
               
               var mon = results.monday;
                        if(mon != null && mon != '00:00:00'){
                            var mons = new Date("October 13, 1975 "+mon+" UTC");
                            monH = mons.getHours();
                            monM = mons.getMinutes();
                            mon = monH +':'+ monM;
                            
                        }else mon = "00:00";
                        var tue = results.tuesday;
                        if(tue != null && tue != '00:00:00') {
                            var tues = new Date("October 13, 1975 "+tue+" UTC");
                            tueH = tues.getHours();
                            tueM = tues.getMinutes();
                            tue = tueH +':'+ tueM;
                            
                        }else tue = "00:00";
                        var wed = results.wednesday;
                        if(wed != null && wed != '00:00:00'){
                            var weds = new Date("October 13, 1975 "+wed+" UTC");
                            wedH = weds.getHours();
                            wedM = weds.getMinutes();
                            wed = wedH +':'+ wedM;
                            
                        }else wed = "00:00";
                        var thu = results.thursday;
                        if(thu != null && thu != '00:00:00'){
                            var thus = new Date("October 13, 1975 "+thu+" UTC");
                            thuH = thus.getHours();
                            thuM = thus.getMinutes();
                            thu = thuH +':'+ thuM;
                            
                        }else thu = "00:00";
                        var fri = results.friday;
                        if(fri != null && fri != '00:00:00'){
                            var fris = new Date("October 13, 1975 "+fri+" UTC");
                            friH = fris.getHours();
                            friM = fris.getMinutes();
                            fri = friH +':'+ friM;
                            
                        }else fri = "00:00";
                        var sat = results.saturday;
                        if(sat != null && sat != '00:00:00') {
                            var sats = new Date("October 13, 1975 "+sat+" UTC");
                            satH = sats.getHours();
                            satM = sats.getMinutes();
                            sat = satH +':'+ satM;
                            
                        }else sat = "00:00";
                        var sun = results.sunday;
                        if(sun != null && sun != '00:00:00'){
                            var suns = new Date("October 13, 1975 "+sun+" UTC");
                            sunH = suns.getHours();
                            sunM = suns.getMinutes();
                            sun = sunH +':'+ sunM;
                            
                        }else sun = "00:00";
                        
                        
                
                class_info ="<h1>Class Information</h1><table style = 'width:250px;float:left;line-height:30px;'><tr><td class='bold'>Service</td><td><input type='text' class= 'round' id='up_class_name' value='"+results.service+"'/></td></tr><tr><td class='bold'>Price</td><td><input type='text'  class= 'round' id='up_class_price' value='"+results.price+"'/></td></tr><tr><td class='bold'>Monday</td><td><input type='text' class= 'round sch' id='up_class_mon' value='"+mon+"'/></td></tr><tr><td class='bold'>Tuesday</td><td><input type='text' class= 'round sch' id='up_class_tue' value='"+tue+"'/></td></tr>";
                class_info +="<tr><td class='bold'>Wednesday</td><td><input type='text' class= 'round sch' id='up_class_wed' value='"+wed+"'/></td></tr><tr><td class='bold'>Thursday</td><td><input type='text' id='up_class_thu' class= 'round sch' value='"+thu+"'/></td></tr><tr><td class='bold'>Friday</td><td><input type='text' class= 'round sch' id='up_class_fri' value='"+fri+"'/></td></tr><tr><td class='bold'>Saturday</td><td><input type='text' id='up_class_sat' class= 'round sch'  value='"+sat+"'/></td></tr><tr><td class='bold'>Sunday</td><td><input class= 'round' type='text' id='up_class_sun' class= 'round sch' value='"+sun+"'/></td></tr></table>";
                class_info += "<div class='buttons' style='float:left;clear:both;' onclick='widgets.gim.update_class("+results.id+")'>Update</div>";
                $('#class_info').html(class_info);
                $('.sch').timepicker();
            },
            error:function(){
          
            }
        });
        data = {};
        data['start'] = $('#class_day').val()+' 00:00:00';
        data['end'] = $('#class_day').val()+' 24:00:00';      
        
        ZUNEFIT.postJSON({
            url:'gymSchedule/',
            data:data,
            token : $('#token').val(),
            success:function(data){
                $("#class_sched").html(" ");
                
               
            
                try{
                    result1 = eval(data);
                    finish1 = result1.length;
                    op1 = "<h1>List of Users</h1>";
                    op2 = "";
                    for(i=0;i<finish1;i++)
                    {       
                    
                        if(op2 == result1[i].date){
                            op1 += "<li><tr><td>"+result1[i].first_name+" "+result1[i].last_name+"</td><td><button>Checkin</button></td></tr></li>";
                        }else{
                            if(i!=0){
                                op1 += "</table></ul>";
                            }
                            op1 += "<h1>"+result1[i].date+"</h1>";
                            op1 += "<ul class='calender-link'><table><tr><td><li>"+result1[i].first_name+" "+result1[i].last_name+"</td></tr></li>";
                            op2 = result1[i].date;
                        }
                    
                    }
                    $("#class_sched").html(op1);
                
                }catch(ex){
                    $("#class_sched").html(" ");
                
                }
            
            },
            error:function(){
            //Error should be handle here
            // alert("no");  
            }
        });
    }
    this.getDayclasses = function(dates){
        data = {};
        date = new Date(dates)
        day = date.getDay();
        
        $('#class_day').val(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
        data['gymid']=$('#gid').val();
       
        days = {};
        days[0]="sunday";
        days[1] = "monday";
        days[2] = "Tuesday";
        days[3] = "Wednesday";
        days[4] = "Thursday";
        days[5] = "Friday";
        days[6] = "Saturday";
              
        data['day']= days[day];
        var d = days[day];
        ZUNEFIT.postJSON({
            url:'getDayClasses/',
            dataType:'jsonp',
            data :data,
            success:function(response){
               
                try{
                    schedules ="<table style = 'width:280px;float:left;line-height:30px;'>";
                   
                    result15 = eval(response);
                    end = result15.length;
                  
                    for(i=0;i<end;i++){
                      
                        if(result15[i].monday == "00:00:00" ||result15[i].Tuesday == "00:00:00"||result15[i].Wednesday == "00:00:00" ||result15[i].Thursday == "00:00:00"|| result15[i].Friday == "00:00:00" ||result15[i].Saturday == "00:00:00"||result15[i].sunday == "00:00:00"){
                          
                        }else{
                            schedules +="<tr><td class='bold'>Service</td><td>:"+result15[i].service+"</td><td><span onclick='widgets.gim.getInfo("+result15[i].id+")'><a  href = '#lightboxes' class='light' >select</a></span></td></tr>";

                        }
                    }
                   
                  
                    schedules +="</table>";
                    
                    
                    $(".inner-txt").html(schedules);
                }catch(e){
                    
                }
            },
            error:function(){
              
            }
        });
        
        
    }
    this.addclass = function()
    {
        data = {};
        data['gymid'] = $('#gid').val();
        data['service'] = $('#class_name').val();
        data['price'] = $('#class_price').val();
        if($('#class_mon').val().length>0){
            data['monday'] = $('#class_mon').val();
        }
     
        data['tuesday']     = $('#class_tue').val().length>0 ? $('#class_tue').val()    : null;
        data['wednesday']   = $('#class_wed').val().length>0 ? $('#class_wed').val()    : null;
        data['thursday']    = $('#class_thu').val().length>0 ? $('#class_thu').val()    : null;
        data['friday']      = $('#class_fri').val().length>0 ? $('#class_fri').val()    : null;
        data['saturday']    =$('#class_sat').val().length>0 ? $('#class_sat').val()     : null;
        data['sunday']      = $('#class_sun').val().length>0 ? $('#class_sun').val()    : null;
        ZUNEFIT.postJSON({
            url:'addClass/',
            token : $('#token').val(),
            data : data,
            success:function(data){
                results = eval(data);
                
                
              
            },
            error:function(){
          
            }
        });
        
        
    }
    this.getdisbursement = function()
    {
       
        ZUNEFIT.getJSON({
            url:'disbursement/',
            token : $('#token').val(),
           
            success:function(data){
                results = eval(data)[0];
                
                $( "#amounts" ).val( "$"+results.paylimit );
                $( "#slider-range-min" ).slider({
                    range: "min",
                    value: results.paylimit,
                    min: 0,
                    max: 9000,
                    step : 10,
                    slide: function( event, ui ) {
                        $( "#amounts" ).val( "$" + ui.value );
                    
                    }
                });
            },
            error:function(){
          
            }
        });
        
        
    }
    this.disbursement = function()
    {
        data = {};
        data['type']=1;
        data['paylimit']=$('#amounts').val().substr(1);
        
        ZUNEFIT.postJSON({
            url:'updateDisbursement/',
            token : $('#token').val(),
            data:data,
           
            success:function(data){
                results = eval(data);
                
                
              
            },
            error:function(){
          
            }
        });
        
        
    }
    this.image = function()
    {
        $('#head').hide();
        $('#image').show();
        
        
    }
    this.cancel = function()
    {
        $('#image').hide();
        $('#head').show();
      
        
        
    }
    this.delTag = function(id)
    {
        data = {};
        data['tid'] = id;
        
        
        $.ajax({
            type: 'DELETE',
            url: ZUNEFIT_BASE_URL+"deleteTag/",
            data: data,
            beforeSend : function(xhrObj) {
                xhrObj.setRequestHeader("ltype", "web");
            
                xhrObj.setRequestHeader("token", $('#token').val());
            
            },
            success: function(response){
                servicess = "<table>";
                servicessp = "<ul>"
                ZUNEFIT.getJSON({
                    url:'getTags/'+$('#gid').val(),
                    success:function(data){
                        results = eval(data);
                        end = results.length;
                        for(i=0;i<end;i++){
                   
                            servicess += '<tr><td>'+results[i].tag+'</td><td><img src="images/delete.png" onclick="widgets.gim.delTag('+results[i].id+')" /></td></tr> </li>';
                            servicessp += '<li>'+results[i].tag+'</li>';    
                        }
                        servicess += "</ul>";
                        servicessp += "</ul>";
                        $("#box-Services").html(servicessp);
                        $("#all_service").html(servicess);
              
                    },
                    error:function(){
          
                    }
                });
                
            }
        });
       
    }
    this.delClass = function(id)
    {
        data = {};
        data['classid'] = 9;
        //   data['gymid'] = 22;
        
        $.ajax({
            type: 'DELETE',
            url: ZUNEFIT_BASE_URL+"deleteClass/",
            data: data,
            beforeSend : function(xhrObj) {
                xhrObj.setRequestHeader("ltype", "web");
            
                xhrObj.setRequestHeader("token", $('#token').val());
            
            },
            success: function(response){
                result12 = eval(response)[0];
                alert(result12.status);
           
            }
        });
      
    }
   
    this.addType = function()
    {
        data = {};
        data['tag'] = $('#newServe').val();
        data['gymid'] = $('#gid').val();
        ZUNEFIT.postJSON({
            url:'addTag/',
            token : $('#token').val(),
            data : data,
            success:function(data){
                servicess = "<table>";
                servicessp = "<ul>"
                ZUNEFIT.getJSON({
                    url:'getTags/'+$('#gid').val(),
                    success:function(data){
                        results = eval(data);
                        end = results.length;
                        for(i=0;i<end;i++){
                   
                            servicess += '<tr><td>'+results[i].tag+'</td><td><img src="images/delete.png" onclick="widgets.gim.delTag('+results[i].id+')" /></td></tr> </li>';
                            servicessp += '<li>'+results[i].tag+'</li>';    
                        }
                        servicess += "</ul>";
                        servicessp += "</ul>";
                        $("#box-Services").html(servicessp);
                        $("#all_service").html(servicess);
              
                    },
                    error:function(){
          
                    }
                });
                
                
              
            },
            error:function(){
               
            }
        });
        
         
    }
    this.search = function()
    {
        
        var add = $('#all_service').html();
      
         
    }
    this.allTags = function()
    {
        
        servicess = "<table>";
        servicessp = "<ul>"
        ZUNEFIT.getJSON({
            url:'getTags/'+$('#gid').val(),
            success:function(data){
                results = eval(data);
                end = results.length;
                for(i=0;i<end;i++){
                   
                    servicess += '<tr><td>'+results[i].tag+'</td><td><img src="images/delete.png" onclick="widgets.gim.delTag('+results[i].id+')" /></td></tr> </li>';
                    servicessp += '<li>'+results[i].tag+'</li>';    
                }
                servicess += "</ul>";
                servicessp += "</ul>";
                $("#box-Services").html(servicessp);
                $("#all_service").html(servicess);
              
            },
            error:function(){
          
            }
        });
      
         
    }
    
    this.getGymInfo = function()
    {        
        ZUNEFIT.getJSON({
            url:'gymInfo/'+$('#gid').val(),
          
          
            success:function(data){
                results = eval(data)[0];
              
                $("#g_address").val(results.address);
                $("#g_city").val(results.city);
                $("#g_state").val(results.state);
                $("#g_zip").val(results.zipcode);
                
                $("#pref_address").val(results.address);
                $("#pref_city").val(results.city);
                $("#pref_state").val(results.state);
                $("#pref_zip").val(results.zipcode);
                
                $("#g_phone").val(results.phone);
                $("#g_email").val(results.email);
                $("#g_contact").val(results.contact);   
                $("#g_name").val(results.name);
                $("#pref_name").val(results.name);
                
                $("#g_rate").val(results.rate);
                $("#g_fb").val(results.facebook);
                $("#g_twt").val(results.twitter);
                $("#g_url").val(results.url);
                $("#im_old").val(results.image);
                image = '<a href="#" onclick="widgets.gim.image()"><img src="'+results.image+'" width="60" height="60" /></a>';
                $("#g_image").html(image);
                
               
               
            
            },
            error:function(){
          
            }
        });
        
       
        
        
    }
    
  
    this.getSchedule = function()
    {
    
        ZUNEFIT.getJSON({
            url:'getClasses/'+$('#gid').val(),
            dataType:'jsonp',
            success:function(response){
                try{
                    schedule ="";
                    services = "<ul class='searchResult'>";
                    result15 = eval(response);
                    end = result15.length;
                  
                    for(i=0;i<end;i++){
                        if(i!=0){
                            schedule += "<hr style='clear:both;'/>";
                        }

                        var mon = result15[i].monday;
                        if(mon != null && mon != '00:00:00'){
                            var mons = new Date("October 13, 1975 "+mon+" UTC");
                            monH = mons.getHours();
                            monM = mons.getMinutes();
                            mon = monH +':'+ monM;
                            
                        }else mon = "-";
                        var tue = result15[i].tuesday;
                        if(tue != null && tue != '00:00:00') {
                            var tues = new Date("October 13, 1975 "+tue+" UTC");
                            tueH = tues.getHours();
                            tueM = tues.getMinutes();
                            tue = tueH +':'+ tueM;
                            
                        }else tue = "-";
                        var wed = result15[i].wednesday;
                        if(wed != null && wed != '00:00:00'){
                            var weds = new Date("October 13, 1975 "+wed+" UTC");
                            wedH = weds.getHours();
                            wedM = weds.getMinutes();
                            wed = wedH +':'+ wedM;
                            
                        }else wed = "-";
                        var thu = result15[i].thursday;
                        if(thu != null && thu != '00:00:00'){
                            var thus = new Date("October 13, 1975 "+thu+" UTC");
                            thuH = thus.getHours();
                            thuM = thus.getMinutes();
                            thu = thuH +':'+ thuM;
                            
                        }else thu = "-";
                        var fri = result15[i].friday;
                        if(fri != null && fri != '00:00:00'){
                            var fris = new Date("October 13, 1975 "+fri+" UTC");
                            friH = fris.getHours();
                            friM = fris.getMinutes();
                            fri = friH +':'+ friM;
                            
                        }else fri = "-";
                        var sat = result15[i].saturday;
                        if(sat != null && sat != '00:00:00') {
                            var sats = new Date("October 13, 1975 "+sat+" UTC");
                            satH = sats.getHours();
                            satM = sats.getMinutes();
                            sat = satH +':'+ satM;
                            
                        }else sat = "-";
                        var sun = result15[i].time;
                        if(sun != null && sun != '00:00:00'){
                            var suns = new Date("October 13, 1975 "+sun+" UTC");
                            sunH = suns.getHours();
                            sunM = suns.getMinutes();
                            sun = sunH +':'+ sunM;
                            
                        }else sun = "-";
                        
                        
                        schedule +="<table class ='time' style = 'width:200px;float:left;'><tr><td class='bold'>Service</td><td>:"+result15[i].service+"</td><td style='width:10px;'></td><td class='bold'>Price</td><td>:"+result15[i].price+"$</td></tr></table><br/><table><tr><td class='bold'>Mon</td><td class='bold'>Tue</td><td class='bold'>Wed</td><td class='bold'>Thu</td><td class='bold'>Fri</td><td class='bold'>Sat</td><td class='bold'>Sun</td></tr><tr><td>"+mon+"</td><td>"+tue+"</td>";
                        
                        schedule +="<td>"+wed+"</td><td>"+thu+"</td><td>"+fri+"</td><td>"+sat+"</td><td>"+sun+"</td></tr></table>";
                    }
                    op= {};
                    for(i=0;i<end;i++)
                    {         
                        op[i]=result15[i].service;
                        bool = true;
                        for(j=0;j<i;j++){
                            if(op[j] == result15[i].service) {
                                bool = false;
                            }
                        }
                        if(bool){
                        
                         
                            services +="<li>"+result15[i].service+"</li>";
                        
                        }                           
                    }
                    services += "</ui>";
                    
                    // $("#box-Services").html(services);
                    $("#box-Schedule").html(schedule);
                
                }catch(e){
                    
                }
            },
            error:function(){
              
            }
        });
    }
    this.loadBox = function(id)
    {
        var div = [];
        div[0]='#box-description';
        div[1]='#box-Schedule';
      
        div[2]='#box-Services';
        
        for(i=0;i<3;i++){
            if(i==id)
                $(div[i]).css('display', 'block');
            else
                $(div[i]).css('display', 'none');
        }
    }   
    
    
    this.getGymSchedule = function(start,end)
    {
        data = {};
        data['start'] = start;
        data['end'] = end;        
        
        ZUNEFIT.postJSON({
            url:'gymSchedule/',
            data:data,
            token : $('#token').val(),
            success:function(data){
                $(".inner-txt").html(" ");
                
               
            
                try{
                    result1 = eval(data);
                    finish1 = result1.length;
                    op1 = "";
                    op2 = "";
                    for(i=0;i<finish1;i++)
                    {       
                    
                        if(op2 == result1[i].date){
                            op1 += "<li><tr><td>"+result1[i].first_name+" "+result1[i].last_name+"</td><td><button>Checkin</button></td></tr></li>";
                        }else{
                            if(i!=0){
                                op1 += "</table></ul>";
                            }
                            op1 += "<h1>"+result1[i].date+"</h1>";
                            op1 += "<ul class='calender-link'><table><tr><td><li>"+result1[i].first_name+" "+result1[i].last_name+"</td></tr></li>";
                            op2 = result1[i].date;
                        }
                    
                    }
                    $(".inner-txt").html(op1);
                
                }catch(ex){
                    $(".inner-txt").html(" ");
                
                }
            
            },
            error:function(){
            //Error should be handle here
            // alert("no");  
            }
        });
    }
    
    this.getGymStat = function()
    
    {   
        $('.sch').timepicker();
        
        $( ".datepicker" ).datepicker();
        $( ".datepicker" ).datepicker( "option", "dateFormat", "yy-mm-dd");
       
        $("a.light").live("click", function(event) {
            event.preventDefault();
            $(this).filter(':not(.fb)').fancybox()
            .addClass('fb');
            $(this).triggerHandler('click');
        });
        
        data = {};
        
        
        ZUNEFIT.getJSON({
            url:'gymStats/',
            data:data,
            token : $('#token').val(),
            success:function(response){
                try{
                    result2 = eval(response)[0];      
                    $("#owner-right-featured-box ul, .analytic-box ul").append('<li><a href="#">'+result2.visits +' visits/day</li>');
                    $("#owner-right-featured-box ul, .analytic-box ul").append('<li><a href="#">'+result2.views +' profile views Today</li>');
                    $("#owner-right-featured-box ul, .analytic-box ul").append('<li><a href="#"> Average Gym Rate $ '+ result2.price +'</li>');       
                }catch(e){
                    
                }
            },
            error:function(){
            //Error should be handle here
            }
        });
    }
    
    this.getGymBal = function()
    {
        data = {};
        
        ZUNEFIT.getJSON({
            url:'gymBalance/',
            data:data,
            token : $('#token').val(),
            success:function(response){
                try{
                    result3 = eval(response)[0];                
                    result3 = result3.balance;
                
                    $(".balance").html("Balance: $ "+  result3);
                }catch(e){
                    
                }
            },
            error:function(){
            //Error should be handle here
            }
        });
    }
    
    this.getGymMonthSchedule = function()
    {
        var mon= new Date();
        
        var firstDay = new Date(mon.getFullYear(), mon.getMonth() , 1);
        fday = (firstDay.getUTCDate() < 10) ? '0'+firstDay.getUTCDate() : firstDay.getUTCDate() ;
        var firstDate = firstDay.getUTCFullYear() + "-" + (firstDay.getUTCMonth()+1) + "-" + fday;
        
        var lastDay = new Date(mon.getFullYear(), mon.getMonth() + 1, 1);
        lday = (lastDay.getUTCDate() < 10) ? '0'+lastDay.getUTCDate() : lastDay.getUTCDate() ;
        var lastDate = lastDay.getUTCFullYear() + "-" + (lastDay.getUTCMonth()+1) + "-" + lday;
        
        this.getGymSchedule(firstDate+" 00:00:00", lastDate+" 24:00:00");
        $(".inner-calender3").css("background-color","#565d60");
        $(".inner-calender2, .inner-calender1").css("background-color","transparent");
    }
    
    this.getGymDaySchedule = function(date)
    {
        
       
        
        var d = new Date(date);
        fday = (d.getUTCDate() < 10) ? '0'+d.getUTCDate() : d.getUTCDate() ;
        var strDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1) + "-" + fday;
        //strDate = "2012-10-16";
        
        this.getGymSchedule(strDate+" 00:00:00", strDate+" 24:00:00");
        $(".inner-calender1").css("background-color","#565d60");
        $(".inner-calender2, .inner-calender3").css("background-color","transparent");
    }
    
    this.getGymWeekSchedule = function()
    {
        
        $( ".datepicker" ).datepicker();
        $( ".datepicker" ).datepicker( "option", "dateFormat", "yy-mm-dd");
        
        var curr = new Date; 
        var first = curr.getDate() - curr.getDay(); 
        var last = first + 6; 

        var firstday = new Date(curr.setDate(first)) ;
        fday = (firstday.getUTCDate() < 10) ? '0'+firstday.getUTCDate() : firstday.getUTCDate() ;
        var lastday = new Date(curr.setDate(last));
        lday = (lastday.getUTCDate() < 10) ? '0'+lastday.getUTCDate() : lastday.getUTCDate() ;
        var startDate = firstday.getUTCFullYear() + "-" + (firstday.getUTCMonth()+1) + "-" + fday;
        var endDate = lastday.getUTCFullYear() + "-" + (lastday.getUTCMonth()+1) + "-" + lday;
        
        this.getGymSchedule(startDate+" 00:00:00", endDate+" 24:00:00");
       
        $(".inner-calender2").css("background-color","#565d60");
        $(".inner-calender1, .inner-calender3").css("background-color","transparent");
    }
    
     
    this.edit = function()
    {
        $("#g_phone, #g_email, #g_name, #g_rate, #g_address, #g_city, #g_state, #g_zip, #g_fb, #g_twt, #g_contact, #g_url").removeClass('transparent').addClass('round');
        $('#g_edit').css("display","none");
        $('#g_done').css("display","block");
        
        $("#g_phone, #g_email, #g_name, #g_address, #g_city, #g_state, #g_rate, #g_zip, #g_fb, #g_twt,#g_contact, #g_url").removeAttr('readonly');
    }
    this.update = function()
    {
        $("#g_phone, #g_email, #g_name, #g_rate, #g_address, #g_city, #g_state, #g_zip, #g_fb, #g_twt,#g_contact, #g_url").attr('readonly','readonly');
        $('#g_done').css("display","none");
        $('#g_edit').css("display","block");
        $("#g_phone, #g_email, #g_name, #g_rate, #g_address, #g_city, #g_state, #g_zip, #g_fb, #g_twt,#g_contact, #g_url").addClass('transparent').removeClass('round');
        data = {};
        data['name'] = $("#g_name").val();
        data['rate'] = $("#g_rate").val();
        data['address'] = $("#g_address").val();
        data['email'] = $("#g_email").val();
        data['phone'] = $("#g_phone").val();
        data['city'] = $("#g_city").val();
        data['contact'] = $("#g_contact").val();
        data['state'] = $("#g_state").val();
        data['zipcode'] = $("#g_zip").val();
        data['gymid'] = $('#gid').val();
        
        data['facebook'] = $('#g_fb').val();
        data['twitter'] = $('#g_twt').val();
        data['image'] = $('#im_old').val();
        data['url'] = $('#g_url').val();
        ZUNEFIT.postJSON({
            url:'updateGymProfile/',
            data:data,               
            token : $('#token').val(),
          
            success:function(response){
               
               
            },
            error:function(){
            //Error should be handle here
            // alert("no");  
            }
            
        });
    }
}