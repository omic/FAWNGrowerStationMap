/*
"station_id":"KNSE","station_name":"KNSE","time":"12\/9\/2012 11:43 AM CST","source":"ASOS","temps":75.2,"latitude":"30.719999","longitude":"-87.019997","rain":9999,"distance2fawn_mile":"8.1","station_addr":"Whiting Field NAS North"
*/
function MadisStation(arr) {
	this.stnName = arr.station_name;
	this.stnID = arr.station_id;
	this.elevFt = 'NA';
	this.lng = this.round(arr.longitude,3);
	this.lat =  this.round(arr.latitude,3);
	this.type = "MADIS";
	this.tempF = (arr.temps=='9999'?'NA':this.round(arr.temps,0)) ;
	this.rainInch = (arr.rain=='9999'?'NA':arr.rain);
           this.datetime = arr.time;
}
MadisStation.prototype = new Station();

MadisStation.prototype.getRain=function(){
	return this.rainInch;
}
MadisStation.prototype.getTemp=function(){
	return this.tempF;
}
MadisStation.prototype.getWindSpeed=function(){
	return "NA";
}
MadisStation.prototype.getDateTime = function(){
	return this.datetime;
}
MadisStation.prototype.getLabelContent = function(){
	var html = '<div class="madisLabel">'+
		this.tempF+
		'&deg;F'+
		'</div>';
	return html;
}