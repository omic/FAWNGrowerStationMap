/* Author: Tiejia Zhao Email:tiejiazhao@gmail.com
 * There are  three main functions in this file. forecastTracker is the main controller. In datacontrol, 
 * formatDate formats the date suitable for different browser. ParseData parses the JSON into array
 * for chart. fetchTempData requests the data from sever. In graphicChart, initcalChart creates a chart 
 * for late use. There are also addSeries and updateSeries to update the series data when user chooses a
 * station. setCritical and displayCritical are for drawing the critical temperature. In compareTable, 
 * findComparePoint calculates the point fo nws and fawn have the save x value. InserTable inserts these
 * point into a compare table. targetPoint refresh the tooltip after the user clicks a certain row in the
 * table 
 */
function graphicControl() {
    var graphchart;
    var seriesData = [];
    var range;
    this.graphObj = new weatherGraphic();
    this.dataObj = new weatherDataControl();
}
function weatherDataControl() {
    var STATION_NAME_URL = "http://test.fdacswx.fawn.ifas.ufl.edu/index.php/test/read/station/format/json";
    var graph = new weatherGraphic();
    var weatherInfo = new infoTable();
    var wetBulbTemper = [];
    var dryBulbTemper = [];
    var rainfall = [];
    var newTitle;
    var seriesName;
    var id = "weather data";
    var idToGrowerName=[];	
    this.fillGrowerBox = function (stnID) {
        $.getJSON(STATION_NAME_URL,
            function (data) {
                if (!data) {
                    alert("Current has no station");
                }
                else {
                    var stnObj = data;
                    for (var i = 0; i < stnObj.length; i++) {
                    	idToGrowerName[stnObj[i].id]=stnObj[i].grower_name;
                        var key = stnObj[i].grower_name;
                        if (grower.hasOwnProperty(key)) {
                            grower[key][grower[key].length] = stnObj[i].id + "$$$" + stnObj[i].station_name;
                        }
                        else {
                            //alert(stnObj[i].id);
                            var id = [];
                            id[0] = stnObj[i].id + "$$$" + stnObj[i].station_name;
                            grower[key] = id;
                        }
                    }
                    var keys = Object.keys(grower);
                    keys.sort(function (a, b) {
                        return (a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0));
                    });
                    $("#growerName").append(
                        $('<option></option>')
                            .val("")
                            .html("Select Grower"));
                    
                    for (var i = 0; i < keys.length; i++) {
                        $("#growerName").append(
                            $('<option></option>')
                                .val(keys[i])
                                .html(keys[i]));
                   
                    }
                    $("#growerName").val(idToGrowerName[stnID]);
                    fillStationByGrower();
                    fetchData();
                    $( "#dialog" ).dialog({ width: 750, height: 600});
                }
            });
    }
  
    //get station for choosing grower
    var fillStationByGrower=function(){
    	$('#station').children('option:not(:first)').remove();
 	    var growerName=$("#growerName").val();
 	    var id=grower[growerName]; 
 	    for(var i=0;i<id.length;i++){
 	    var arr=id[i].split("$$$");
 	       $("#station").append(
 	             $('<option></option>')
 	                    .val(arr[0])
 	                    .html(arr[1]));
 	       if(i==0){
 	    	  $("#station").val(arr[0]);
 	       }
 	    }    
 	} 
	/*
	 * Diffrent Web browser has it's own format requirement of date string
	 *
	 */
	var formatDate = function(dateStr, browerType) {
		var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
		var is_safari = navigator.userAgent.indexOf("Safari") > -1;
		var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
		if ((is_chrome)&&(is_safari)) {is_safari=false;}
		if (browerType == "IE") {
			//alert("safari");
			//2013-08-07 14:00:00 EDT
			var dateString = dateStr.split(" ");//[2013-08-07,14:00:00,EDT]
			var dateArr = dateString[0].split("-");//[2013,08,07]
			var timeArr = dateString[1].split(":");//[14,0,0]
			var dateStr = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2],
					timeArr[0], timeArr[1], timeArr[2]).toString();
			var dateTime = dateStr.split(" ");
			var dateTemp = dateTime[0] + " " + dateTime[1] + " " + dateTime[2]
					+ " " + dateTime[5] + " " + dateTime[3] + " "
					+ dateString[2];// Wed Aug 7 2013 17:00:00 EDT
			var date = new Date(dateTemp);
			//alert(date);
		}
		else{
			if(is_safari||is_firefox){
				var dateString = dateStr.split(" ");//[2013-08-07,14:00:00,EDT]
				var dateArr = dateString[0].split("-");//[2013,08,07]
				var timeArr = dateString[1].split(":");//[14,0,0]
				var dateStr = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2],
						timeArr[0], timeArr[1], timeArr[2]).toString();
				var dateTime = dateStr.split(" ");//"Sun Sep 08 2013 10:00:00 GMT-0400 (EDT)"
				var dateTemp = dateTime[0] + " " + dateTime[1] + " " + dateTime[2]
						+ " " + dateTime[3] + " " + dateTime[4] + " "
						+ dateTime[5];// Wed Aug 7 2013 17:00:00 EDT
				var date = new Date(dateTemp);			
			}
			else{
			var date = new Date(dateStr);
			}
		}
		return date;
	}
    var parseData = function (browserTyper, stnData) {
        var dataType = $("#dataType").val();
        if (dataType == "wet") {
            newTitle = 'Graphic Weather Data (Temperature F)';
            seriesName = "Wet Bulb Temperature";
            wetBulbTemper = [];
            for (var i = 0; i < stnData.length; i++) {
                //parse JSON style:{"obz_temp":"82","local_time":"2013-08-07 17:00:00 EDT"} to highcart style: [1375902000000,82]
                var temperPoint = [];
                var dateStr = stnData[i].date_time; //"2013-07-18 10:00:00 EDT"
                var date = formatDate(dateStr, browserTyper);// format date for IE
                temperPoint[0] = date.getTime();
                if (stnData[i].wet_bulb_temp == null) {
                    temperPoint[1] = null;
                }
                else {
                    temperPoint[1] = parseInt(stnData[i].wet_bulb_temp);
                }
                wetBulbTemper[i] = temperPoint;
            }
            seriesData = wetBulbTemper;
        }
        else if (dataType == "dry") {
            newTitle = 'Graphic Weather Data (Temperature F)';
            seriesName = "Dry Bulb Temperature"
            dryBulbTemper = [];
            for (var i = 0; i < stnData.length; i++) {

                //parse JSON style:{"obz_temp":"82","local_time":"2013-08-07 17:00:00 EDT"} to highcart style: [1375902000000,82]
                var temperPoint = [];
                var dateStr = stnData[i].date_time; //"2013-07-18 10:00:00 EDT"
                var date = formatDate(dateStr, browserTyper);// format date for IE
                temperPoint[0] = date.getTime();
                if (stnData[i].dry_bulb_air_temp == null) {
                    temperPoint[1] = null;
                }
                else {
                    temperPoint[1] = parseInt(stnData[i].dry_bulb_air_temp);
                }
                dryBulbTemper[i] = temperPoint;
            }
            seriesData = dryBulbTemper;

        }
        else {
            newTitle = 'Graphic Weather Data (Rainfall inch)';
            seriesName = "Rainfall"
            rainfall = [];
            for (var i = 0; i < stnData.length; i++) {
                //parse JSON style:{"obz_temp":"82","local_time":"2013-08-07 17:00:00 EDT"} to highcart style: [1375902000000,82]
                var rainfallPoint = [];
                var dateStr = stnData[i].date_time; //"2013-07-18 10:00:00 EDT"
                var date = formatDate(dateStr, browserTyper);// format date for IE
                rainfallPoint[0] = date.getTime();
                if (stnData[i].rainfall == null) {
                    rainfallPoint[1] = null;
                }
                else {
                    rainfallPoint[1] = parseInt(stnData[i].rainfall);
                }
                rainfall[i] = rainfallPoint;
            }
            seriesData = rainfall;

        }
    }
    var fetchData = function () {
        var timeStart;
        var url = 'http://test.fdacswx.fawn.ifas.ufl.edu/index.php/test/read/seven/station_id/' + $("#station").val() + '/format/json/';
        // if in IE browser
        if ($.browser.msie && window.XDomainRequest) {
            // Use Microsoft XDR
            var xdr = new XDomainRequest();
            xdr.open("get", url);
            xdr.onload = function () {
                var JSON = $.parseJSON(xdr.responseText);
                if (JSON == null || typeof (JSON) == 'undefined') {
                    //JSON = $.parseJSON(data.firstChild.textContent);
                    stnData = [];
                    parseData("IE", stnData);
                    timeStart = 0;
                }
                else {
                    var stnData = JSON;
                    if (stnData != null) {
                        parseData("IE", stnData);
                        timeStart = seriesData[0][0];
                        //var test=graphchart.series[0].xData;
                    }
                }
                /*
                 else{
                 seriesData=[];
                 timeStart=0;
                 }*/
                if (!graphchart.get(id)) {
                    graph.addSeries(id, newTitle, seriesName);
                }
                else {
                    graph.updateSeries(id, newTitle, seriesName);
                }
                weatherInfo.inserTable(seriesData, timeStart,"off");
            };
            xdr.onprogress = function () {
            };
            xdr.ontimeout = function () {
            };
            xdr.onerror = function () {
            };
            setTimeout(function () {
                xdr.send();
            }, 0);
        } else {
            $.getJSON(url, function (data) {
                if (data != null) {
                 	$("#noDataError").empty();
                    var stnData = data;
                    parseData("Other", stnData);
                    timeStart = seriesData[0][0];
                } else {
                	    $("#noDataError").html("<label> Current No Data<label>").css("color", "red");;
                    var stnData = [];
                    timeStart = 0;
                    parseData("Other", stnData);
                }

                if (!graphchart.get(id)) {
                    graph.addSeries(id, newTitle, seriesName);
                }
                else {
                    graph.updateSeries(id, newTitle, seriesName);
                }

                weatherInfo.inserTable(seriesData, timeStart, "off");
                //addSeries(seriesData,id);

            });
        }
    }
    this.growerChange=function(){
    	fillStationByGrower();
    	
    }
    this.stationChange=function(){
    	fetchData();
    }
}
function weatherGraphic() {
    var weatherInfo = new infoTable();
    this.intialChart = function () {
        Highcharts.setOptions({  // This is for all plots, change Date axis to local timezone
            global: {
                useUTC: false
            }
        });
        // Create the chart
        graphchart = new Highcharts.StockChart(
            {
                chart: {
                    renderTo: 'container',
                    defaultSeriesType: 'line'
                },
                rangeSelector: {
                    buttons: [
                        {
                            type: 'minute',
                            count: 240,
                            text: '4h'
                        },
                        {
                            type: 'day',
                            count: 0.5,
                            text: '12h'
                        },
                        {
                            type: 'day',
                            count: 1,
                            text: '24h'
                        },
                        {
                            type: 'day',
                            count: 3,
                            text: '3d'
                        },
                        {
                            type: 'day',
                            count: 7,
                            text: '7d'
                        },
                        {
                            type: 'all',
                            text: 'All'
                        }
                    ],
                },

                title: {
                    text: 'Graphic Weather Data'
                },
                xAxis: {
                    type: 'datetime',
                    events: {
                        setExtremes: function (e) {
                            if (typeof(e.rangeSelectorButton) !== 'undefined') {
                                range = e.rangeSelectorButton.count;
                                var timeStart = e.min;
                                weatherInfo.inserTable(seriesData, timeStart,"off");
                            }
                        }
                    },
                    minRange: 3600 * 1000
                }


            });

    }
    this.addSeries = function (id, newTitle, name) {
        graphchart.setTitle({
            text: newTitle
        });
        var stnSeries = {
            name: name,
            id: id,
            data: seriesData,
            tooltip: {

                valueDecimals: 2
            },
            marker: {
                enabled: true,
                radius: 1
            }
        }
        graphchart.addSeries(stnSeries);

    }
    this.updateSeries = function (id, newTitle, name) {
        graphchart.setTitle({
            text: newTitle
        });
        graphchart.get(id).update({
            name: name,
            data: seriesData
        });

    }
}
function infoTable() {

    this.inserTable = function (seriesData, timeStart, status) {
    	if(status!="on")
    		return;
        //var range=graphchart.rangeSelectorButton.count;
        //alert(new Date());
        var table = document.getElementById("infotable")
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
        var rownum = 1;
        for (var i = 0; i < seriesData.length; i++) {
            if (seriesData[i][0] < timeStart)
                continue;
            var localDate = new Date(seriesData[i][0]).toString();//date format is Wed Aug 07 2013 17:00:00 GMT-0400 (EDT), to make it short, just keep date and time.
            var time = localDate.split(" ");// format the date string
            var timeStr = time[1] + " " + time[2] + " " + time[3] + " "
                + time[4];//Aug 07 2013 17:00:00
            if (seriesData[i][1] == null) {
                var infor = 'NA';
            }
            else {
                var infor = seriesData[i][1];
            }
            var rowContend='<tr><td>'+timeStr+'</td>'
			              +'<td>'+infor+'</td></tr>';
		    $("#infotable").append(rowContend);
        }
        $("#infoDiv").show();//after insert, make the table visible.
    }

}

