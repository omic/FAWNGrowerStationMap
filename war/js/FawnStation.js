/*"stnName":"Alachua","stnID":"260","dateTimes":"12\/9\/2012 1:00 PM EST","isFresh":1,"temp2mF":69,"temp60cmF":73,"temp10mF":71,"soilTemp10cmF":66,
 * "rainFall2mInch":0,"relHum2mPct":95,"totalRad2mWm2":256,"windSpeed10mMph":6,"windDir10mDeg":292,"dewPoint2mF":68,"etInch":0.05,"bp2m":1012,
 * "xpos":260,"ypos":70,"elevation_feet":160,"lng":-82.41,"lat":29.803,"county":"ALACHUA","facility":"Dept. of Agronomy Forage Research Unit",
 * "minDailyTempF":55,"totalRainInch":0*/
function FawnStation(arr) {
	this.stnName = arr.stnName;
	this.stnID = arr.stnID;
	this.elevFt = arr.elevation_feet;
	this.lng = arr.lng;
	this.lat = arr.lat;
	this.type = "FAWN";
	this.temp2mF = arr.temp2mF;
	this.temp60cmF=arr.temp60cmF;
	this.temp10mF=arr.temp10mF;
	this.rainFall2mInch = arr.rainFall2mInch;
    this.dateTime = arr.dateTimes;
    this.windSpeed = arr.windSpeed10mMph;
    this.windDirction=arr.windDir10mDeg;
    this.relHum2mPct=arr.relHum2mPct;
    this.totalRad2mWm2=arr.totalRad2mWm2;
    this.dewPoint2mF=arr.dewPoint2mF;
    this.etInch=arr.etInch;
    this.bp2m=arr.bp2m;
   
   
  
    this.minDailyTemp=arr.minDailyTempF;
    
    
}
FawnStation.prototype = new Station();
FawnStation.prototype.getStationTitle = function(){
	return this.stnID + ' - ' + this.stnName + ' - ' +  this.type;
}
FawnStation.prototype.getRain = function(){
	return this.rainFall2mInch;
}
FawnStation.prototype.getTemp = function(){
	return this.temp2mF;
}
FawnStation.prototype.getDateTime = function(){
	return this.dateTime;
}
FawnStation.prototype.getWindSpeed=function(){
	return this.windSpeed;
}
FawnStation.prototype.getWindDirection=function(){
	return this.windDirction;
}
FawnStation.prototype.getHumidity=function(){
	return this.humidity;
}
FawnStation.prototype.getLabelContent = function(){
	var html = '<div class="fawnLabel">'+
		this.temp2mF+
		'&deg;F'+
		'</div>';
	return html;
}