/* =======================================

    Animated scrolling

    usage: h1.animatedScroll({ to:500, duration: 500 }, function(){});

==========================================*/


(function(){
    'use strict';

    var naumann = window.naumann = window.naumann || {};

    naumann.animatedScroll = function(options, callback){

        var start = Date.now();
        var scrollProperty;
        var elem = window;
        var from = window.pageYOffset;

        if( options.el ){
            elem = options.el;
            from = elem.scrollTop;
        }

        var easingFunction = options.easing || naumann.easing.easeInOutQuad;
        var to = options.to;
        var duration = options.duration || 500;

        if(from === to) {
            if( callback ){
                callback();
            }
            return;
        }

        function min(a,b) {
            return a<b?a:b;
        }

        function scroll(timestamp) {
            var currentTime = Date.now(),
                time = min(1, ((currentTime - start) / duration)),
                easedT = easingFunction(time);

            var current = (easedT * (to - from)) + from;

            if( elem === window ){
                window.scrollTo(0, current);
            }else{
                elem.scrollTop = current;
            }

            if(time < 1){
                requestAnimationFrame(scroll);
            }else{
                if(callback){
                    callback();
                }
            }
        }
        requestAnimationFrame(scroll);
    }
}());
