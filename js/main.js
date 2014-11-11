var vpW, vpH;
var noop = function(){};
var dResize = _.debounce(resize, 500);


var mapwrap = document.getElementById('map-wrapper');

var display = {
    lat: document.getElementById('lat'),
    lng: document.getElementById('lng')
};

function resize(){
    vpW = window.innerWidth;
    vpH = window.innerHeight;
}

window.addEventListener('resize', dResize);

window.addEventListener('load', function(){
    resize();
    classie.remove( document.body, 'loading' );
});



var map;
function initMap() {
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644),
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

    google.maps.event.addListenerOnce(map, 'idle', function(){
        getCoordinates();
    });
}

google.maps.event.addDomListener(window, 'load', initMap);




function requestJSONP(url) {
    var script = document.createElement('script');
    script.src = url;

    script.onload = function () {
        this.remove();
    };

    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(script, null);
}


function getCoordinates(){
    var url = 'http://api.open-notify.org/iss-now.json?callback=move_iss';
    requestJSONP(url);
}


var iss = {};
var before;

function move_iss(data){
    var now = Date.now();

    lat = data.iss_position.latitude;
    lng = data.iss_position.longitude;

    if( iss.lat ){
        iss.lat0 = iss.lat;
        iss.lng0 = iss.lng;

        var deltaT = now - before;

        var deltaLat = iss.lat - iss.lat0;
        var deltaLng = iss.lng - iss.lng0;

        var tween = new TWEEN.Tween({lat: iss.lat0, lng: iss.lng0 })
            .to( { lat: lat, lng: lng }, deltaT )
            .onUpdate( function(){

                console.log( this.lat );
                display.lat.innerHTML = 'Lat:&nbsp;' + this.lat.toFixed(6);
                display.lng.innerHTML = 'Long:&nbsp;' + this.lng.toFixed(6);

                map.panTo(new google.maps.LatLng(this.lat, this.lng) );

            })
            .start();

        animate();

    }else{
        map.panTo(new google.maps.LatLng(lat, lng) );
        classie.add(mapwrap, 'active');
    }

    function animate(){
        TWEEN.update();
        window.setTimeout( animate, 100 );
    }

    iss.lat = lat;
    iss.lng = lng;

    before = now;

    setTimeout(getCoordinates, 5000);
}