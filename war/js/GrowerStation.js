/*
 * "station_id":"1368479169139","date_time":"2013-05-30 14:15:00","dry_bulb_air_temp":"88.9","wet_bulb_temp":"75.65","humidity":"54.31","wind_speed":"4.171","wind_direction":"88","rainfall":"0","latitude":"25.123456","longitude":"87.1234","station_name":"KevinTower"
 */


function GrowerStation(arr) {
	this.stnName = arr.station_name;
	this.stnID = arr.station_id;
	this.elevFt = 'NA';
	this.lng = arr.longitude;
	this.lat =  arr.latitude;
	this.type = "GROWER";
	this.temper = (arr.temps=='9999'?'NA':this.round(arr.dry_bulb_air_temp,0)) ;
	this.rainfall = (arr.rainfall=='9999'?'NA':arr.rainfall);
    this.datetime = arr.date_time;
    this.windspeed=arr.wind_speed;
    this.humidity=arr.humidity;
    this.winddirection=arr.wind_direction;
    this.wet_bulb_temp=arr.wet_bulb_temp;
    //alert("whahahaha "+this.lat);
}
GrowerStation.prototype = new Station();
GrowerStation.prototype.getRain=function(){
	return this.rainfall;
}
GrowerStation.prototype.getTemp=function(){
	return this.temper;
}
GrowerStation.prototype.getWindSpeed=function(){
	return this.windspeed;
}
GrowerStation.prototype.getDateTime = function(){
	return this.datetime;
}
GrowerStation.prototype.getLabelContent = function(){
	var html = '<div class="gladStoneFamilyLabel">'+
		this.temper+
		'&deg;F'+
		'</div>';
	return html;
}