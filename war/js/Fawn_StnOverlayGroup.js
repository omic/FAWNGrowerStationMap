
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function StnOverlayGroup(fawnStn, nonFawnStns, map) {
 this.fawnStn = fawnStn;
 this.nonFawnStns= nonFawnStns;
 this.map = map
 this.fawnLabel = null;
 this.nonFawnStnLabels = [];
 this.visibleStnLabels = [];
 this.initStnOverlays();
 var obj = this;
 /*
  * The projection object is created after the map is idle after panning / zooming. 
  * So, a better solution is to listen on the idle event of the google.maps.Map object, 
  * and get a reference to the projection
  */
 google.maps.event.addListener(map, 'idle', function() {
   obj.renderOverlays();
})


 google.maps.event.addListener(map, 'zoom_changed', function () {
       obj.renderOverlays();
 });
}

StnOverlayGroup.prototype.initStnOverlays = function(){
    //add fawn station to map
    var latLng = new google.maps.LatLng(this.fawnStn.lat,this.fawnStn.lng);
    this.fawnLabel = new StnOverlay(this.map, this.fawnStn.temp2mF,this.fawnStn.stnName,latLng, true);
    //add 8 non fawn stations to map
    var i = 0;
    for(i=0; i < this.nonFawnStns.length; i++){
        var stn = this.nonFawnStns[i];
        latLng = new google.maps.LatLng(stn.latitude,stn.longitude);
        this.nonFawnStnLabels[i] = new StnOverlay(this.map, stn.temps, stn.station_id, latLng, false);
    }
}

StnOverlayGroup.prototype.setVisibilty=function(flag){
    if(flag==true){
        this.fawnLabel.show();
        var i;
        for(i=0; i < this.nonFawnStnLabels.length; i++){
            this.nonFawnStnLabels[i].show();
        }
    }else{
        this.fawnLabel.hide();
        var i;
        for(i=0; i < this.nonFawnStnLabels.length; i++){
            this.nonFawnStnLabels[i].hide();
        }
    }
}

StnOverlayGroup.prototype.renderOverlays = function(){
    var i, j;
    //Hide all the stations
    this.setVisibilty(false);
    this.visibleStnLabels = [];
    //We always show FAWN station
    this.visibleStnLabels[0] = this.fawnLabel;
    this.fawnLabel.show();
    //Traverse all the nearby non Fawn Stations,
    //For each non Fawn station, calculate the distance to each visible station
    for(i = 0; i < this.nonFawnStnLabels.length; i++){
        for(j = 0; j < this.visibleStnLabels.length; j++){
            var pixel = this.getPixelDistance(this.visibleStnLabels[j],this.nonFawnStnLabels[i]);
            if(pixel <50){
                //may be overlay with one visible
               this.nonFawnStnLabels[i].hide();
               break;
            }
        }
        if(j===this.visibleStnLabels.length){
            //if enter here, current non Fawn station is not overlayed with all the other visible. We should show it
            this.visibleStnLabels[this.visibleStnLabels.length] = this.nonFawnStnLabels[i];
            this.nonFawnStnLabels[i].show();
        }
    }
}

StnOverlayGroup.prototype.getPixelDistance = function(label1, label2){
    var projection = label1.getProjection();
     var position = projection.fromLatLngToDivPixel(label1.latLng);
     var x1 = position.x;
     var y1 = position.y;
     projection = label2.getProjection();
     position = projection.fromLatLngToDivPixel(label2.latLng);
     var x2 = position.x;
     var y2 = position.y;
     var d = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2) *(y1-y2));
     return d;
}



