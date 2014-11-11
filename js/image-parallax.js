
/* =====================================================
 * Image Parallax
 *
 *
*/

(function(){
    'use strict';

    var naumann = window.naumann = window.naumann || {};

    naumann.imageParallax = function(el, options){

        var img;
        var inMin;
        var inMax;
        var outMin;
        var outMax;
        var dResize;
        var ticking = false;
        var scale = 1.3;

        var scrollElement = options.scrollElement || window;

        function init(){
            console.log('init imageParallax');
            img = el.querySelector('img');

            dResize = _.debounce(resize, 500);

            // wait until the background image is loaded, then resize
            img.addEventListener('load', function(){
                resize();
            });

            resize();

            addListeners();
        }

        function scroll(){
            if(!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }

        function update(){
            var elY = el.getBoundingClientRect().top;
            /*if( adY > inMin || adY < inMax ){
                ticking = false;
                return;
            }*/
            // how far is the ad on its way through the viewport
            var relY = mapRange(elY, inMin , inMax , outMin , outMax );

            img.style[naumann.support.transform.dom] = 'scale(' + scale + ') translate3D(0,' + relY + 'px, 0)';
            ticking = false;
        }

        function resize(){
            console.log('resize');
            inMin = window.innerHeight;
            inMax = 0 - el.offsetHeight;
            outMin = - (img.offsetHeight * scale - el.offsetHeight) / 2;
            outMax = (img.offsetHeight * scale - el.offsetHeight) / 2;
            update();
        }

        function addListeners(){
            scrollElement.addEventListener('scroll', scroll, false);
            window.addEventListener('resize', dResize, false);
        }

        function removeListeners(){
            scrollElement.removeEventListener('scroll', scroll, false);
            window.addEventListener('resize', dResize, false);
        }

        function destroy(){
            removeListeners();
        }

        init();

        return {
            destroy: destroy
        };
    };

}());
