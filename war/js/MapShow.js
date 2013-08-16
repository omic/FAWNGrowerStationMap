var fawnStnData = [];
var madisStnData = [];
var growerStnData = [];
var screenWidth = (window.screen.availWidth > 1680 ? 1680
        : window.screen.availWidth); // is it time consuming?
// alert(screenWidth);
var screenHeight = (window.screen.availHeight > 1050 ? 1050
        : window.screen.availHeight);
var preInfoBox = null; // globel;
var markers = []; // globel
var previousData = [];// globel
//used to slow down users' request
var checkboxTask; //globel
var boundchangedTask; //globel
function loadingPos() {
if($('#loading').css("display")!="block"){
  // alert( $('#map').css("width"));
  var mapwidth=$('#map').css("width");
  var mapheight=$('#map').css("height");
   $('#loading').css("left",(mapwidth.replace(/px/g, "")/2-30)+"px");
$('#loading').css("top",(mapheight.replace(/px/g, "")/2-30)+"px");
 $('#loading').css("display","block");
 //alert("show");
 }
}
//To avoid the IE abort data http://www.cypressnorth.com/blog/web-programming-and-development/internet-explorer-aborting-ajax-requests-fixed/
function fetch(url, type) {
    if ($.browser.msie && window.XDomainRequest) {
        // Use Microsoft XDR
        var xdr = new XDomainRequest();
        xdr.open("get", url);
        xdr.onload = function () {
            var JSON = $.parseJSON(xdr.responseText);
            if (JSON == null || typeof (JSON) == 'undefined') {
                JSON = $.parseJSON(data.firstChild.textContent);
            }
           
            var Stns = JSON;
            if (type == 1) {
                var StnObjs = createStnObjs(Stns.stnsWxData, type);
                fawnStnData = StnObjs;
                 //alert("1 "+fawnStnData.length);
            }
            else if (type == 2) {
                var StnObjs = createStnObjs(Stns, type);
                madisStnData = StnObjs;
                 //alert("2 "+madisStnData.length);
            }
            else if (type == 3) {
                var StnObjs = createStnObjs(Stns, type);
                growerStnData = StnObjs;
                //alert("3 "+growerStnData.length);
            }

        };
        xdr.onprogress=function(){ };
        xdr.ontimeout=function(){ };
        xdr.onerror=function(){ };
        setTimeout(function(){
        xdr.send();
        },0);

    } else {
        $.getJSON(
                url,
                function (data) {
                    Stns = data;
                    if (type == 1) {
                        var StnObjs = createStnObjs(Stns.stnsWxData, type);
                        fawnStnData = StnObjs;
                    }
                    else if (type == 2) {
                        var StnObjs = createStnObjs(Stns, type);
                        madisStnData = StnObjs;
                    }
                    else if (type == 3) {
                        var StnObjs = createStnObjs(Stns, type);
                        growerStnData = StnObjs;
                    }
                    //alert("aaaa"+ fawnStnData.length);
                });
    }
}
function fawnCheck() {
    if (document.getElementById("fawn").checked) {
        return true;
    } else
        return false;
}
function madisCheck() {
    if (document.getElementById("madis").checked)
        return true;
    else
        return false;

}
function growerCheck() {
    if (document.getElementById("grower").checked)
        return true;
    else
        return false;

}
/*
 * @function createInfoBox: create information box based on the given station
 * object @para:Station stnObj @return: InfoBox ib
 * 
 */
function createInfoBox(stnObj) {
    //alert(stnObj.lat+" "+stnObj.lng);
    if (stnObj.type == "GROWER") {
        var boxText = document.createElement("div");
        boxText.innerHTML = '<div class="infobox-pointer"></div>'
                + '<div class="infobox-title">'
                + stnObj.getStationTitle()
                +'</div>'
                + '<div class="ui-tabs ui-widget ui-widget-content ui-corner-all" id="infobox-tabs">'
                + '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'
                + '<li class="ui-state-default ui-corner-top  ui-tabs-selected ui-state-active">'
                + '<a href="#infobox-tabs-0">Current (updated every 15 min)</a></li>'
                + '</ul>'
                + '<div class="ui-tabs-panel ui-widget-content ui-corner-bottom" id="infobox-tabs-0">'
                + '<table class="infoTable grey" cellpadding="0" cellspacing="0"><tbody>'
                + '<tr>'
                + '<td class="nobr dtr">Station ID: <span>'
                + stnObj.stnID
                + '</span></td>'
                + '<td class="nobr dtr">Lat: <span>'
                + stnObj.lat
                + '</span></td>'
                + '</tr>'

                + '<tr>'
                + '<td class="nobr dtr">Lon: <span>'
                + stnObj.lng
                + '</span></td>'
                + '<td class="nobr dtr">Wind Direction: <span>'
                + stnObj.wind_direction
                + '&deg</span></td>'
                + '</tr>'

                + '<tr>'
                + '<td class="nobr dtr">Date Time: <span>'
                + stnObj.getDateTime()
                + '</span></td>'
                + '<td class="nobr dtr">Humidity: <span>'
                + stnObj.humidity
                + '%</span></td>'
                + '</tr>'
                + '<tr>'
                + '<td class="nobr dtr">Wet Bulb Temp: <span>'
                + stnObj.wet_bulb_temp
                + '&degF</span></td>'
                + '<td class="nobr dtr">Rain: <span>'
                + stnObj.getRain()
                + '"</span></td>'
                + '</tr>'

                + '</tbody></table>'
                + '<table class="infoTable borderTop grt" cellpadding="0" cellspacing="0">'
                + '<tbody>'
                + '<tr>'
                + '<td class="vaT">'
                + '<div id="nowTemp"><div class="titleSubtle bm10">Temperature</div>'
                + '<div id="tempActual">'
                + stnObj.temper
                + '<span class="tempUnit">&degF</span></div></div></td>'
                + '<td class="vaT">'
                + '<div id="nowRain"><div class="titleSubtle bm10">Cumm Rain*</div>'
                + '<div id="rain">'
                //+stnObj.getRain()
                + stnObj.getTotalRain()
                + '<span class="rainUnit">&rdquo;</span></div></div></td>'
                + '<td class="vaT">'
                + '<div id="nowWind"><div class="titleSubtle bm10">Wind Speed</div>'
                + '<div id="wind">'
                + stnObj.getWindSpeed()
                + '<span class="windUnit">MPH</span></div>'
                + '</div>'
                + '</td>'
                + '</tr>'
                + '<tr><td colspan="2">*Since weather station instl</td></tr>'
                + '</tbody>'
                + '</table>'
                + '</div>'
                + '<div class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" id="infobox-tabs-1">'
                + '</div>'
                + '<div class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" id="infobox-tabs-2">'
                + '</div>';
    } /*else if (stnObj.type == "FAWN") {
        //var boxText = document.createElement("div");    
        var href="http://fawn.ifas.ufl.edu/station/station.php?id="+stnObj.stnID;
        window.location =href;     
        boxText.innerHTML = '<div class="infobox-pointer"></div>'
                + '<div class="infobox-title"><a href='+href+'>'
                + stnObj.getStationTitle()
                + '</a></div>'
                + '<div class="ui-tabs ui-widget ui-widget-content ui-corner-all" id="infobox-tabs">'
                + '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'
                + '<li class="ui-state-default ui-corner-top  ui-tabs-selected ui-state-active"><a href="#infobox-tabs-0">Current</a></li>'
            // +'<li class="ui-state-default ui-corner-top">Forecast</li>'
            // +'<li class="ui-state-default ui-corner-top">Graph</li>'
                + '</ul>'
                + '<div class="ui-tabs-panel ui-widget-content ui-corner-bottom" id="infobox-tabs-0">'
                + '<table class="infoTable grey" cellpadding="0" cellspacing="0"><tbody>'
                + '<tr>'
                + '<td class="nobr dtr">Station ID: <span>'
                + stnObj.stnID
                + '</span></td>'
                + '<td class="nobr dtr">Lat: <span> '
                + stnObj.lat
                + '</span></td>'

                + '</tr>'
                + '<tr>'

                + '<td class="nobr dtr">Lon: <span>'
                + stnObj.lng
                + '</span></td>'
                + '<td class="nobr dtr">Elev: <span>'
                + stnObj.elevFt
                + 'ft</span></td>'
                + '</tr>'
                + '<tr>'
                + '<td class="nobr dtr" >Date Time: <span>'
                + stnObj.getDateTime()
                + '</span></td>'
                + '<td class="nobr dtr">totalRad2mWm2: <span>'
                + stnObj.totalRad2mWm2
                + 'W/m2</span></td>'

                + '</tr>'
                + '<td class="nobr dtr">relHum2mPct: <span>'
                + stnObj.relHum2mPct
                + '%</span></td>'
                + '<td class="nobr dtr">Wind Direction: <span>'
                + stnObj.windDirction
                + '&deg</span></td>'
                + '</tr>'
                + '<tr>'
                + '<td class="nobr dtr">temp60cmF: <span>'
                + stnObj.temp60cmF
                + '&degF</span></td>'
                + '<td class="nobr dtr">temp10mF: <span>'
                + stnObj.temp10mF
                + '&degF</span></td>'

                + '</tr>'
                + '<tr>'

                + '<td class="nobr dtr">bp2m: <span>'
                + stnObj.bp2m
                + '</span></td>'
                + '<td class="nobr dtr">Min Daily Temp: <span>'
                + stnObj.minDailyTemp
                + '&degF</span></td>'
                + '</tr>'
                + '<tr>'

                + '<td class="nobr dtr">dewPoint2mF: <span>'
                + stnObj.dewPoint2mF
                + '&degF</span></td>'
                + '<td class="nobr dtr">etInch: <span>'
                + stnObj.etInch
                + '"</span></td>'
                + '</tr>'

                + '</tbody></table>'
                + '<table class="infoTable borderTop grt" cellpadding="0" cellspacing="0">'
                + '<tbody>'
                + '<tr>'
                + '<td class="vaT dtr"><div id="nowTemp"><div class="titleSubtle bm10">Temperature</div><div id="tempActual">'
                + stnObj.getTemp()
                + ' <span class="tempUnit">&degF</span></div></div></td>'
                + '<td class="vaT">'
                + '<div id="nowRain"><div class="titleSubtle bm10">Rain</div>'
                + '<div id="rain">'
                + stnObj.getRain()
                + '<span class="rainUnit">&rdquo;</span></div>'
                + '</div>'
                + '</td>'
                + '<td class="vaT">'
                + '<div id="nowWind"><div class="titleSubtle bm10">Wind Speed</div>'
                + '<div id="wind">'
                + stnObj.getWindSpeed()
                + '<span class="windUnit">MPH</span></div>'
                + '</div>'
                + '</td>'
                + '</tr>'
                + '</tbody>'
                + '</table>'
                + '</div>'
                + '<div class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" id="infobox-tabs-1">'
                + '</div>'
                + '<div class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" id="infobox-tabs-2">'
                + '</div>';
                
    }*/ else {
        var boxText = document.createElement("div");
        boxText.innerHTML = '<div class="infobox-pointer"></div>'
                + '<div class="infobox-title">'
                + stnObj.getStationTitle()
                + '</div>'
                + '<div class="ui-tabs ui-widget ui-widget-content ui-corner-all" id="infobox-tabs">'
                + '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'
                + '<li class="ui-state-default ui-corner-top  ui-tabs-selected ui-state-active"><a href="#infobox-tabs-0">Current</a></li>'
                + '</ul>'
                + '<div class="ui-tabs-panel ui-widget-content ui-corner-bottom" id="infobox-tabs-0">'
                + '<table class="infoTable grey" cellpadding="0" cellspacing="0"><tbody>'
                + '<tr>'
                + '<td class="full">Station ID: <span>'
                + stnObj.stnID
                + '</span></td>'
                + '<td class="nobr dtr">Lat: <span>'
                + stnObj.lat
                + '</span></td>'
                + '<td class="nobr dtr">Lon: <span>'
                + stnObj.lng
                + '</span></td>'
                + '<td class="nobr">Elev: <span>'
                + stnObj.elevFt
                + ' ft</span></td>'
                + '</tr>'
                + '<tr><td colspan = "3">Date Time: <span>'
                + stnObj.getDateTime()
                + '</span></td></tr>'
                + '</tbody></table>'
                + '<table class="infoTable borderTop grt" cellpadding="0" cellspacing="0">'
                + '<tbody>'
                + '<tr>'
                + '<td class="vaT dtr"><div id="nowTemp"><div class="titleSubtle bm10">Temperature</div><div id="tempActual">'
                + stnObj.getTemp()
                + ' <span class="tempUnit">&degF</span></div></div></td>'
                + '<td class="vaT">'
                + '<div id="nowRain"><div class="titleSubtle bm10">Rain</div>'
                + '<div id="rain">'
                + stnObj.getRain()
                + '<span class="rainUnit">&rdquo;</span></div>'
                + '</div>'
                + '</td>'
                + '<td class="vaT">'
                + '<div id="nowWind"><div class="titleSubtle bm10">Wind Speed</div>'
                + '<div id="wind">'
                + stnObj.getWindSpeed()
                + '<span class="windUnit">MPH</span></div>'
                + '</div>'
                + '</td>'
                + '</tr>'              
                + '</tbody>'
                + '</table>'
                + '</div>'
                + '<div class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" id="infobox-tabs-1">'
                + '</div>'
                + '<div class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" id="infobox-tabs-2">'
                + '</div>';
    }

    var myOptions = {
        content: boxText,
        disableAutoPan: false,
        maxWidth: 0,
        pixelOffset: new google.maps.Size(25, -27)// right,top
        ,
        zIndex: null,
        closeBoxMargin: "0px 0px 0px 0px",
        closeBoxURL: "http://icons.wxug.com/i/wu/wmTitleClose.png",
        infoBoxClearance: new google.maps.Size(1, 1),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: false
    };
    var ib = new InfoBox(myOptions);
    return ib;
}

function loadData() {
	//alert("hello");
    var fawnurl = 'http://test.fawn.ifas.ufl.edu/controller.php/latestmapjson/';
    var madisurl = 'http://test.fawn.ifas.ufl.edu/controller.php/nearbyNonFawn/all/';
    var growerurl = 'http://test.fdacswx.fawn.ifas.ufl.edu/index.php/dataservice/observation/latest/format/json/';
    fetch(growerurl, 3);
    fetch(fawnurl, 1);
    fetch(madisurl, 2);
   
}
//update data every 15 min
var refresh=window.setInterval(loadData,900000);
//var refresh=window.setInterval(loadData,60000);
function fillData(StnObjs){
	previousData = previousData.concat(StnObjs);
}
function showData() {

    //alert(previousData.length);
    fillDataSeperately(previousData);
    boundAjusted();
}
function boundAjusted() {
    
    google.maps.event.addListener(map, 'bounds_changed', function () {
    loadingPos();
  		clearTimeout(boundchangedTask);
        // //console.log("cleaTimeout");
         boundchangedTask=setTimeout(function() {
        	 fillDataSeperately(previousData);
        	 //console.log("fillData");
         }, 1200);
    		
        
    });
}
function fillDataSeperately(newObjs) {
    
    var preBound = null;
    var bound = getBounds(map);
    if (preBound != null) {
        if (bound.ignore(preBound)) {
            return;
        }
    }
    ////console.log (newObjs.length);
    var time2=new Date().getTime();
    var inBoundNewObjs = filter(newObjs, bound);
    var time3=new Date().getTime();
    ////console.log(inBoundNewObjs.length);
    var noOverlapNewObjs = removeOverlap([], inBoundNewObjs, bound
            .pixelsPerRadLat(), bound.pixelsPerRadLng());
    var time4=new Date().getTime();
    // alert("noOverlapNewObjs:"+noOverlapNewObjs.length);
    clearOverlays(markers);
    var time5=new Date().getTime();
    markers = loadStnMarkers(noOverlapNewObjs);
    var time6=new Date().getTime();
    preBound = bound;
    
    //console.log ("====filldata total: "+(time6-time2)+"======");
    //console.log ("markers length :" + markers.length);
    //console.log ("filter: "+(time3-time2));
    //console.log ("removeoverlap: "+(time4-time3));
    //console.log ("clearoverlay: "+(time5-time4));
    //console.log ("loadmarker: "+(time6-time5));
    setTimeout(function() {
        	  $('#loading').css("display","none");
         }, 500);
    
}
function clearOverlays(markers) {
    if (Object.prototype.toString.call(markers) === '[object Array]') {
    	////console.log("/////////////marker length"+markers.length);
        for (var i = 0; i < markers.length; i++) {
        	var time1=new Date().getTime();
            markers[i].setMap(null);
            var time2=new Date().getTime();
            /*if((time2-time1)>=40){
            	//console.log("makers"+markers[i].labelContent);
                //console.log("set time: "+(time2-time1));
        	}*/
        }
    }
}
function loadStnMarkers(stnObjs) {
    var image = 'image/marker.png';
    var markers = [];
    for (var i = 0; i < stnObjs.length; i++) {
        markers[i] = new MarkerWithLabel({
            position: new google.maps.LatLng(stnObjs[i].lat, stnObjs[i].lng),
            draggable: false,
            raiseOnDrag: false,
            map: map,
            labelContent: stnObjs[i].getLabelContent(),
            labelAnchor: new google.maps.Point(22, 0),
            labelClass: "labels", // the CSS class for the label
            // labelStyle: {opacity: 0.85},
            icon: image
        });
        bindInfoBox(markers[i], stnObjs[i]);
    }
    return markers;
}
function bindInfoBox(marker, stnObj) {
    google.maps.event.addListener(marker, "click", function (e) {
    	if (stnObj.type == "FAWN") {
            //var boxText = document.createElement("div");    
            var href="http://fawn.ifas.ufl.edu/station/station.php?id="+stnObj.stnID;
            window.location =href;}
    	else{
        var ib = createInfoBox(stnObj)
        ib.open(map, this);
        // close previous information box
        if (preInfoBox != null) {
            preInfoBox.close();
        }
        preInfoBox = ib;
    	}
    });
}

/*
 * @function createStnObjs: make Station objects by the given associate array it
 * makes much easier when display different type of station infomation.
 * @para:Object[] station @return: Station[] stnObjs
 * 
 */
function createStnObjs(stations, tag) {
	 var time1=new Date().getTime();
    var stnObjs = [];
    for (var i = 0; i < stations.length; i++) {
    	//we get rid of 2/3 madis stations
    	//since the ie is slow
    	if(tag == 2 && i%3 == 0){
    		continue;
    	}
    	
        stnObjs[stnObjs.length] = Station.createStnObj(stations[i], tag);
    }
    var time2=new Date().getTime();
    //console.log("create: "+(time2-time1));
    return stnObjs;
}

function getBounds(map) {
	//alert("map: "+map.getZoom());
    var bound = {};
    var bounds = map.getBounds();
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    bound.lowLat = sw.lat();
    bound.lowLng = sw.lng();
    bound.highLat = ne.lat();
    bound.highLng = ne.lng();
    bound.toString = function () {
        return "Lat:[" + bound.lowLat + "," + bound.highLat + "] Lng:["
                + bound.lowLng + "," + bound.highLng + "]";
    }
    bound.pixelsPerRadLat = function () {
        // Detecting user's screen size using window.screen
        // alert(window.screen.availHeight);
        return screenHeight / (bound.highLat - bound.lowLat);
    }
    bound.pixelsPerRadLng = function () {
        // Detecting user's screen size using window.screen
        return screenWidth / (bound.highLng - bound.lowLng);
    }
    bound.ignore = function (preBound) {
        var dx = (bound.lowLat - preBound.lowLat > 0 ? bound.lowLat
                - preBound.lowLat : preBound.lowLat - bound.lowLat);
        var dy = (bound.lowLng - preBound.lowLng > 0 ? bound.lowLng
                - preBound.lowLng : preBound.lowLng - bound.lowLng);
        if (dx + dy < 0.05) {
            return true;
        }
        return false;
    }
    return bound;
}
/*
 * @function filter: kick out the stations of which 1. the lat & lng are not in
 * the bound. 2. temperature != 'NA' @para:Station[] stations @para:Bound bound
 * @return: Station[] eligiableStns
 * 
 */
function filter(stations, bound) {
	//alert(bound);
    var eligiableStns = [];
    var j = 0;
    for (var i = 0; i < stations.length; i++) {
        if (stations[i].lat > bound.lowLat 
                && stations[i].lat < bound.highLat 
                && stations[i].lng > bound.lowLng 
                && stations[i].lng < bound.highLng ) {
        	//filter 2/3 points
          
                eligiableStns[j] = stations[i];
                j++;
            
        }
    }
    return eligiableStns;
}

/*
 * @function removeOverlap: keep the stations having no overlap @para:Station[]
 * stations @para:Bound bound @return: Station[] noOverLapStns
 * 
 */
function removeOverlap(noOverLapStns, stations, pixelPerRadLat, pixelPerRadLng) {
    for (var i = 0; i < stations.length; i++) {
        var overlap = false;
        for (var j = 0; j < noOverLapStns.length; j++) {
            overlap = haveOverlap(stations[i], noOverLapStns[j],
                    pixelPerRadLat, pixelPerRadLng);
            if (overlap) {
                // alert("overlap");
                break;
            }
        }
        if (!overlap)
            noOverLapStns[noOverLapStns.length] = stations[i];
    }
    // alert(noOverLapStns.length);
    return noOverLapStns;
}

function haveOverlap(stnA, stnB, pixelPerRadLat, pixelPerRadLng) {
    var distance = stnA.pixelDistance(stnB, pixelPerRadLat, pixelPerRadLng);
    if (distance < 50)
        return true;
    return false;
}
function DataControl(controlDiv, map) {

    // Set CSS styles for the DIV containing the control
    // Setting padding to 5 px will offset the control
    // from the edge of the map
    controlDiv.style.padding = '15px';
   
    var controlFawn= document.createElement('div');
    controlFawn.style.backgroundColor = 'white';
    controlFawn.style.borderStyle = 'solid';
    controlFawn.innerHTML = '<div>' + 'Please select your <br/> source of weather <br />station. Zoom in to<br /> see more stations<br /><label class="fawnLabel" id="checkbox"onclick="fawnCheck()">'
            + '<input id="fawn" type="checkbox" >' + 'Fawn' + '</label>'
            + ' </div>'

    controlDiv.appendChild(controlFawn);
    controlMadis = document.createElement('div');
    controlMadis.innerHTML = '<div>'
            + '<label class="madisLabel" id="checkbox2"onclick="madisCheck()">'
            + '<input id="madis" type="checkbox">' + 'Madis' + '</label>'
    +'</div>';
    controlFawn.appendChild(controlMadis);
    controlGrower = document.createElement('div');
    controlGrower.innerHTML = '<div>'
            + '<label class="gladStoneFamilyLabel" id="checkbox3"onclick="growerCheck()">'
            + '<input id="grower" type="checkbox" >' + 'Grower' + '</label>'
            + '</div>';
    controlFawn.appendChild(controlGrower);
    
    google.maps.event.addDomListener(controlFawn, 'click', function () {
    	/* check box update
    	 * only update map by 1.2 seconds (no quick than)
    	 * to fix issue pointed out by Camilo
    	 * If I un-select  or select one type of weather station, 
    	 * sometimes it takes a few seconds before those weather stations are removed from or added to the view; 
    	 * sometimes I have to un-select and select them several times, before anything happens
    	 */
    	  loadingPos();
    	clearTimeout(checkboxTask);
        //console.log("clear check chekboxTask");
        checkboxTask = setTimeout(function() {
        	updateMarkers();
        }, 1200);
    	
    });

}
function updateMarkers(){
		//console.log("==updateMarkers==");
		previousData = null;
        previousData = [];
        var flag1 = fawnCheck();
        var flag2 = madisCheck();
        var flag3 = growerCheck();
        //load grower first
        if (flag3 == true) {
           fillData(growerStnData);
        }
        if (flag1 == true) {
           fillData(fawnStnData);          
        }
        if (flag2 == true) {
   
           fillData(madisStnData);
        }
       
        showData();
  
}
// using html5 geolocation to get the location of the current user, brower
// support IE,Firefox,chrome,safari,opera
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        // alert(location[0]);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
	var location;
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    location[0] = lat;
    location[1] = lng;
    alert(location[0]);
    // alert(lng);
   map.setCenter(new google.maps.LatLng(lat, lng));
}