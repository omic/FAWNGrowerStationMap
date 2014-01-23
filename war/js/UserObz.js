/*
 * "user_id" : "guess","UTC" : "Sat Jun 15 03:49:44 UTC 2013","temperature" : "35","latitude" : "29.70657621662255","longitude" : "-82.3608055850211"
 */
function UserStation(arr) {
	this.stnName = arr.user_id;
	this.stnID = arr.user_id;
	this.elevFt = 'NA';
	this.lng = arr.longitude;
	this.lat =  arr.latitude;
	this.type = "USER";
	this.temper = arr.temperature;
/*
	this.rainfall = (arr.rainfall=='9999'?'NA':arr.rainfall);
    this.datetime = arr.UTC;
    this.windspeed=arr.wind_speed;
    this.humidity=arr.humidity;
    this.winddirection=arr.wind_direction;
    this.wet_bulb_temp=arr.wet_bulb_temp;
*/
	this.rainfall = null;
    this.datetime = arr.UTC;
    this.expiretime = arr.Expire;
    this.windspeed = null;
    this.humidity = null;
    this.winddirection = null;
    this.wet_bulb_temp = null;
    
	//alert(this.temper);
}
UserStation.prototype = new Station();

UserStation.prototype.getRain=function(){
	return this.rainfall;
}
UserStation.prototype.getTemp=function(){
	return this.temper;
}
UserStation.prototype.getWindSpeed=function(){
	return this.windspeed;
}
UserStation.prototype.getDateTime = function(){
	return this.datetime;
}
UserStation.prototype.getExpireTime = function(){
	return this.expiretime;
}
UserStation.prototype.getLabelContent = function(){
	var html = '<div class="userEnteredDataLabel">'+
		this.temper+
		'&deg;F'+
		'</div>';
	return html;
}