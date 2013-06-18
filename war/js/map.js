

function checked() {
	if (document.getElementById("fawn").checked) {
		return true;
	} else
		return false;
}
function checked2() {
	if (document.getElementById("madis").checked)
		return true;
	else
		return false;

}
function checked3() {
	if (document.getElementById("grower").checked)
		return true;
	else
		return false;

}
function showData() {
	alert("showData " + previousData.length);
	fillDataSeperately(previousData);
	boundAjusted();
}
function loadFawn() {
	$.getJSON('http://test.fawn.ifas.ufl.edu/controller.php/latestmapjson/',
			function(data) {
				var fawnStns = data;
				var fawnStnObjs = createStnObjs(fawnStns.stnsWxData, 1);// globel;
				previousData = previousData.concat(fawnStnObjs);
				// alert(previousData.length);
				fillDataSeperately(previousData);
				boundAjusted();
			});

}
function loadMadis() {
	$.getJSON(
			'http://test.fawn.ifas.ufl.edu/controller.php/nearbyNonFawn/all/',
			function(data) {
				var madisStns = data;
				var madisStnObjs = createStnObjs(madisStns, 2);// globel;
				previousData = previousData.concat(madisStnObjs);
				// alert(previousData.length);
				fillDataSeperately(previousData);
				boundAjusted();
			});

}
function loadGrower() {
	$
			.getJSON(
					' http://fdacswx.fawn.ifas.ufl.edu/index.php/dataservice/observation/latest/format/json/',
					function(data) {
						var familyStns = data;
						var familyStnObjs = createStnObjs(familyStns, 3);
						previousData = previousData.concat(familyStnObjs);
						fillDataSeperately(previousData);
						boundAjusted();
					});
}
function boundAjusted() {
	google.maps.event.addListener(map, 'bounds_changed', function() {
		fillDataSeperately(previousData);
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
	var inBoundNewObjs = filter(newObjs, bound);
	// alert("inBoundNewObjs:"+inBoundNewObjs.length);
	var noOverlapNewObjs = removeOverlap([], inBoundNewObjs, bound
			.pixelsPerRadLat(), bound.pixelsPerRadLng());
	// alert("noOverlapNewObjs:"+noOverlapNewObjs.length);
	clearOverlays(markers);
	markers = loadStnMarkers(noOverlapNewObjs);
	preBound = bound;
}
function clearOverlays(markers) {
	if (Object.prototype.toString.call(markers) === '[object Array]') {
		for ( var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
	}
}
function loadStnMarkers(stnObjs) {
	var image = 'image/marker.png';
	var markers = [];
	for ( var i = 0; i < stnObjs.length; i++) {
		markers[i] = new MarkerWithLabel({
			position : new google.maps.LatLng(stnObjs[i].lat, stnObjs[i].lng),
			draggable : false,
			raiseOnDrag : false,
			map : map,
			labelContent : stnObjs[i].getLabelContent(),
			labelAnchor : new google.maps.Point(22, 0),
			labelClass : "labels", // the CSS class for the label
			// labelStyle: {opacity: 0.85},
			icon : image
		});
		bindInfoBox1(markers[i], stnObjs[i]);
	}
	return markers;
}
function bindInfoBox1(marker, stnObj) {
	google.maps.event.addListener(marker, "click", function(e) {
		var ib = createInfoBox(stnObj)
		ib.open(map, this);
		// close previous information box
		if (preInfoBox != null) {
			preInfoBox.close();
		}
		preInfoBox = ib;
	});
}
/*
 * @function createInfoBox: create information box based on the given station
 * object @para:Station stnObj @return: InfoBox ib
 * 
 */
function createInfoBox(stnObj) {

	if (stnObj.type == "GROWER") {
		var boxText = document.createElement("div");
		boxText.innerHTML = '<div class="infobox-pointer"></div>'
				+ '<div class="infobox-title"><a href="station.php?id=330">'
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
				+ '<td class="full">Station ID:'
				+ stnObj.stnID
				+ '</td>'
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
				+ '<tr>'
				+ '<td class="full">Date Time:'
				+ stnObj.getDateTime()
				+ '</td>'
				+ '<td class="nobr dtr">Humadity: <span>'
				+ stnObj.humidity
				+ '</span></td>'
				+ '<td class="nobr dtr">Wind Direction: <span>'
				+ stnObj.winddirection
				+ '</span></td>'
				+ '</tr>'
				+ '<tr>'
				+ '<td class="full">Wet Bulb Temp:<span>'
				+ stnObj.wet_bulb_temp
				+ '</span></td>'

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
	} else if (stnObj.type == "FAWN") {
		var boxText = document.createElement("div");
		boxText.innerHTML = '<div class="infobox-pointer"></div>'
				+ '<div class="infobox-title"><a href="station.php?id=330">'
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
				+ '<td class="nobr dtr">Station ID:'
				+ stnObj.stnID
				+ '</td>'
				+ '<td class="nobr dtr">Lat:<span> '
				+ stnObj.lat
				+ '</span></td>'

				+ '</tr>'
				+ '<tr>'

				+ '<td class="nobr dtr">Lon: <span>'
				+ stnObj.lng
				+ '</span></td>'
				+ '<td class="nobr dtr">Elev: <span>'
				+ stnObj.elevFt
				+ ' </span>ft</td>'
				+ '</tr>'
				+ '<tr>'
				+ '<td class="nobr dtr" >Date Time:<span>'
				+ stnObj.getDateTime()
				+ '</span></td>'
				+ '<td class="nobr dtr">totalRad2mWm2:<span>'
				+ stnObj.totalRad2mWm2
				+ '</span></td>'

				+ '</tr>'
				+ '<td class="nobr dtr">relHum2mPct:<span>'
				+ stnObj.relHum2mPct
				+ '</span></td>'
				+ '<td class="nobr dtr">Wind Direction: <span>'
				+ stnObj.windDirction
				+ '</span></td>'

				+ '</tr>'

				+ '<tr>'
				+ '<td class="nobr dtr">temp60cmF: <span>'
				+ stnObj.temp60cmF
				+ '</span>&degF</td>'
				+ '<td class="nobr dtr">temp10mF: <span>'
				+ stnObj.temp10mF
				+ '</span>&degF</td>'

				+ '</tr>'
				+ '<tr>'

				+ '<td class="nobr dtr">bp2m: <span>'
				+ stnObj.bp2m
				+ '</span></td>'
				+ '<td class="nobr dtr">Min Daily Temp: <span>'
				+ stnObj.minDailyTemp
				+ '</span>&degF</td>'
				+ '</tr>'
				+ '<tr>'

				+ '<td class="nobr dtr">dewPoint2mF: <span>'
				+ stnObj.dewPoint2mF
				+ '</span></td>'
				+ '<td class="nobr dtr">etInch: <span>'
				+ stnObj.etInch
				+ '</span></td>'
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
	} else {
		var boxText = document.createElement("div");
		boxText.innerHTML = '<div class="infobox-pointer"></div>'
				+ '<div class="infobox-title"><a href="station.php?id=330">'
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
				+ '<td class="full">Station ID:'
				+ stnObj.stnID
				+ '</td>'
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
				+ '<tr><td colspan = "3">Date Time:'
				+ stnObj.getDateTime()
				+ '</td></tr>'
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
		content : boxText,
		disableAutoPan : false,
		maxWidth : 0,
		pixelOffset : new google.maps.Size(25, -27)// right,top
		,
		zIndex : null,
		closeBoxMargin : "0px 0px 0px 0px",
		closeBoxURL : "http://icons.wxug.com/i/wu/wmTitleClose.png",
		infoBoxClearance : new google.maps.Size(1, 1),
		isHidden : false,
		pane : "floatPane",
		enableEventPropagation : false
	};
	var ib = new InfoBox(myOptions);
	return ib;
}
function bindInfoBox(marker, stnObj) {
	google.maps.event.addListener(marker, "click", function(e) {
		var id = document.getElementById("map");
		var id2 = document.getElementById("list");
		id.style.display = 'none';
		// <a href="tower_data.html?id="KPNS"">81</a>
		// var id=stnObj.stnID;
		// window.location.href='tower_data.html?id=304';
		var ib = showInfoBox(stnObj)
		id2.style.display = '';
		// ib.open(map, this);

		// if(preInfoBox != null){
		// preInfoBox.close();
		// }
		// preInfoBox = ib;
	});
}
function showInfoBox(stnObj) {
	var listText = document.getElementById("list");
	listText.innerHTML = '<div class="boxWrap">' + '<h3>'
			+ stnObj.getStationTitle()
			+ '</h3>'
			+ '<ol class="tags">'
			+ '<li><a href="#"><span class="meta">'
			+ stnObj.stnID
			+ '</span> Tower ID</a></li>'
			+ '<li><a href="#"><span class="meta">'
			+ stnObj.getDateTime()
			+ '</span> Time</a></li>'
			+ '<li><a href="#"><span class="meta">'
			+ stnObj.getTemp()
			+ '&degF</span> Air Temp</a></li>'
			+ '<li><a href="#"><span class="meta">8</span> Wet Bulb</a></li>'
			+ '<li><a href="#"><span class="meta">56</span> Humidity</a></li>'
			+ '<li><a href="#"><span class="meta">56</span> Wind Direction</a></li>'
			+ '<li><a href="#"><span class="meta">'
			+ stnObj.getWindSpeed()
			+ '</span> Wind Speed</a></li>'
			+ '<li><a href="#"><span class="meta">'
			+ stnObj.getRain()
			+ '&rdquo;</span> Rainfall</a></li>'
			+ '</ol>'
			+ '</div>'
			+ '<a href="map.html" class="backToMap"><img src="img/map.png"/> Back to Map</a>'
}
/*
 * @function createInfoBox: create information box based on the given station
 * object @para:Station stnObj @return: InfoBox ib
 * 
 */

/*
 * @function createStnObjs: make Station objects by the given associate array it
 * makes much easier when display different type of station infomation.
 * @para:Object[] station @return: Station[] stnObjs
 * 
 */
function createStnObjs(stations, tag) {
	var stnObjs = [];
	for ( var i = 0; i < stations.length; i++) {
		stnObjs[i] = Station.createStnObj(stations[i], tag);
	}
	return stnObjs;
}

function getBounds(map) {
	var bound = {};
	var bounds = map.getBounds();
	var sw = bounds.getSouthWest();
	var ne = bounds.getNorthEast();
	bound.lowLat = sw.lat();
	bound.lowLng = sw.lng();
	bound.highLat = ne.lat();
	bound.highLng = ne.lng();
	bound.toString = function() {
		return "Lat:[" + bound.lowLat + "," + bound.highLat + "] Lng:["
				+ bound.lowLng + "," + bound.highLng + "]";
	}
	bound.pixelsPerRadLat = function() {
		// Detecting user's screen size using window.screen
		// alert(window.screen.availHeight);
		return screenHeight / (bound.highLat - bound.lowLat);
	}
	bound.pixelsPerRadLng = function() {
		// Detecting user's screen size using window.screen
		return screenWidth / (bound.highLng - bound.lowLng);
	}
	bound.ignore = function(preBound) {
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
	var eligiableStns = [];
	var j = 0;
	for ( var i = 0; i < stations.length; i++) {
		if (stations[i].lat > bound.lowLat + 0.01
				&& stations[i].lat < bound.highLat - 0.01
				&& stations[i].lng > bound.lowLng + 0.01
				&& stations[i].lng < bound.highLng - 0.01) {
			if (stations[i].getTemp() !== 'NA') {
				eligiableStns[j] = stations[i];
				j++;
			}
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
	for ( var i = 0; i < stations.length; i++) {
		var overlap = false;
		for ( var j = 0; j < noOverLapStns.length; j++) {
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
	// Set CSS for the control border
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = 'white';
	controlUI.style.borderStyle = 'solid';
	// controlUI.style.borderWidth = '2px';
	// controlUI.style.cursor = 'pointer';
	// controlUI.style.textAlign = 'center';
	// controlUI.title = 'Click to set the map to Home';
	controlUI.innerHTML = '<div>' + '<label id="checkbox"onclick="checked()">'
			+ '<input id="fawn" type="checkbox" >' + 'Fawn' + '</label>'
			+ ' </div>' + '<div>'
			+ '<label id="checkbox2"onclick="checked2()">'
			+ ' <input id="madis" type="checkbox">' + ' Madis' + ' </label>'
	'</div>' + '<div>' + '<label id="checkbox3"onclick="checked3()">'
			+ '<input id="grower" type="checkbox" >' + 'Grower' + '</label>'
			+ ' </div>';
	controlDiv.appendChild(controlUI);
	controlText = document.createElement('div');
	controlText.innerHTML = '<div>'
			+ '<label id="checkbox3"onclick="checked3()">'
			+ '<input id="grower" type="checkbox" >' + 'Grower' + '</label>'
			+ ' </div>';
	controlUI.appendChild(controlText);
	google.maps.event.addDomListener(controlUI, 'click', function() {
		// alert("click");
		previousData = [];
		flag1 = checked();
		flag2 = checked2();
		flag3 = checked3();
		// alert(flag1);
		if (flag1 == true && flag2 == false && flag3 == false) {
			loadFawn();
		} else if (flag2 == true && flag1 == false && flag3 == false) {
			loadMadis();
		} else if (flag3 == true && flag1 == false && flag2 == false) {
			loadGrower();
		} else if (flag1 == true && flag2 == true && flag3 == false) {
			loadFawn();
			loadMadis();
		} else if (flag1 == true && flag3 == true && flag2 == false) {
			loadFawn();
			loadGrower();
		} else if (flag2 == true && flag3 == true && flag1 == false) {
			loadMadis();
			loadGrower();
		} else if (flag1 == true && flag3 == true && flag2 == true) {
			loadFawn();
			loadGrower();
			loadMadis();
		} else {
			fillDataSeperately(previousData);
		}
	});

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
	var location = new Array(2);
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	location[0] = lat;
	location[1] = lng;
	// alert(location[0]);
	// alert(lng);
	map.setCenter(new google.maps.LatLng(lat, lng));
}
function initMap() {
	// alert("initial");
	var weather_style = [ {
		featureType : "administrative",
		elementType : "labels",
		stylers : [ {
			visibility : "off"
		} ]
	}, {
		featureType : "poi",
		elementType : "labels",
		stylers : [ {
			visibility : "off"
		} ]
	}, {
		featureType : "water",
		elementType : "labels",
		stylers : [ {
			visibility : "on"
		} ]
	}, {
		featureType : "road",
		elementType : "labels",
		stylers : [ {
			visibility : "off"
		} ]
	} ];
	// set the center of the map
	var centerLatLng = new google.maps.LatLng(28.2967, -81.3668);
	var map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControlOptions : {
			mapTypeIds : [ 'weather' ]
		},
		// center: centerLatLng,
		zoom : 9,
		mapTypeId : 'weather'
	});
	map.mapTypes.set('weather', new google.maps.StyledMapType(weather_style, {
		name : 'weather'
	}));
	var homeControlDiv = document.createElement('div');
	var homeControl = new DataControl(homeControlDiv, map);
	homeControlDiv.index = -1;
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(homeControlDiv);
	getLocation();
	return map;

}
