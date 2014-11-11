;(function(){
    'use strict';

    var naumann = window.naumann = window.naumann || {};
    /**
     * Get closest DOM element up the tree that contains a class, ID, or data attribute
     * @param  {Element} elem The base element
     * @param  {String} selector The class or data attribute to look for
     * @return {Boolean|Element} False if no match
     */

    naumann.getClosest = function (elem, selector) {
        var firstChar = selector.charAt(0);
        // Get closest match
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( firstChar === '.' ) {
                if ( elem.classList.contains( selector.substr(1) ) ) {
                    return elem;
                }
            } else if ( firstChar === '#' ) {
                if ( elem.id === selector.substr(1) ) {
                    return elem;
                }
            } else if ( firstChar === '[' ) {
                if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
                    return elem;
                }
            }
        }
        return false;
    };
})();