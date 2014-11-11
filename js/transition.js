(function(){
    'use strict';

    var naumann = window.naumann = window.naumann || {};

    var el = document.createElement('fakeelement'),
        domPrefixes = ['Webkit', 'Moz', 'O', 'ms'],
        cssPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-'];


    var testFeature = function (prop) {
        // unprefixed case
        if (prop in el.style) return { dom: prop, css: prop };
        // test all prefixes
        var i, domProp, domSuffix = '', words = prop.split('-');
        for (i = 0; i < words.length; i++) {
            domSuffix += words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
        for (i = 0; i < domPrefixes.length; i++) {
            domProp = domPrefixes[i] + domSuffix;
            if (domProp in el.style) return { dom: domProp, css: cssPrefixes[i] + prop };
        }
    };


    function transitionEnd() {

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }

        return false; // explicit for ie8 (  ._.)
    }


    // Run feature tests
    naumann.support = {};
    naumann.support.transform = testFeature('transform');
    naumann.support.transition = testFeature('transition');
    naumann.support.transitionEnd = transitionEnd();

}());