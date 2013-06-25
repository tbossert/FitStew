

var schedjson = jQuery.parseJSON('[ {"id" : 385,"name" : "Kennedy Fitness","classid" : 21,"service" : "Yoga","duration" : 30,"datetime" : "2013-01-22T22:30:00.000Z"}, {"id" : 6,"name" : "24 Hours","classid" : 1,"service" : "Karate","duration" : 60,"datetime" : "2013-01-23T02:00:00.000Z"},{"id" : 388,"name" : "Kennedy Fitness","classid" : 24,"service" : "Kick Boxing","duration" : 30,"datetime" : "2013-01-23T06:30:00.000Z"}]');
var wkNum = 0;


function box() {
	$('.ant').on('click', function(e){
		$(".ant").fancybox({
			maxWidth	: 600,
			maxheight	: 500,
			margin		: 0,
			padding		: 0,
			arrows		: false,
			fitToView	: false,
			width		: '70%',
			height		: '70%',
			autoSize	: false,
			closeClick	: false,
			openEffect	: 'none',
			closeEffect	: 'none'
		});
	});
}

function byDay() {
	var today = moment().format("MMMM YYYY");
	var dayCount = 2;
	var dates = new Array();

	dates.push(moment().format('DD'));

	$('#daycal').empty();

	for(var d = 0;d < dates.length;d++)
	{
		if(dayCount < 2)
		{
			var divTag = document.createElement("div");
			divTag.id = dates[d];
			divTag.className = "dayp";
			document.getElementById('week').appendChild(divTag);
			var dayTag = document.createElement("div");
			a = "bar";
			b = a.concat(dates[d]);
			dayTag.id = b
			dayTag.className = "daybar";
			dayTag.innerHTML = dates[d];
			document.getElementById(dates[d]).appendChild(dayTag);
			dayCount++;
			var dotTag = document.createElement("div");
			dotTag.className = "dots";
			dotTag.innerHTML = '<ul><li class="yellow"></li><li class="green"></li></ul>';
			document.getElementById(b).appendChild(dotTag);
			var slideTag = document.createElement("div");
			slideTag.className = "sopen";
			slideTag.innerHTML = '<ul><li class="yellow l1 a0"><p>09:00AM Karate</p></li><li class="green l1 a0"><p>1:00PM Yoga</p></li></ul>';
			document.getElementById(b).appendChild(slideTag);
		} else {
			dayCount = 1;
			var divTag = document.createElement("div");
			divTag.id = 'week';
			divTag.className = 'week';
			document.getElementById("daycal").appendChild(divTag);
			d = d-1;
		}
	}
	document.getElementById('calDate').innerHTML = today;
}

function byWeek(wkNum,type) {
	var week = moment().add('weeks', wkNum)
	var today = moment(week).format("MMMM YYYY");
	var daysinweek = 6;
	var dayCount = 8;
	var daysCount = 0;
	var dayofweek = moment(week).format('d');
	var prevCount = moment(week).subtract('days', 1).format('d');
	var sdayofweek = moment(week).subtract('days', dayofweek-1).format("YYYY-MM-DD HH:mm");
	var edayofweek = moment(sdayofweek).add('days', 7).format("YYYY-MM-DD HH:mm");
	var days = 0;
	var dates = new Array();

    //var data = {};
    //data = '{"start": "2012-12-04 00:00:00", "end": "2012-12-11 00:00:00"}';


    /*FITSTEW.postJSON({
        url:'userSchedule/',
        data:data,
        token : "5L7VPPmFunIrQ8GCDVG30N5dcJ_f9j4Hgqm28PjVqOkqzLuEVvjg-U_6PU4VoLL4",
        success:function(response){
            response1 = eval(response);
            var len = response1.length;
            for(i=0;i<len;i++){
            	alert(result1[i].id);
            }
        }
    });*/
	
	var unique = function(origArr) {
	    var newArr = [],
	        origLen = origArr.length,
	        found,
	        x, y;
	    for ( x = 0; x < origLen; x++ ) {
	        found = undefined;
	        for ( y = 0; y < newArr.length; y++ ) {
	            if ( origArr[x] === newArr[y] ) {
	              found = true;
	              break;
	            }
	        }
	        if ( !found) newArr.push( origArr[x] );
	    }
	   return newArr;
	};
	



	while(prevCount > 0) {
		dates.push(moment(week).subtract('days', prevCount).format('YYYY-MM-DD'));
		prevCount = prevCount-1;
	}

	while(dates.length <= daysinweek) 
	{
		dates.push(moment(week).add('days', daysCount).format('YYYY-MM-DD'));
		daysCount++;
	}
	console.log(dates);
	
	$('#'+type.concat('CalDate')).empty();
	$('#'+type.concat('Daycal')).empty();

	var colors = Array("red","green","blue","yellow");

	var c = 0;
	var gnames = new Array();
	var ugnames = {};
	$.each(schedjson, function(key, value) {
		gnames.push(value.name);
	});
	console.log(gnames);
	var gunames = unique(gnames);

	for(var g = 0;g < gunames.length;g++) {
		ugnames[gunames[g]] = colors[g];
	}
	console.log(ugnames);

	var tags = "";
	var gymTag = document.createElement("div");
	$.each(ugnames, function(key, value) {
		tags = tags.concat('<div class="caldot ' + value + '"></div><p>' + key + '</p>');
	});
	console.log(tags);
	document.getElementById(type.concat('Calcat')).innerHTML = tags;
	document.getElementById(type.concat('CalDate')).innerHTML = today;

	for(var d = 0;d < dates.length;d++)
	{
		if(dayCount < 8)
		{
			
			
			var dayNum = moment(dates[d]).format('D');
			var weekval = type.concat('week');
			var dayval = type.concat(dayNum);
			var divTag = document.createElement("div");
			divTag.id = dayval;
			divTag.className = "dayp";
			document.getElementById(weekval).appendChild(divTag);
			var dayTag = document.createElement("div");
			a = type.concat("bar");
			b = a.concat(dayNum);
			dayTag.id = b
			dayTag.className = "daybar";
			dayTag.innerHTML = dayNum;
			document.getElementById(dayval).appendChild(dayTag);
			dayCount++;
			var dotTag = document.createElement("div");
			dotTag.className = "dots";
			dotTag.innerHTML = '<ul><li></li><li></li></ul>';
			document.getElementById(b).appendChild(dotTag);
			var slideTag = document.createElement("div");
			slideTag.className = "sopen";
			var slide = "<ul>";
			$.each(schedjson, function(key, value) {
				if(moment(value.datetime).format('YYYY-MM-DD') == dates[d]) {
					slide = slide.concat('<li class="' + ugnames[value.name] + ' l2 a0"><a class="ant" data-fancybox-type="iframe" rel="group" href="../open.html"><p>' + moment(value.datetime).format('h:mmA') + "<br>" + value.service + '</p></a></li>');
				}
			});
			slide = slide.concat('</ul>');
			slideTag.innerHTML = slide;
			document.getElementById(b).appendChild(slideTag);
		} else {
			dayCount = 1;
			var weekval = type.concat('week');
			var divTag = document.createElement("div");
			divTag.id = weekval;
			divTag.className = 'week';
			document.getElementById(type.concat("Daycal")).appendChild(divTag);
			d = d-1;
		}
		
	}
	
	var l = type.concat("bar");
	if(moment(week).format("MMMM YYYY") == moment().format("MMMM YYYY")) {
		var p = l.concat(moment().format('D'));
		document.getElementById(p).style.backgroundColor='blue';
	}
	box();
}



function byMonth(type) {
	var today = moment().format("MMMM YYYY");
	var daysinmonth = moment(today, "MMMM-YYYY").daysInMonth();
	var dayofweek = moment().startOf('month').format('d') - 1;
	var prevDays = 0;
	var curDays = 1;
	var futDays = 1;
	var dayCount = 8;
	var mark = 0;
	var lastMonth = moment(today).subtract('months', 1).daysInMonth();
	var dates = new Array();
	if(dayofweek > 0) {
		prevDays = moment(today).subtract('days', dayofweek).format('DD');
		while(prevDays <= lastMonth) 
		{
			dates.push(prevDays);
			prevDays++;
		}
	}
	while(curDays <= daysinmonth)
	{
		dates.push(curDays);
		curDays++;
	}
	while(dates.length <= 34)
	{
		dates.push(futDays);
		futDays++;
	}

	$('#'+type.concat('Daycal')).empty();

	var weekCount = 1;

	for(var d = 0;d < dates.length;d++)
	{
		if(dayCount < 8)
		{
			var divTag = document.createElement("div");
			var wk = type.concat("week ");
			wkcon = wk.concat(weekCount-1);
			divTag.id = wkcon.concat(dates[d]);
			divTag.className = "dayp";
			document.getElementById(wk.concat(weekCount-1)).appendChild(divTag);
			var dayTag = document.createElement("div");
			a = wkcon.concat(dates[d]);
			b = a.concat("bar");
			dayTag.id = b
			dayTag.className = "daybar";
			dayTag.innerHTML = '<div class="dayNum">' + dates[d].toString() + '</div>';
			document.getElementById(wkcon.concat(dates[d])).appendChild(dayTag);
			dayCount++;
			var dotTag = document.createElement("div");
			dotTag.className = "dots";
			dotTag.innerHTML = '<ul><li></li><li></li></ul>';
			document.getElementById(b).appendChild(dotTag);
			var slideTag = document.createElement("div");
			slideTag.className = "mopen";
			slideTag.innerHTML = '<ul><li class="yellow l1 a0"><a class="ant" data-fancybox-type="iframe" rel="group" href="../open.html"><p>09:00AM Karate</p></li><li class="green l1 a0"><p>1:00PM Yoga</p></a></li></ul>';
			document.getElementById(b).appendChild(slideTag);
			if(moment().format('D') == dates[d] && mark == 0) {
				document.getElementById(b).style.backgroundColor='blue';
				mark++;
			}
		} else {
			dayCount = 1;
			var wk = type.concat("week ");
			var divTag = document.createElement("div");
			divTag.id = wk.concat(weekCount);
			divTag.className = 'week';
			document.getElementById(type.concat("Daycal")).appendChild(divTag);
			weekCount++;
			d = d-1;
		}
	}
	box();
	document.getElementById(type.concat('CalDate')).innerHTML = today;

}

function initMenu() {
	var block = $(".dayp");
		block.addClass("clickable");
		block.hover(function(){window.status = $(this)}, function(){window.status = ""});
				
		$('.mopen').hide();
		block.click(
		function() {
				$(this).parents('div:eq(0)').find('.mopen').slideToggle('slow');
		}
	);
}



$(function(){
	
	byWeek(wkNum,'sched');
	
	

	var schedMonthbut = $("#schedMonthbut");
	var schedWeekbut = $("#schedWeekbut");
	//var daybut = $("#schedDaybut");
	var searchMonthbut = $("#searchMonthbut");
	var searchWeekbut = $("#searchWeekbut");
	//var daybut = $("#schedDaybut");
	//var forbut = $("#next");
	//var prevbut = $("#previous");
	schedMonthbut.addClass("clickable");
	schedMonthbut.click(
		function() {
			byMonth('sched');
			initMenu();

		}
	)
	schedWeekbut.addClass("clickable");
	schedWeekbut.click(
		function() {
			byWeek(wkNum,'sched');

		}
	)
	searchMonthbut.addClass("clickable");
	searchMonthbut.click(
		function() {
			byMonth('search');
			initMenu();

		}
	)
	searchWeekbut.addClass("clickable");
	searchWeekbut.click(
		function() {
			byWeek(wkNum,'search');

		}
	)
	/*daybut.addClass("clickable");
	daybut.click(
		function() {
			byDay();

		}
	)
	forbut.addClass("clickable");
	forbut.click(
		function() {
			wkNum++;
			byWeek(wkNum);
			
		}
	)
	prevbut.addClass("clickable");
	prevbut.click(
		function() {
			wkNum = wkNum-1;
			byWeek(wkNum);
		
		}
	)*/
});