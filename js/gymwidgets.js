/* 
 * Implementation of the widgets and their functionalities
 */

//Configuration parameters
var ZUNEFIT_BASE_URL = "https://api.zunefit.com/api/";
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
       
        this.getGymWeekSchedule();
        this.getGymStat();
        this.getGymBal(); 
        this.getGymInfo(); 
        this.getSchedule();
        this.getAllClasses();
    }
    this.addType = function()
    {
        
        var add = $('#all_service').html();
      
         
    }
    this.search = function()
    {
        
        var add = $('#all_service').html();
      
         
    }
    this.save = function()
    {
        
        var add = $('#all_service').html();
      
         
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
                $("#g_zipcode").val(results.zipcode);
                $("#g_phone").val(results.phone);
                $("#g_email").val(results.email);
                $("#g_contact").val(results.contact);   
                $("#g_name").val(results.name);
                $("#g_rate").val(results.rate);
               
            
            },
            error:function(){
          
            }
        });
        
        
    }
    
    this.getAllClasses = function()
    {
        data = {};
        data['offset'] = 0;
        
        ZUNEFIT.postJSON({
            url:'getAllClasses/',
            data:data,
          
            success:function(response){
                try{
                    result10 = eval(response);
                    last = result10.length;
                    op= {};
                    opw=" <p class='underline_title'>Type</p><table ><tr>";
                
                    for(i=0;i<last;i++)
                    {                    
                        bool = true;
                        for(j=0;j<i;j++){
                            if(op[j] == result10[i].service) {
                                bool = false;
                            }
                        }
                        if(bool){
                            k=0;
                            op[k]= result10[i].service;
                            opw +="<td style='min-width:30px;'><input type='checkbox' name='"+i+"' id='"+i+"' class='group1' value="+result10[i].service+" style='float:right;'></td><td class='style_text'><label for='"+i+"'>"+result10[i].service+"</label></td>";
                            k++;
                            if(k%6 == 0){
                                opw +="</tr><tr>";
                            }
                        }
                             
                    }
                    opw +="</tr></table>";
                    $("#all_service").html(opw);
                }catch(e){
                   
                }
            },
            error:function(){
            //Error should be handle here
            // alert("no");  
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

                        schedule +="<table style = 'width:auto;'><tr><td class='bold'>Service</td><td class='bold'>:"+result15[i].service+"</td></tr><tr><td></td><td class='bold'>Price</td><td>:"+result15[i].price+"$</td></tr><tr><td></td><td class='bold'>Date</td><td>:"+result15[i].date+"</td></tr>";
                        schedule +="<tr><td></td><td class='bold'>Time</td><td>:"+result15[i].time+"</td></tr></table>";
                       
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
                    
                    $("#box-Services").html(services);
                    $("#box-Schedule").html(schedule);
                
                }catch(e){
                    
                }
            },
            error:function(){
                alert('no');
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
                            op1 += "<ul class='calender-link'><table><tr><td><li>"+result1[i].first_name+" "+result1[i].last_name+"</td><td><button>Checkin</button></td></tr></li>";
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
        $("#divexample1").niceScroll();
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
        var firstDate = firstDay.getFullYear() + "-" + (firstDay.getMonth()+1) + "-" + firstDay.getDate();
        
        var lastDay = new Date(mon.getFullYear(), mon.getMonth() + 1, 0);
        var lastDate = lastDay.getFullYear() + "-" + (lastDay.getMonth()+1) + "-" + lastDay.getDate();
        
        this.getGymSchedule(firstDate+" 00:00:00", lastDate+" 24:00:00");
        $(".inner-calender3").css("background-color","#565d60");
        $(".inner-calender2, .inner-calender1").css("background-color","transparent");
    }
    
    this.getGymDaySchedule = function()
    {
        var d = new Date();
        var strDate = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        //strDate = "2012-10-16";
        
        this.getGymSchedule(strDate+" 00:00:00", strDate+" 24:00:00");
        $(".inner-calender1").css("background-color","#565d60");
        $(".inner-calender2, .inner-calender3").css("background-color","transparent");
    }
    
    this.getGymWeekSchedule = function()
    {
        var curr = new Date; 
        var first = curr.getDate() - curr.getDay(); 
        var last = first + 6; 

        var firstday = new Date(curr.setDate(first));
        var lastday = new Date(curr.setDate(last));
        var startDate = firstday.getFullYear() + "-" + (firstday.getMonth()+1) + "-" + firstday.getDate();
        var endDate = lastday.getFullYear() + "-" + (lastday.getMonth()+1) + "-" + lastday.getDate();
        
        this.getGymSchedule(startDate+" 00:00:00", endDate+" 24:00:00");
       
        $(".inner-calender2").css("background-color","#565d60");
        $(".inner-calender1, .inner-calender3").css("background-color","transparent");
    }
    
    
    this.edit = function()
    {
        $("#pref_phone, #pref_email, #pref_firstName, #pref_lastName, #pref_address, #pref_city, #pref_state, #pref_zip").removeClass('transparent').addClass('round');
        $('#edit').css("display","none");
        $('#done').css("display","block");
        
$("#pref_phone, #pref_email, #pref_firstName, #pref_lastName, #pref_address, #pref_city, #pref_state, #pref_zip").removeAttr('readonly');
    }
    this.update = function()
    {
        $("#pref_phone, #pref_email, #pref_firstName, #pref_lastName, #pref_address, #pref_city, #pref_state, #pref_zip").attr('readonly','readonly');
        $('#done').css("display","none");
        $('#edit').css("display","block");
        $("#pref_phone, #pref_email, #pref_firstName, #pref_lastName,  #pref_address, #pref_city, #pref_state, #pref_zip").addClass('transparent').removeClass('round');
        data = {};
        data['first_name'] = $("#pref_firstName").val();
        data['last_name'] = $("#pref_lastName").val();
        data['address'] = $("#pref_address").val();
        data['email'] = $("#pref_email").val();
        data['phone'] = $("#pref_phone").val();
        data['city'] = $("#pref_city").val();
        data['state'] = $("#pref_state").val();
        data['zipcode'] = $("#pref_zip").val();
        data['gymid'] = $('#gid').val();
        
       
        
        
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