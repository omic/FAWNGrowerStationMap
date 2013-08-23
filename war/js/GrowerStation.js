/*
 * "station_id":"1368479169139","date_time":"2013-05-30 14:15:00","dry_bulb_air_temp":"88.9","wet_bulb_temp":"75.65","humidity":"54.31","wind_speed":"4.171","wind_direction":"88","rainfall":"0","latitude":"25.123456","longitude":"87.1234","station_name":"KevinTower"
 */


function GrowerStation(arr) {
	for(var name in arr) {
		if(arr[name]===null||arr[name]=='9999'){
			arr[name] = 'NA';
		}
	}
	//arr.dry_bulb_air_temp='NA';
	this.type = "GROWER";
	this.stnName = arr.station_name;
	this.stnID = arr.station_id;
	this.lng = arr.longitude;
	this.lat =  arr.latitude;
	this.temper = (arr.dry_bulb_air_temp==='NA'?'NA':this.round(arr.dry_bulb_air_temp,0))
	this.rainfall = arr.rainfall;
	this.datetime = arr.date_time;
	this.wind_speed=arr.wind_speed;
	this.humidity=arr.humidity;
	this.wind_direction=arr.wind_direction;
	this.wet_bulb_temp=arr.wet_bulb_temp;
	this.total_rainfall=arr.total_rain_inche_since_installed;
	this.vendor_name=arr.vendor_name;
}
GrowerStation.prototype = new Station();
GrowerStation.prototype.getRain=function(){

	if(this.vendor_name=="Ag-tronix"||this.vendor_name=="Rainwise"){
		return "NA"
	}
	else

	return this.rainfall;
}
GrowerStation.prototype.getTemp=function(){
		return this.temper;
	}
GrowerStation.prototype.getWindSpeed=function(){
	if(this.wind_speed=='NA')
		return this.wind_speed;
	else{
	var speed=Math.round(Number(this.wind_speed)* 100) / 100
	return speed;
	}
}
GrowerStation.prototype.getTotalRain=function(){
	if(this.vendor_name=="Ag-tronix"||this.vendor_name=="Rainwise"||this.total_rainfall=='NA'){
		return "NA"
	}
	else{
	var total_rain=Math.round(Number(this.total_rainfall)* 100) / 100
	return total_rain;
	}
}
GrowerStation.prototype.getDateTime = function(){
	return this.datetime;
}
GrowerStation.prototype.getLabelContent = function(){
	var html = '<div class="gladStoneFamilyLabel">'+
	     //'123'+
	this.temper+'&deg;F'+
		'</div>';
	return html;
}