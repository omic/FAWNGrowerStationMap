/* 
 * We use this class to display custom types of overlay objects on the map.
 * https://developers.google.com/maps/documentation/javascript/overlays#OverlaysOverview
 */


function StnOverlay(map, temp, stnName, latLng, isFawn) {
    // Initialization
    this.map = map;
    this.temp = temp;
    this.stnName = stnName;
    this.latLng = latLng;
    this.div = null;
    this.isFawn = isFawn;
    //Adds the overlay to the map. setMap will trigger onAdd();
    this.setMap(map);
	
};


//stnOverlay inherits from google.maps.OverlayView
StnOverlay.prototype = new google.maps.OverlayView();



/*  
 *  Implement onAdd
 *  This method to initialize the overlay DOM elements
 *  This method is called once after setMap() is called with a valid map. 
 *  At this point, panes and projection will have been initialized.
 */
StnOverlay.prototype.onAdd = function() {
    var div = document.createElement('div');
    div.style.border = "none";
    div.style.borderWidth = "0px";
    div.style.position = "absolute";
    if(this.isFawn===true){
        div.setAttribute('id','fawnStnLabel');
    }
    this.div = div;
    //api says: only available after draw has been called. but the example is written in this way.
    var panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(this.div);
	var me = this;
	// Add a listener - we'll accept clicks anywhere on this div, but you may want
	// to validate the click i.e. verify it occurred in some portion of your overlay.
	google.maps.event.addDomListener(div, 'click', function() {
		//google.maps.event.trigger(me, 'click');
		alert("abc");
	});
	
	
	
    
};

StnOverlay.prototype.getInfoBox = function(){
	var boxText = document.createElement("div");
	boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
	boxText.innerHTML = "City Hall, Sechelt<br>British Columbia<br>Canada";

	var myOptions = {
	 content: boxText
	,disableAutoPan: false
	,maxWidth: 0
	,pixelOffset: new google.maps.Size(-140, 0)
	,zIndex: null
	,boxStyle: { 
	  //background: "url('tipbox.gif') no-repeat",
	   opacity: 0.75,
	   width: "280px"
	 }
	,closeBoxMargin: "10px 2px 2px 2px"
	,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
	,infoBoxClearance: new google.maps.Size(1, 1)
	,isHidden: false
	,pane: "floatPane"
	,enableEventPropagation: false
	};
	return new InfoBox(myOptions);
}

/*  
 *  Implement onRemove
 *  This method to remove the elements from the DOM. 
 *  This method is called once following a call to setMap(null)
 */
StnOverlay.prototype.onRemove = function() {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
};


/* 
 * Implement draw
 * This method to draw or update the overlay
 * This method is called 
 * 1. after onAdd()  
 * 2. when the position from projection.fromLatLngToPixel() 
 *     would return a new value for a given LatLng.
 * When projection is changed, we to want re-draw the stnOverlay. 
 */
StnOverlay.prototype.draw = function() {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.latLng);
    var x = position.x-15;
    var y = position.y-10;
    this.div.style.left =  x+ 'px';
    this.div.style.top =  y + 'px';
    this.div.innerHTML = '<div class="tempLabel">'+
    this.temp+'&deg;F'
    +'</div><div class="locLabel">'
    +this.stnName
    +'</div>';
	
	
};
StnOverlay.prototype.show = function(){
    if (this.div) {
        this.div.style.visibility = "visible";
		var me = this;
		/*google.maps.event.addListener(me, 'click', function() {
			//alert("abcd");
			var ib = me.getInfoBox();
			ib.open(me.map, me);
		});*/
    }
};

StnOverlay.prototype.hide = function(){
    if (this.div) {
         this.div.style.visibility = "hidden";
    }
   
};
