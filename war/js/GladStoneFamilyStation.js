/*
 * "Time (UTC)","Barometric Pressure (mbar)","Temperature (degrees F)","Dewpoint (degrees F)","Relative Humidity (%)"
 * ,"Wind speed (mph)","Wind direction (degrees)","Analysis Barometric Pressure (mbar)","Analysis Temperature (degrees F)","Analysis Dewpoint (degrees F)"
 * ,"Analysis Relative Humidity (%)","Analysis Wind speed (mph)","Analysis Wind direction (degrees)"
 */
function GladStoneFamilyStation(arr) {
	for(var i = 0; i < arr.length;i++){
		this[GladStoneFamilyStation.names[i]] = arr[i];
	}
	//manual input get from http://weather.gladstonefamily.net/site/search?site=E0470
	this.stnName = 'E0470';
	this.stnID = 'E0470';
	this.lng =  -81.3668;
	this.lat = 28.2967;
	this.type = "Glad Stone Family Station";
	this.elevFt = 'NA';
           
}

GladStoneFamilyStation.names = ["Time","bp","tempF","dewPointF","relHumPct",
	"wspdMph","wdirDeg", "analysisBpMbar", "analysisTempF","analysisDewPointF",
	"analysisRelHumPct", "analysisWspdMph", "analysisWdirDeg"];

GladStoneFamilyStation.prototype = new Station();
GladStoneFamilyStation.prototype.getRain=function(){
	return 'NA';
}
GladStoneFamilyStation.prototype.getTemp=function(){
	return this.tempF;
}
GladStoneFamilyStation.prototype.getDateTime = function(){
	return this.Time;
}
GladStoneFamilyStation.prototype.getLabelContent = function(){
	var html = '<div class="gladStoneFamilyLabel">'+
		this.tempF+
		'&deg;F'+
		'</div>';
	return html;
}
GladStoneFamilyStation.prototype.getWindSpeed=function(){
	return this.wspdMph;
}

