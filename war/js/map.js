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
                + '<td class="nobr dtr">Station ID:'
                + stnObj.stnID
                + '</td>'
                + '<td class="nobr dtr">Lat: <span>'
                + stnObj.lat
                + '</span></td>'
                + '</tr>'

                + '<tr>'
                + '<td class="nobr dtr">Lon: <span>'
                + stnObj.lng
                + '</span></td>'
                + '<td class="nobr">Elev: <span>'
                + stnObj.elevFt
                + ' ft</span></td>'
                + '</tr>'

                + '<tr>'
                + '<td class="nobr dtr">Date Time:'
                + stnObj.getDateTime()
                + '</td>'
                + '<td class="nobr dtr">Humadity: <span>'
                + stnObj.humidity
                + '</span></td>'
                + '</tr>'

                + '<tr>'
                + '<td class="nobr dtr">Wet Bulb Temp:<span>'
                + stnObj.wet_bulb_temp
                + '</span></td>'
                + '<td class="nobr dtr">Wind Direction: <span>'
                + stnObj.winddirection
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