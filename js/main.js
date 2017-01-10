var vpW, vpH;
var noop = function () {};
var dResize = _.debounce(resize, 500);

var mapwrap = document.getElementById('map-wrapper');

var display = {
  lat: document.getElementById('lat'),
  lng: document.getElementById('lng')
};

function resize () {
  vpW = window.innerWidth;
  vpH = window.innerHeight;
}

window.addEventListener('resize', dResize);

window.addEventListener('load', resize);



var map;
function initMap () {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  google.maps.event.addListenerOnce(map, 'idle', function () {
    getCoordinates();
    classie.remove(document.body, 'loading');
  });
}

googleMapsApiLoader.load(initMap)




function requestJSONP (url) {
  try {
    var script = document.createElement('script');
    script.src = url;

    script.onload = function () {
        this.remove();
    };

    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(script, null);
  } catch (e) {

  }
}


function getCoordinates () {
  var url = 'http://api.open-notify.org/iss-now.json?callback=iss.move';
  requestJSONP(url);
}

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
  lat0: (void 0),
  lng0: (void 0),
  queryInterval: 10000,

  move: function (data) {
    console.log('move iss');
    this.lat = data.iss_position.latitude;
    this.lng = data.iss_position.longitude;

    var now = Date.now();
    var deltaT;
    var deltaLat;
    var deltaLng;

    if (this.lastTime) {
      deltaT = now - this.lastTime;
      deltaLat = this.lat - this.lat0;
      deltaLng = this.lng - this.lng0;

      this.vLat = deltaLat / deltaT;
      this.vLng = deltaLng / deltaT;

      follower.start();

    } else {
      map.panTo(new google.maps.LatLng(this.lat, this.lng));
      classie.add(mapwrap, 'active');
    }

    this.lat0 = this.lat;
    this.lng0 = this.lng;

    if (this.lastTime) {
      window.setTimeout(getCoordinates, this.queryInterval);
    } else {
      window.setTimeout(getCoordinates, 500);
    }

    this.lastTime = now;
  }
};


var follower = {
  lat: 0,
  lng: 0,
  lat0: (void 0),
  lng0: (void 0),
  isActive: false,
  updateInterval: 500,

  start: function () {
    if (!this.isActive) {
      console.log('start follower');
      this.isActive = true;
      this.update();
    }
  },

  update: function () {
    console.log('move follower');
    var now = Date.now();

    if (this.lastTime) {
      var deltaT = now - this.lastTime;
      this.lat = this.lat0 + iss.vLat * deltaT;
      this.lng = this.lng0 + iss.vLng * deltaT;
    } else {
      this.lat = iss.lat;
      this.lng = iss.lng;
    }

    this.lat0 = follower.lat;
    this.lng0 = follower.lng;
    this.lastTime = now;

    map.panTo(new google.maps.LatLng(this.lat, this.lng));

    display.lat.innerHTML = 'Lat:&nbsp;' + parseFloat(this.lat).toFixed(6);
    display.lng.innerHTML = 'Long:&nbsp;' + parseFloat(this.lng).toFixed(6);

    window.setTimeout(this.update.bind(this), this.updateInterval);
  }
};

