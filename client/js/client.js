$(window).load(function() {

    // turn off context menu
    document.oncontextmenu = function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        event.cancelBubble = true;
        return false;
    }

    // HAPTIC CALLBACK METHOD
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    var hapticCallback = function() {
        if (navigator.vibrate) {
            navigator.vibrate(1);
        }
    }

    // create socket connection
    var socket = io();
    socket
        .on("connect", function() {
            socket.emit('hello', 'add new input');
        })
        .on("hello", function(data) {
            var gamePadId = data.inputId;

            $(".btn")
                .off("touchstart touchend")
                .on("touchstart", function(event) {
                    socket.emit("event", {
                        type: 0x01,
                        code: $(this).data("code"),
                        value: 1
                    });
                    $(this).addClass("active");
                    hapticCallback();
                })
                .on("touchend", function(event) {
                    socket.emit("event", {
                        type: 0x01,
                        code: $(this).data("code"),
                        value: 0
                    });
                    $(this).removeClass("active");
                });
        });

    sendEvent = function(type, code, value) {
        socket.emit("event", {
            type: type,
            code: code,
            value: value
        });
    }

    getEventFromDegree = function(degree) {
        if(degree >= -25 && degree <= 25) {
            return 'left';
        } else if (degree > 25 && degree < 65){
            return 'left:up';
        } else if (degree >= 65 && degree <= 115){
            return 'up';
        } else if (degree > 115 && degree < 155){
            return 'right:up';
        } else if (degree > -65 && degree < -25){
            return 'left:down';
        } else if (degree >= -115 && degree <= -65){
            return 'down';
        } else if (degree > -155 && degree < -115){
            return 'right:down';
        } else if(degree <= -155 || degree >= 155 ) {
            return 'right';
        }
    }


    setDirection = function(event) {
        switch (event) {
            case "left":
                sendEvent(0x03, 0x00, 0);
                sendEvent(0x03, 0x01, 127);
                break;
            case "left:up":
                sendEvent(0x03, 0x00, 0);
                sendEvent(0x03, 0x01, 0);
                break;
            case "left:down":
                sendEvent(0x03, 0x00, 0);
                sendEvent(0x03, 0x01, 255);
                break;
            case "right":
                sendEvent(0x03, 0x00, 255);
                sendEvent(0x03, 0x01, 127);
                break;
            case "right:up":
                sendEvent(0x03, 0x00, 255);
                sendEvent(0x03, 0x01, 0);
                break;
            case "right:down":
                sendEvent(0x03, 0x00, 255);
                sendEvent(0x03, 0x01, 255);
                break;
            case "up":
                sendEvent(0x03, 0x00, 127);
                sendEvent(0x03, 0x01, 0);
                break;
            case "down":
                sendEvent(0x03, 0x00, 127);
                sendEvent(0x03, 0x01, 255);
                break;
            default:
                sendEvent(0x03, 0x00, 127);
                sendEvent(0x03, 0x01, 127);
        }
    };

    // Create Joystick
    nipplejs.create({
            zone: document.querySelector('.joystick'),
            mode: 'static',
            color: 'black',
            position: {
                left: '50%',
                top: '50%'
            },
            multitouch: true
        })
        // start end
        .on('end', function(evt, data) {
            // set joystick to default position
            setDirection('end');
            // dir:up plain:up dir:left plain:left dir:down plain:down dir:right plain:right || move
        }).on('dir:up dir:left dir:down dir:right', function(evt, data) {
            return (data.angle.degree) ? setDirection(data.angle.degree) : null;
        })
        .on('pressure', function(evt, data) {
            console.log('pressure');
        });

});
