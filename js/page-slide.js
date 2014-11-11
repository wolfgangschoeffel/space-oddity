var pageslide = (function(){
    'use strict';
    var element;
    var wrapper;
    var x, y;
    var currentIndex = 0;
    var pointerDown = false;
    var dragging = false;
    var start;
    var delta;
    var size;
    var wrapperWidth;
    var dResize;
    var initialDirection;

    var sections;
    var sectionCount = 3;
    var currentSection;

    // for calculating speed
    var positions;
    var lastTimestamp;

    var states = [];

    //var touch = Modernizr.touch;
    var sliderDirection = 'horizontal'// The direction of the slider

    function init(){
        element = document.getElementById('wrapper');
        wrapper = document.getElementById('wrapper__inner');
        addMouseListeners();

        sections = wrapper.querySelectorAll('.main-section');
        currentSection = sections[currentIndex];
        classie.add(currentSection, 'active');


        dResize = _.debounce(resize, 500);
        window.addEventListener('resize', dResize);

        resize();
    }

    function resize(){
        size = element.offsetWidth;
        wrapperWidth = wrapper.offsetWidth;

        states[0] = 0;
        states[1] = (wrapperWidth - size) / 2;
        states[2] = sections[1].offsetLeft;

        show(currentIndex, true);
    }

    function next(speed) { show(currentIndex+1, true, speed); }
    function prev(speed) { show(currentIndex-1, true, speed); }

    function show(i, animate, speed) {
        // between the bounds
        currentIndex = Math.max(0, Math.min(i, sectionCount-1));
        var offset = -states[currentIndex];
        setContainerOffset(offset, animate, speed);

        // maybe put this after the transition is done for better performance
        classie.remove(currentSection, 'active');
        currentSection = sections[currentIndex];
        classie.add(currentSection, 'active');
    }

    function setContainerOffset(distance, animate, speed) {

        distance = distance | 0;
        // speed = px / 100ms;

        // z.B. schnell = 400px / 100ms
        // 4 px/ms
        // size: 1000 px
        // -> t müsste etwas mehr als 200ms sein.

        // v = s/t;
        // t = s/v;

        // 1000 / 4 -> 250

        var t;

        if( speed === undefined ){
            t = 0;
        }else{
            t = Math.abs( size / (speed/100) );
        }

        if( t > 400 ){
            // todo: should depend on screen size
            t = 300;
        }


        if( animate === true ){
            wrapper.style[naumann.support.transition.dom] = t +'ms';
        }else{
            wrapper.style[naumann.support.transition.dom] = '';
        }

        wrapper.style[naumann.support.transform.dom] = 'translate3D(' + distance + 'px,0,0)';
    }

    function handleTouches(e){

        if( e.type === 'end' ){

            pointerDown = false;

            if( !dragging ){ return; }

            dragging = false;
            initialDirection = undefined;

            // get position 100ms ago
            var endpos = positions.length - 1;
            var ago100;
            for( var i = endpos; i > 0 && positions[i] > lastTimestamp - 100; i -= 2 ){
                ago100 = i;
            }
            var speed = positions[endpos - 1] - positions[ago100 - 1];


            if( Math.abs(delta) > size/4 || Math.abs(speed) > 50) {

                if(delta > 0) {
                    prev(speed);
                }else{
                    next(speed);
                }
            }else{
                show(currentIndex, true, speed);
            }

            return;
        }

        if( e.type === 'start' ){
            pointerDown = true;
            positions = [];
            x = e.x;
            y = e.y;

            return;
        }


        if( e.type === 'move' ){
            if(!pointerDown ){
                return;
            }

            dragging = true;

            if( getDirection(e) !== sliderDirection ){
                return;
            }

            e.oEvent.preventDefault();

            delta = e.x - x;

            var slideOffset = -states[currentIndex];
            var dragOffset = delta;

            if( (currentIndex == 0 && delta > 0 ) ||
                (currentIndex == sectionCount-1 && delta < 0)
            ) {
                dragOffset *= .4;
            }

            setContainerOffset(dragOffset + slideOffset, false);

            positions.push( delta, e.oEvent.timeStamp );
            lastTimestamp = e.oEvent.timeStamp;

            return;
        }
    }


    function getDirection(e){
        if( initialDirection ){ return initialDirection };

        if( Math.abs( x - e.x ) > Math.abs( y - e.y ) ){
            initialDirection = 'horizontal';
        }else{
            initialDirection = 'vertical';
        }
        return initialDirection;
    }

    // MOUSE
    var mousedownHandler = function(e){
        // if right mouse button
        if(e.button || e.ctrlKey){
            return;
        }

        handleTouches({
            type: 'start',
            x: e.pageX,
            y: e.pageY,
            timestamp: e.timestamp,
            oEvent: e
        });
    };

    var mousemoveHandler = function(e){
        handleTouches({
            type: 'move',
            x: e.pageX,
            y: e.pageY,
            timestamp: e.timestamp,
            oEvent: e
        });
    };

    var mouseupHandler = function(e){

        if( dragging ){
            e.stopPropagation();
        }

        handleTouches({
            type: 'end',
            timestamp: e.timestamp,
            oEvent: e
        });
    };

    function addMouseListeners(){
        document.addEventListener('mousedown', mousedownHandler, false);
        document.addEventListener('mousemove', mousemoveHandler, false);
        document.addEventListener('mouseup', mouseupHandler, false);

        Gator(wrapper).on('click', '.main-section', function(el, i){
            console.log( dragging );
            if( dragging ){ return; }
            var index = +this.getAttribute('data-index');

            show(index, true, 300 );
        });

    }

    return {
        init: init,
        show: show
    };

}());

pageslide.init();