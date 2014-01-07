var growerStnData = [];
var geocoder;
var map;
var boundchangedTask;

function MyCntrl($scope) {
	var STATION_NAME_URL = "http://fdacswx.fawn.ifas.ufl.edu/index.php/test/read/station/format/json";
	var GROWER_OBZ_URL = 'http://fdacswx.fawn.ifas.ufl.edu/index.php/read/latestobz/format/json';
	var FAWN_STATION_URL = "http://fawn.ifas.ufl.edu/station/station.php?id=";
	var FAWN_OBZ_URL = 'http://fawn.ifas.ufl.edu/controller.php/latestmapjson/';
	var MADIS_OBZ_URL = 'http://fawn.ifas.ufl.edu/controller.php/nearbyNonFawn/all/';
	var fawnStnData = [];
	var madisStnData = [];
	var currentStationID;
	var graphchart;
	var seriesData = [];
	var wetBulbTemper = [];
	var dryBulbTemper = [];
	var rainfall = [];
	var newTitle;
	var seriesName;
	var id = "weather data";
	var idToGrowerName = [];
	var stationNameToId = [];
	var grower = new Array();
	var screenWidth = (window.screen.availWidth > 1680 ? 1680
			: window.screen.availWidth); // is it time consuming?
	// alert(screenWidth);
	var screenHeight = (window.screen.availHeight > 1050 ? 1050
			: window.screen.availHeight);
	var preInfoBox = null; // globel;
	var markers = []; // globel
	var previousData = [];// globel
	var checkboxTask; // globel
	var stationName = [];

	$scope.parameters = [ {
		"id" : "dry",
		"label" : "Dry Bulb Temperature"
	}, {
		"id" : "wet",
		"label" : "Web Bulb Temperature"
	}, {
		"id" : "rain",
		"label" : "Rainfall"
	} ];
	$scope.parameter = $scope.parameters[0];

	if ($.browser.msie && window.XDomainRequest) {
		// Use Microsoft XDR
		var xdr = new XDomainRequest();
		xdr.open("get", STATION_NAME_URL);
		xdr.onload = function() {
			var JSON = $.parseJSON(xdr.responseText);
			if (!JSON) {
				// JSON = $.parseJSON(data.firstChild.textContent);
				alert("Current has no station");
			} else {
				var stnObj = JSON;
				for ( var i = 0; i < stnObj.length; i++) {
					idToGrowerName[stnObj[i].id] = stnObj[i].grower_name;
					stationNameToId[stnObj[i].station_name] = stnObj[i].id;
					stationName[i] = stnObj[i].station_name;
					var key = stnObj[i].grower_name;
					if (grower.hasOwnProperty(key)) {
						grower[key][grower[key].length] = stnObj[i].id + "$$$"
								+ stnObj[i].station_name;
					} else {
						// alert(stnObj[i].id);
						var id = [];
						id[0] = stnObj[i].id + "$$$" + stnObj[i].station_name;
						grower[key] = id;
					}
				}
				var keys = Object.keys(grower);
				keys.sort(function(a, b) {
					return (a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0));
				});
				$("#stationName").autocomplete({
					source : stationName
				});
				$scope.growerOption = [];
				for ( var i = 0; i < keys.length; i++) {
					$scope.growerOption[i] = {
						"id" : keys[i],
						"label" : keys[i]
					};
				}
			}
		};
		xdr.onprogress = function() {
		};
		xdr.ontimeout = function() {
		};
		xdr.onerror = function() {
		};
		setTimeout(function() {
			xdr.send();
		}, 0);
	} else {
		$.getJSON(STATION_NAME_URL, function(data) {
			if (!data) {
				alert("Current has no station");
			} else {
				var stnObj = data;
				for ( var i = 0; i < stnObj.length; i++) {
					idToGrowerName[stnObj[i].id] = stnObj[i].grower_name;
					stationNameToId[stnObj[i].station_name] = stnObj[i].id;
					stationName[i] = stnObj[i].station_name;
					var key = stnObj[i].grower_name;
					if (grower.hasOwnProperty(key)) {
						grower[key][grower[key].length] = stnObj[i].id + "$$$"
								+ stnObj[i].station_name;
					} else {
						// alert(stnObj[i].id);
						var id = [];
						id[0] = stnObj[i].id + "$$$" + stnObj[i].station_name;
						grower[key] = id;
					}
				}
				var keys = Object.keys(grower);
				keys.sort(function(a, b) {
					return (a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0));
				});
				$("#stationName").autocomplete({
					source : stationName
				});
				$scope.growerOption = [];

				for ( var i = 0; i < keys.length; i++) {
					$scope.growerOption[i] = {
						"id" : keys[i],
						"label" : keys[i]
					};
				}

			}

		});
	}

	var fillStationByGrower = function() {
		$('#station').children('option:not(:first)').remove();
		var growerName = $scope.grower.label;
		$scope.stationOption = [];
		// alert($scope.grower.label);
		var id = grower[growerName];
		for ( var i = 0; i < id.length; i++) {
			var arr = id[i].split("$$$");
			$scope.stationOption[i] = {
				"id" : arr[0],
				"label" : arr[1]
			};
			$scope.parameter = $scope.parameters[0];
			// $scope.station = $scope.stationOption[0];
		}

	}

	$scope.growerChange = function() {

		fillStationByGrower();
		$scope.station = $scope.stationOption[0];
		displayWeatherInformation();
		fetchData();
	}
	$scope.stationChange = function() {
		fetchData();
		displayWeatherInformation();
	}
	$scope.parameterChange = function() {
		fetchData();
	}
	var fetchData = function() {
		// alert($scope.station.id);
		var url = 'http://test.fdacswx.fawn.ifas.ufl.edu/index.php/read/sevendaytimestamp/station_id/'
				+ $scope.station.id + '/format/json/';
		// if in IE browser
		if ($.browser.msie && window.XDomainRequest) {
			// Use Microsoft XDR
			var xdr = new XDomainRequest();
			xdr.open("get", url);
			xdr.onload = function() {
				var JSON = $.parseJSON(xdr.responseText);
				if (JSON == null || typeof (JSON) == 'undefined') {
					// JSON = $.parseJSON(data.firstChild.textContent);
					stnData = [];
					parseData(stnData);
				} else {
					var stnData = JSON;
					if (stnData != null) {
						parseData(stnData);
						// var test=graphchart.series[0].xData;
					}
				}
				if (!graphchart.get(id)) {
					addSeries(id, newTitle, seriesName);
				} else {
					updateSeries(id, newTitle, seriesName);
				}
			};
			xdr.onprogress = function() {
			};
			xdr.ontimeout = function() {
			};
			xdr.onerror = function() {
			};
			setTimeout(function() {
				xdr.send();
			}, 0);
		} else {
			$.getJSON(url, function(data) {
				if (data != null) {
					$("#noDataError").empty();
					var stnData = data;
					parseData(stnData);
				} else {
					$("#noDataError").html("<label> Current No Data<label>")
							.css("color", "red");
					;
					var stnData = [];
					parseData(stnData);
				}

				if (!graphchart.get(id)) {
					addSeries(id, newTitle, seriesName);
				} else {
					updateSeries(id, newTitle, seriesName);
				}

			});
		}
	}

	var parseData = function(stnData) {
		var dataType = $scope.parameter.id;
		if (dataType == "wet") {
			newTitle = 'Graphic Weather Data (Temperature F)';
			seriesName = "Wet Bulb Temperature";
			wetBulbTemper = [];
			for ( var i = 0; i < stnData.length; i++) {
				// parse JSON style:{"obz_temp":"82","local_time":"2013-08-07
				// 17:00:00 EDT"} to highcart style: [1375902000000,82]
				var temperPoint = [];
				temperPoint[0] = stnData[i].date_time;// time stamp:
														// 1375902000000
				if (stnData[i].wet_bulb_temp == null) {
					temperPoint[1] = null;
				} else {
					temperPoint[1] = parseInt(stnData[i].wet_bulb_temp);
				}
				wetBulbTemper[i] = temperPoint;
			}
			seriesData = wetBulbTemper;
		} else if (dataType == "dry") {
			newTitle = 'Graphic Weather Data (Temperature F)';
			seriesName = "Dry Bulb Temperature"
			dryBulbTemper = [];
			for ( var i = 0; i < stnData.length; i++) {

				// parse JSON style:{"obz_temp":"82","local_time":"2013-08-07
				// 17:00:00 EDT"} to highcart style: [1375902000000,82]
				var temperPoint = [];
				temperPoint[0] = stnData[i].date_time;
				if (stnData[i].dry_bulb_air_temp == null) {
					temperPoint[1] = null;
				} else {
					temperPoint[1] = parseInt(stnData[i].dry_bulb_air_temp);
				}
				dryBulbTemper[i] = temperPoint;
			}
			seriesData = dryBulbTemper;

		} else {
			newTitle = 'Graphic Weather Data (Rainfall inch)';
			seriesName = "Rainfall"
			rainfall = [];
			for ( var i = 0; i < stnData.length; i++) {
				// parse JSON style:{"obz_temp":"82","local_time":"2013-08-07
				// 17:00:00 EDT"} to highcart style: [1375902000000,82]
				var rainfallPoint = [];
				rainfallPoint[0] = stnData[i].date_time;
				if (stnData[i].rainfall == null) {
					rainfallPoint[1] = null;
				} else {
					rainfallPoint[1] = parseFloat(stnData[i].rainfall);
				}
				rainfall[i] = rainfallPoint;
			}
			seriesData = rainfall;

		}
	}
	$scope.intialChart = function() {
		Highcharts.setOptions({ // This is for all plots, change Date axis to
								// local timezone
			global : {
				useUTC : false
			}
		});
		// Create the chart
		graphchart = new Highcharts.StockChart({
			chart : {
				renderTo : 'container',
				defaultSeriesType : 'line'
			},
			
			rangeSelector : {
				buttons : [ {
					type : 'minute',
					count : 240,
					text : '4h'
				}, {
					type : 'day',
					count : 0.5,
					text : '12h'
				}, {
					type : 'day',
					count : 1,
					text : '24h'
				}, {
					type : 'day',
					count : 3,
					text : '3d'
				}, {
					type : 'all',
					text : '7d'
				} ]

			},

			title : {
				text : 'Graphic Weather Data'
			},
			xAxis : {
				type : 'datetime',
				//minRange : 3600 * 1000
			}

		});

	}
	var addSeries = function(id, newTitle, name) {
		graphchart.setTitle({
			text : newTitle
		});
		var stnSeries = {
			name : name,
			id : id,
			data : seriesData,
			tooltip : {

				valueDecimals : 2
			},
			marker : {
				enabled : true,
				radius : 1
			}
		}
		graphchart.addSeries(stnSeries);

	}
	var updateSeries = function(id, newTitle, name) {
		graphchart.setTitle({
			text : newTitle
		});
		graphchart.get(id).update({
			name : name,
			data : seriesData
		});

	}
	var displayWeatherInformation = function() {
		var id = $scope.station.id;
		if ($.browser.msie && window.XDomainRequest) {
			// Use Microsoft XDR
			var xdr = new XDomainRequest();
			xdr.open("get", GROWER_OBZ_URL);
			xdr.onload = function() {
				var JSON = $.parseJSON(xdr.responseText);
				var growerStn = JSON;
				for ( var i = 0; i < growerStn.length; i++) {
					if (growerStn[i].station_id == id) {
						$scope.currentStation = growerStn[i];
						break;
					}
				}
				for ( var name in $scope.currentStation) {
					if ($scope.currentStation[name] === null
							|| $scope.currentStation[name] == '9999') {
						$scope.currentStation[name] = 'NA';
					}
				}
				$scope
						.$apply(function() {
							$scope.stnID = $scope.currentStation.station_id;
							$scope.stnName = $scope.currentStation.station_name;
							$scope.stnLat = $scope.currentStation.latitude;
							$scope.stnLng = $scope.currentStation.longitude;
							$scope.windDirection = $scope.currentStation.wind_direction;
							$scope.humidity = $scope.currentStation.humidity
							$scope.webBulbTemp = $scope.currentStation.wet_bulb_temp;
							$scope.rain = $scope.currentStation.rainfall;
							$scope.totalRain = Math
									.round(Number($scope.currentStation.total_rain_inche_since_installed) * 100) / 100
							$scope.temperature = $scope.currentStation.dry_bulb_air_temp;
							$scope.windSpeed = $scope.currentStation.wind_speed;
							$scope.dateTime = $scope.currentStation.date_time;
						});
			};
			xdr.onprogress = function() {
			};
			xdr.ontimeout = function() {
			};
			xdr.onerror = function() {
			};
			setTimeout(function() {
				xdr.send();
			}, 0);
		} else {
			$
					.getJSON(
							GROWER_OBZ_URL,
							function(data) {
								var growerStn = data;
								for ( var i = 0; i < growerStn.length; i++) {
									if (growerStn[i].station_id == id) {
										$scope.currentStation = growerStn[i];
										break;
									}
								}
								for ( var name in $scope.currentStation) {
									if ($scope.currentStation[name] === null
											|| $scope.currentStation[name] == '9999') {
										$scope.currentStation[name] = 'NA';
									}
								}
								$scope
										.$apply(function() {
											if ($scope.currentStation.fresh) {
												$scope.fresh = 'Current (updated every 15 min)';
												$("#fresh").css('color',
														'black');
											} else {
												$scope.fresh = 'This station has not been updated since '
														+ $scope.currentStation.date_time;
												$("#fresh").css('color', 'red');
											}
											$scope.stnID = $scope.currentStation.station_id;
											$scope.stnName = $scope.currentStation.station_name;
											$scope.stnLat = $scope.currentStation.latitude;
											$scope.stnLng = $scope.currentStation.longitude;
											$scope.windDirection = $scope.currentStation.wind_direction;
											$scope.humidity = $scope.currentStation.humidity
											$scope.webBulbTemp = $scope.currentStation.wet_bulb_temp;
											$scope.rain = $scope.currentStation.rainfall;
											$scope.totalRain = Math
													.round(Number($scope.currentStation.total_rain_inche_since_installed) * 100) / 100
											$scope.temperature = $scope.currentStation.dry_bulb_air_temp;
											$scope.windSpeed = $scope.currentStation.wind_speed;
											$scope.dateTime = $scope.currentStation.date_time;
										});

							});
		}
	}

	$scope.initMap = function() {
		geocoder = new google.maps.Geocoder();
		loadData();
		/*
		 * if (navigator.geolocation) {
		 * navigator.geolocation.getCurrentPosition(showPosition); } else {
		 * 
		 * return; }
		 */

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
		var centerLatLng = new google.maps.LatLng(28.2967, -81.3668);
		var map = new google.maps.Map(document.getElementById('map'), {
			mapTypeControlOptions : {
				mapTypeIds : [ 'weather', 'satellite' ]
			},
			mapTypeControl : true,
			center : centerLatLng,
			zoom : 7,
			mapTypeId : 'weather'
		});
		map.mapTypes.set('weather', new google.maps.StyledMapType(
				weather_style, {
					name : 'weather'
				}));
		var homeControlDiv = document.createElement('div');
		var homeControl = new DataControl(homeControlDiv, map);
		homeControlDiv.index = -1;
		map.controls[google.maps.ControlPosition.RIGHT_TOP]
				.push(homeControlDiv);
		window.setInterval(loadData, 300000);
		return map;

	}
	map = $scope.initMap();

	function loadingPos() {
		if ($('#loading').css("display") != "block") {
			var mapwidth = $('#map').css("width");
			var mapheight = $('#map').css("height");
			$('#loading').css("left",
					(mapwidth.replace(/px/g, "") / 2 - 30) + "px");
			$('#loading').css("top",
					(mapheight.replace(/px/g, "") / 2 - 30) + "px");
			$('#loading').css("display", "block");
		}
	}

	// To avoid the IE abort data
	// http://www.cypressnorth.com/blog/web-programming-and-development/internet-explorer-aborting-ajax-requests-fixed/
	function fetch(url, type) {
		url += "?" + new Date().getTime();
		if ($.browser.msie && window.XDomainRequest) {
			// Use Microsoft XDR
			var xdr = new XDomainRequest();
			xdr.open("get", url);
			xdr.onload = function() {
				var JSON = $.parseJSON(xdr.responseText);
				if (JSON == null || typeof (JSON) == 'undefined') {
					JSON = $.parseJSON(data.firstChild.textContent);
				}
				var Stns = JSON;
				if (type == 1) {
					var StnObjs = createStnObjs(Stns.stnsWxData, type);
					fawnStnData = StnObjs;
					// alert("1 "+fawnStnData.length);
				} else if (type == 2) {
					var StnObjs = createStnObjs(Stns, type);
					madisStnData = StnObjs;
					// alert("2 "+madisStnData.length);
				} else if (type == 3) {
					var StnObjs = createStnObjs(Stns, type);
					growerStnData = StnObjs;
					// alert("3 "+growerStnData.length);
				}
				setTimeout(function() {
					updateMarkers();
				}, 1200);
			};
			xdr.onprogress = function() {
			};
			xdr.ontimeout = function() {
			};
			xdr.onerror = function() {
			};
			setTimeout(function() {
				xdr.send();
			}, 0);

		} else {
			$.getJSON(url, function(data) {
				Stns = data;
				if (type == 1) {
					var StnObjs = createStnObjs(Stns.stnsWxData, type);
					fawnStnData = StnObjs;
				} else if (type == 2) {
					var StnObjs = createStnObjs(Stns, type);
					madisStnData = StnObjs;
				} else if (type == 3) {
					var StnObjs = createStnObjs(Stns, type);
					growerStnData = StnObjs;
				}
				setTimeout(function() {
					updateMarkers();
				}, 1200);
			});
		}
	}

	/*
	 * @function createInfoBox: create information box based on the given
	 * station object @para:Station stnObj @return: InfoBox ib
	 * 
	 */
	var createInfoBox = function(stnObj) {
		loadingPos();
		// alert(stnObj.lat+" "+stnObj.lng);
		if (stnObj.type == "GROWER") {
			var boxText = document.createElement("div");
			var weatherInfor = document.getElementById("weatherInfo");
			currentStationID = stnObj.stnID;
			for ( var i = 0; i < $scope.growerOption.length; i++) {
				if ($scope.growerOption[i].label == idToGrowerName[currentStationID]) {
					$scope.grower = $scope.growerOption[i];
					break;
				}
			}
			fillStationByGrower();
			for ( var i = 0; i < $scope.stationOption.length; i++) {
				if ($scope.stationOption[i].id == currentStationID) {
					$scope.station = $scope.stationOption[i];
					break;
				}
			}

			fetchData();
			displayWeatherInformation();
			setTimeout(function() {
				$("#growerPopup").dialog("open");
			}, 200);
			// $("#dialog1").dialog("open");

		} else {
			$scope.$apply(function() {
				$scope.mStnName = stnObj.getStationTitle();
				$scope.mStnID = stnObj.stnID;
				$scope.mStnLat = stnObj.lat;
				$scope.mStnLng = stnObj.lng;
				$scope.elev = stnObj.elevFt;
				$scope.mTemperature = stnObj.getTemp();
				$scope.mWindSpeed = stnObj.getWindSpeed();
				$scope.mRain = stnObj.getRain();
				$scope.mDateTime = stnObj.getDateTime();
			});
			$("#madisDialog").dialog("open");
		}
		setTimeout(function() {
			$('#loading').css("display", "none");
		}, 2000);
	}

	function loadData() {
		fetch(GROWER_OBZ_URL, 3);
		fetch(FAWN_OBZ_URL, 1);
		fetch(MADIS_OBZ_URL, 2);
	}

	function fillData(StnObjs) {
		previousData = previousData.concat(StnObjs);
	}

	function showData() {

		// alert(previousData.length);
		fillDataSeperately(previousData);
		boundAjusted();
	}

	function boundAjusted() {

		google.maps.event.addListener(map, 'bounds_changed', function() {
			loadingPos();
			clearTimeout(boundchangedTask);
			// //console.log("cleaTimeout");
			boundchangedTask = setTimeout(function() {
				fillDataSeperately(previousData);
				// console.log("fillData");
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
		// //console.log (newObjs.length);
		var time2 = new Date().getTime();
		var inBoundNewObjs = filter(newObjs, bound);
		var time3 = new Date().getTime();
		// //console.log(inBoundNewObjs.length);
		var noOverlapNewObjs = removeOverlap([], inBoundNewObjs, bound
				.pixelsPerRadLat(), bound.pixelsPerRadLng());
		var time4 = new Date().getTime();
		// alert("noOverlapNewObjs:"+noOverlapNewObjs.length);
		clearOverlays(markers);
		var time5 = new Date().getTime();
		markers = loadStnMarkers(noOverlapNewObjs);
		var time6 = new Date().getTime();
		preBound = bound;

		// console.log ("====filldata total: "+(time6-time2)+"======");
		// console.log ("markers length :" + markers.length);
		// console.log ("filter: "+(time3-time2));
		// console.log ("removeoverlap: "+(time4-time3));
		// console.log ("clearoverlay: "+(time5-time4));
		// console.log ("loadmarker: "+(time6-time5));
		setTimeout(function() {
			$('#loading').css("display", "none");
		}, 500);

	}

	function clearOverlays(markers) {
		if (Object.prototype.toString.call(markers) === '[object Array]') {
			// //console.log("/////////////marker length"+markers.length);
			for ( var i = 0; i < markers.length; i++) {
				var time1 = new Date().getTime();
				markers[i].setMap(null);
				var time2 = new Date().getTime();
				/*
				 * if((time2-time1)>=40){
				 * //console.log("makers"+markers[i].labelContent);
				 * //console.log("set time: "+(time2-time1)); }
				 */
			}
		}
	}

	function loadStnMarkers(stnObjs) {
		var image = 'image/marker.png';
		var markers = [];
		for ( var i = 0; i < stnObjs.length; i++) {
			markers[i] = new MarkerWithLabel({
				position : new google.maps.LatLng(stnObjs[i].lat,
						stnObjs[i].lng),
				draggable : false,
				raiseOnDrag : false,
				map : map,
				labelContent : stnObjs[i].getLabelContent(),
				labelAnchor : new google.maps.Point(22, 0),
				labelClass : "labels", // the CSS class for the label
				// labelStyle: {opacity: 0.85},
				icon : image
			});
			bindInfoBox(markers[i], stnObjs[i]);
		}
		return markers;
	}

	function bindInfoBox(marker, stnObj) {
		google.maps.event.addListener(marker, "click", function(e) {
			if (stnObj.type == "FAWN") {
				// var boxText = document.createElement("div");
				// var
				// href="http://fawn.ifas.ufl.edu/station/station.php?id="+stnObj.stnID;
				var href = FAWN_STATION_URL + stnObj.stnID;
				window.location = href;
			} else {
				var ib = createInfoBox(stnObj)
				/*
				 * ib.open(map, this); // close previous information box if
				 * (preInfoBox != null) { preInfoBox.close(); } preInfoBox = ib;
				 */
			}
		});
	}

	/*
	 * @function createStnObjs: make Station objects by the given associate
	 * array it makes much easier when display different type of station
	 * infomation. @para:Object[] station @return: Station[] stnObjs
	 * 
	 */
	function createStnObjs(stations, tag) {
		var time1 = new Date().getTime();
		var stnObjs = [];
		for ( var i = 0; i < stations.length; i++) {
			// we get rid of 2/3 madis stations
			// since the ie is slow
			/*
			 * if(tag == 2 && i%3 == 0){ continue; }
			 */

			stnObjs[stnObjs.length] = Station.createStnObj(stations[i], tag);
		}
		var time2 = new Date().getTime();
		// console.log("create: "+(time2-time1));
		return stnObjs;
	}

	function getBounds(map) {
		// alert("map: "+map.getZoom());
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
	 * @function filter: kick out the stations of which 1. the lat & lng are not
	 * in the bound. @return: Station[] eligiableStns
	 * 
	 */
	function filter(stations, bound) {
		// alert(bound);
		var eligiableStns = [];
		var j = 0;
		for ( var i = 0; i < stations.length; i++) {
			if (stations[i].lat > bound.lowLat
					&& stations[i].lat < bound.highLat
					&& stations[i].lng > bound.lowLng
					&& stations[i].lng < bound.highLng) {
				eligiableStns[j] = stations[i];
				j++;

			}
		}
		return eligiableStns;
	}

	/*
	 * @function removeOverlap: keep the stations having no overlap
	 * @para:Station[] stations @para:Bound bound @return: Station[]
	 * noOverLapStns
	 * 
	 */
	function removeOverlap(noOverLapStns, stations, pixelPerRadLat,
			pixelPerRadLng) {
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

		var controlFawn = document.createElement('div');
		controlFawn.style.backgroundColor = 'white';
		controlFawn.style.borderStyle = 'solid';
		controlFawn.innerHTML = '<div>'
				+ 'Please select your <br/> source of weather <br />station. Zoom in to<br /> see more stations<br /><label class="fawnLabel" id="checkbox"onclick="fawnCheck()">'
				+ '<input id="fawn" type="checkbox" >' + 'Fawn' + '</label>'
				+ ' </div>'

		controlDiv.appendChild(controlFawn);
		controlMadis = document.createElement('div');
		controlMadis.innerHTML = '<div>'
				+ '<label class="madisLabel" id="checkbox2"onclick="madisCheck()">'
				+ '<input id="madis" type="checkbox">' + 'Madis' + '</label>'
				+ '</div>';
		controlFawn.appendChild(controlMadis);
		controlGrower = document.createElement('div');
		controlGrower.innerHTML = '<div>'
				+ '<label class="gladStoneFamilyLabel" id="checkbox3"onclick="growerCheck()">'
				+ '<input id="grower" type="checkbox" checked >' + 'Grower'
				+ '</label>' + '</div>';
		controlFawn.appendChild(controlGrower);

		google.maps.event.addDomListener(controlFawn, 'click', function() {
			/*
			 * check box update only update map by 1.2 seconds (no quick than)
			 * to fix issue pointed out by Camilo If I un-select or select one
			 * type of weather station, sometimes it takes a few seconds before
			 * those weather stations are removed from or added to the view;
			 * sometimes I have to un-select and select them several times,
			 * before anything happens
			 */
			loadingPos();
			clearTimeout(checkboxTask);
			// console.log("clear check chekboxTask");
			checkboxTask = setTimeout(function() {
				updateMarkers();
			}, 1200);

		});

	}

	function updateMarkers() {
		// console.log("==updateMarkers==");
		previousData = null;
		previousData = [];
		var flag1 = fawnCheck();
		var flag2 = madisCheck();
		var flag3 = growerCheck();
		// load grower first
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

	$scope.intialChart();

}
var newMarker;
function codeAddress() {
	// var address = document.getElementById('address').value;
	var stationName = document.getElementById('stationName').value;
	var result = $.grep(growerStnData, function(e) {
		return e.stnName == stationName;
	});
	if (result.length == 0) {
		alert("Please make sure that you enter the right station name!");
		return;
	}
	var address = result[0].lat + ", " + result[0].lng;
	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (newMarker != undefined) {
				newMarker.setMap(null);
			}
			map.setCenter(results[0].geometry.location);
			newMarker = new google.maps.Marker({
				map : map,
				position : results[0].geometry.location
			});
			map.setZoom(11);
		} else {
			alert('Geocode was not successful for the following reason: '
					+ status);
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
	var location;
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	location[0] = lat;
	location[1] = lng;
	alert(location[0]);
	// alert(lng);
	map.setCenter(new google.maps.LatLng(lat, lng));
}

function fawnCheck() {
	if (document.getElementById("fawn") != null
			&& document.getElementById("fawn").checked) {
		return true;
	} else
		return false;
}

function madisCheck() {
	if (document.getElementById("madis") != null
			&& document.getElementById("madis").checked)
		return true;
	else
		return false;

}

function growerCheck() {
	if (document.getElementById("grower") != null
			&& document.getElementById("grower").checked)
		return true;
	else
		return false;

}