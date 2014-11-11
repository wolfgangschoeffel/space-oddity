/* =======================================

    Interpolation

    usage: animate({from:0, to:500, duration: 500, easing: naumann.easing.easeInOutQuad }, function(){});

==========================================*/


(function(){
    'use strict';

    var unfun = window.unfun = window.unfun || {};

    unfun.animate = function(options){

        var start = Date.now();
        var from = options.from || 0;
        var linear = function (t) { return t };
        var easingFunction = options.easing || linear;
        var to = options.to;
        var duration = options.duration || 500;
        var interval = options.interval || 10;

        if(from === to) {
            if( callback ){
                callback();
            }
            return;
        }

        function min(a,b) {
            return a<b?a:b;
        }

        function tick(timestamp) {
            var currentTime = Date.now(),
                time = min(1, ((currentTime - start) / duration)),
                easedT = easingFunction(time);

            var current = (easedT * (to - from)) + from;

            if( options.onUpdate ){
                options.onUpdate(current);
            }

            if(time < 1){
                window.setTimeout(tick, interval);
            }else{
                if(options.callback){
                    options.callback();
                }
            }
        }
        // start
        window.setTimeout(tick);
    }
}());
