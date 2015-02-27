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
        classie.remove( document.body, 'loading' );
    });
}

google.maps.event.addDomListener(window, 'load', initMap);




function requestJSONP(url) {
    try {
        var script = document.createElement('script');
        script.src = url;

        script.onload = function () {
            this.remove();
        };

        var head = document.getElementsByTagName('head')[0];
        head.insertBefore(script, null);
    }catch(e){

    }

}


function getCoordinates(){
    var url = 'http://api.open-notify.org/iss-now.json?callback=iss.move';
    requestJSONP(url);
}

/*
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

                //console.log( this.lat );
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
        console.log('animate');
        TWEEN.update();
        window.setTimeout( animate, 2000 );
    }

    iss.lat = lat;
    iss.lng = lng;

    before = now;

    setTimeout(getCoordinates, 10000);
}

*/

// Gegeben:

//  QueryTime: qt
//  UpdateTime: ut
//  iss.pos

// v: (Iss.pos - Iss.lastpos) / querytime
// v = s/t
// s = v * t
// follower-pos = follower.lastpos + (v * updateTime)


var iss = {
    lat: 0,
    lng: 0,
    lat0: undefined,
    lng0: undefined,
    queryInterval: 10000,

    move: function(data){
        console.log('move iss');
        iss.lat = data.iss_position.latitude;
        iss.lng = data.iss_position.longitude;

        var now = Date.now();
        var deltaT;
        var deltaLat;
        var deltaLng;

        if( iss.lastTime ){
            deltaT = now - iss.lastTime;
            deltaLat = iss.lat - iss.lat0;
            deltaLng = iss.lng - iss.lng0;

            iss.vLat = deltaLat / deltaT;
            iss.vLng = deltaLng / deltaT;

            follower.start();

        }else {
            map.panTo(new google.maps.LatLng(iss.lat, iss.lng) );
            classie.add(mapwrap, 'active');
        }

        iss.lat0 = iss.lat;
        iss.lng0 = iss.lng;

        if( iss.lastTime ){
            window.setTimeout(getCoordinates, this.queryInterval);
        }else {
            window.setTimeout(getCoordinates, 500);
        }

        iss.lastTime = now;
    }
};


var follower = {
    lat: 0,
    lng: 0,
    lat0: undefined,
    lng0: undefined,
    isActive: false,
    updateInterval: 500,

    start: function(){
        if( ! this.isActive ){
            console.log( 'start follower' );
            this.isActive = true;
            this.update();
        }
    },

    update: function(){
        console.log('move follower');
        var now = Date.now();

        if( follower.lastTime ){
            var deltaT = now - follower.lastTime;
            follower.lat = follower.lat0 + iss.vLat * deltaT;
            follower.lng = follower.lng0 + iss.vLng * deltaT;
        }else {
            follower.lat = iss.lat;
            follower.lng = iss.lng;
        }

        follower.lat0 = follower.lat;
        follower.lng0 = follower.lng;
        follower.lastTime = now;

        map.panTo(new google.maps.LatLng(follower.lat, follower.lng) );

        display.lat.innerHTML = 'Lat:&nbsp;' + this.lat.toFixed(6);
        display.lng.innerHTML = 'Long:&nbsp;' + this.lng.toFixed(6);

        window.setTimeout(this.update.bind(this), this.updateInterval);
    }
};

