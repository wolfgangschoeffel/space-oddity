(function () {
  'use strict';
  /* Load google maps api */

  var loaded = false;

  // callback provided by the api user
  var onload;

  // callback called by jsonp
  function cb () {
    loaded = true;
    onload();
  }

  function load (callback) {

    onload = callback;

    if (loaded) {
      onload();
      return;
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBP1l5-UjbMrVsKO6VOyz2UN6xp_u5I1Hs&v=3.exp&callback=googleMapsApiLoader.cb';
    document.body.appendChild(script);
  }

  window.googleMapsApiLoader = window.googleMapsApiLoader || {
    cb: cb,
    load: load
  };

})();
