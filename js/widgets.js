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
        this.user = new User();
        this.user.bind();
        this.lb2 = new Box("light", "Box");
        this.lb2.bind();
       
        
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
                //There is an issue in firefox.data reprecents as a string.Need to use eval() 1st
                result = eval(response)[0];

                if(result.status == "success")
                {
                    //Login success.Redirect to the owners home page
                    $("#token").val(result.token);
                    $("#frmOwnersLogin").submit();
                    return;
                }
                else
                {
                    //Login failed.Show error message 
                    $("#loginError").html("Login incorrect");                    
                }                
            },
            error:function(){
            //Error should be handle here
            }
        })
    } 
    
    this.validate = function()
    {
        return $("#frmOwnersLogin").valid();
    }
    
}

var Box = function(formId,msgId)
{
    _fid2 = formId;
    _mid2 = msgId;
    /**
     * Bind fancybox
     */
    this.bind = function()
    {                   
        fb2 = $("." + _fid2);
        
        if(fb2)
        {
            fb2.fancybox({
                'scrolling'		: 'no',
                'titleShow'		: false,
                'onStart'               : function() {
                    
                },
                'onClosed'		: function() {
                    $("#" + _mid2).hide();
                }
            });
        
            
         
        }         
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
        
    }
    
    this.addType = function()
    {
        alert("add");
    }
    
    this.profile = function()
    {
         
        $('#gallery').lightBox();


     
           
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
                
                result1 = eval(data);
            
                try{
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
        data = {};
        
        
        ZUNEFIT.getJSON({
            url:'gymStats/',
            data:data,
            token : $('#token').val(),
            success:function(response){
                result2 = eval(response)[0];      
                $("#owner-right-featured-box ul, .analytic-box ul").append('<li><a href="#">'+result2.visits +' visits/day</li>');
                $("#owner-right-featured-box ul, .analytic-box ul").append('<li><a href="#">'+result2.views +' profile views Today</li>');
                $("#owner-right-featured-box ul, .analytic-box ul").append('<li><a href="#"> Average Gym Rate $ '+ result2.price +'</li>');       
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
                result3 = eval(response)[0];                
                result3 = result3.balance;
                
                $(".balance").html("Balance: $ "+  result3);
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
    }
    
    this.getGymDaySchedule = function()
    {
        var d = new Date();
        var strDate = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        //strDate = "2012-10-16";
        
        this.getGymSchedule(strDate+" 00:00:00", strDate+" 24:00:00");
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
    }
    
    
    
}
var User = function()
{
    this.init = function()
    {
        this.bind();
    }
    
    this.bind = function()
    { 
      
        this.getFeaturedGyms();
        this.getUserBalance();
        this.getUserWeekSchedule();
        this.slider();
        this.getUserPreferences();
        this.getFeaturedWorkots();
       
       
    }
    
    this.slider = function()
    {
        $(function() {
            $( "#slider-range-min" ).slider({
                range: "min",
                value: 3,
                min: 1,
                max: 500,
                slide: function( event, ui ) {
                    $( "#amount" ).val( "$" + ui.value );
                }
            });
            $( "#amount" ).val( "$" + $( "#slider-range-min" ).slider( "value" ) );
        });
    }
    
    
    
    this.getFeaturedWorkots = function()
    {
        ZUNEFIT.getJSON({
            url:'featuredGyms/',
            success:function(data){
                result4 = eval(data);
                op="<ul>";
                finish = 5;
                if(result4.length < 5 ){
                    finish = result4.length
                }
                for(i=0;i<finish;i++)
                {       
                    op += "<li><a href='#'>"+result4[i].name+"</a></li>";
                }
                op +="</ul>";
                $("#featuredGymsBox").html(op);
            },
            error:function(){
            //Error should be handle here
            }
        });
    }
    
    this.getUserBalance = function()
    {
        data = {};  
        
        ZUNEFIT.getJSON({
            url:'balance/',
            data: data,
            token : $('#utoken').val(),
            success:function(response){
               
                result5 = eval(response)[0];                
                res = result5.balance;
                //alert("bal"+response);
                $(".balance-box").html("Balance: $ "+  res);
            },
            error:function(){
            //Error should be handle here
            
            //alert("error bal")
            }
        });
    }
    
    this.getUserPreferences = function()
    {
        data = {};
       
        ZUNEFIT.getJSON({
            url:'userPreferences/',
            token : $('#utoken').val(),
            success:function(data){
                result6 = eval(data)[0];                
                
                $("#email").val(result6.email);
                $("#firstName").val(result6.first_name);
                $("#lastName").val(result6.last_name);
                $("#address").val(result6.address);
                $("#city").val(result6.city);
                $("#state").val(result6.state);
                $("#zipcode").val(result6.zipcode);
                
                
            },
            error:function(){
            //Error should be handle here
            
            //alert("error pref")
            }
        });
    }
    this.loadLeft = function(id)
    {
        var div = [];
        div[0]='#infoBox';
        div[1]='#searchbox';
        div[2]='#preferences';
        for(i=0;i<3;i++){
            if(i==id)
                $(div[i]).css('display', 'block');
            else
                $(div[i]).css('display', 'none');
        }
    }
    
    this.search = function(id)
    {
       
        var div = [];
        div[0]='#search';
        div[1]='#advSearch';
        
        for(i=0;i<2;i++){
            if(i==id)
                $(div[i]).css('display', 'block');
            else
                $(div[i]).css('display', 'none');
        }
    }
    
    this.preferencesBilling = function(id)
    {
        var div = [];
        div[0]='#preference';
        div[1]='#billing';
        
        for(i=0;i<2;i++){
            if(i==id)
                $(div[i]).css('display', 'block');
            else
                $(div[i]).css('display', 'none');
        }
    }
    
    this.loadBox = function(id)
    {
        var div = [];
        div[0]='#box-description';
        div[1]='#box-Schedule';
        div[2]='#box-Rate';
        div[3]='#box-Services';
        
        for(i=0;i<5;i++){
            if(i==id)
                $(div[i]).css('display', 'block');
            else
                $(div[i]).css('display', 'none');
        }
    }
    
    this.reoccur = function()
    {
       
        if ($('#reoccuring').is(':checked')) {
            $('#occur').removeAttr('disabled');
        } else {
             $('#occur').attr('disabled', 'disabled');
        }
   
    }
    
    
    this.getUserDaySchedule = function()
    {
        var d = new Date();
        var strDate = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        //strDate = "2012-10-16";
        
        this.getUserSchedule(strDate+" 00:00:00", strDate+" 24:00:00");
    }
    
    this.getUserWeekSchedule = function()
    {
        var curr = new Date; 
        var first = curr.getDate() - curr.getDay(); 
        var last = first + 6; 

        var firstday = new Date(curr.setDate(first));
        var lastday = new Date(curr.setDate(last));
        var startDate = firstday.getFullYear() + "-" + (firstday.getMonth()+1) + "-" + firstday.getDate();
        var endDate = lastday.getFullYear() + "-" + (lastday.getMonth()+1) + "-" + lastday.getDate();
        
        this.getUserSchedule(startDate+" 00:00:00", endDate+" 24:00:00");
    }
    
    this.getUserMonthSchedule = function()
    {
        var mon= new Date();
        
        var firstDay = new Date(mon.getFullYear(), mon.getMonth() , 1);
        var firstDate = firstDay.getFullYear() + "-" + (firstDay.getMonth()+1) + "-" + firstDay.getDate();
        
        var lastDay = new Date(mon.getFullYear(), mon.getMonth() + 1, 0);
        var lastDate = lastDay.getFullYear() + "-" + (lastDay.getMonth()+1) + "-" + lastDay.getDate();
        
        this.getUserSchedule(firstDate+" 00:00:00", lastDate+" 24:00:00");
    }
    
    this.getUserSchedule = function(start,end)
    {
        //alert(start);
        //alert(end);
        data = {};
        data['start'] = start;
        data['end'] = end;
        
        
        ZUNEFIT.postJSON({
            url:'userSchedule/',
            data:data,
            token : $('#utoken').val(),
            success:function(response){
                result7 = eval(response)[0];
                $(".inner-txt").html(result7);
            //alert(result1);        
            },
            error:function(){
            //Error should be handle here
            // alert("no");  
            }
        });
    }
    
    this.getFeaturedGyms = function()
    {
        ZUNEFIT.getJSON({
            url:'featuredWorkouts/',
            success:function(response){
                result8 = eval(response);
                //alert(result8[0].service);
                op="<ul>";
                finish = 5;
                if(result8.length < 5 ){
                    finish = result8.length
                }
               
                for(i=0;i<finish;i++)
                {       
                    $(".user-item-link").append('<li><a href="#">'+result8[i].service +'</li>');
                    
                }
                
            },
            error:function(){
            //Error should be handle here
            }
        });
    }
    
    this.searchMe = function()
    {
        data = {};
        if($('input[name=searchRadio]:checked').val()== "activity"){
            data['workouts'] = $('#searchkey').val();
        }else{
            data['another'] = $('#searchkey').val();
        }
        
       
        
        
        ZUNEFIT.postJSON({
            url:'gymSearchAdvanced/',
            data:data,
          
            success:function(response){
                result9 = eval(response)[0];
                $("#search-result").html(result9);
            //alert(result1);        
            },
            error:function(){
            //Error should be handle here
            // alert("no");  
            }
        });
       
    }
        
}
