function Station(arr) {
	
}
//static
Station.createStnObj = function(arr,tag){
	//alert("asdfds"+arr.latitude);
	//alert("tag"+ tag);
	if(tag==1){
		//alert("Fawn");
		return new FawnStation(arr);
	}else if(tag==2){//latitude
		return new MadisStation(arr);
	}else if(tag==3){
		//alert("world"+ arr.latitude);
		//alert("testesteset"+arr.latitude);
		
		//var x=new GrowerStation(arr);
		//alert("xxxxx"+x);
		return new GrowerStation(arr);
	}
	else{
		return new GladStoneFamilyStation(arr);
	}
	
}
Station.prototype.getStationTitle = function(){
	if(this.type=="GROWER")
		return this.stnName;
	else
	return this.stnName + ' - ' +  this.type;
}
Station.prototype.round = function(num, precision){
 var base = 1;
 while(precision > 0){
	base *= 10;
	precision--;
 }
 return Math.round(num*base)/base;
}
Station.prototype.pixelDistance=function(stn, pixelPerRadLat, pixelPerRadLng){
	var y = (this.lat - stn.lat > 0 ? this.lat - stn.lat: stn.lat - this.lat);
	var x = (this.lng - stn.lng > 0 ? this.lng - stn.lng: stn.lng - this.lng);
	y = y * pixelPerRadLat;
	x = x * pixelPerRadLng;
	return Math.sqrt(x * x + y * y);
}

Station.prototype.toString = function(){
	var str = "";
	for(var key in this){
		if(this.hasOwnProperty(key)){
			str += key+":"+this[key]+",";
		}
	}
	return str;
}

