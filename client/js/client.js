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

    setDirection = function(event) {
        if (event) {
            switch (event) {
                case "dir:left":
                    sendEvent(0x03, 0x00, 0);
                    sendEvent(0x03, 0x01, 127);
                    break;
                case "dir:right":
                    sendEvent(0x03, 0x00, 255);
                    sendEvent(0x03, 0x01, 127);
                    break;
                case "dir:up":
                    sendEvent(0x03, 0x00, 127);
                    sendEvent(0x03, 0x01, 0);
                    break;
                case "dir:down":
                    sendEvent(0x03, 0x00, 127);
                    sendEvent(0x03, 0x01, 255);
                    break;
                default:
                    sendEvent(0x03, 0x00, 127);
                    sendEvent(0x03, 0x01, 127);
            }
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
        }).on('dir:up dir:left dir:down dir:right ', function(evt, data) {
            setDirection(evt.type);
        })
        .on('pressure', function(evt, data) {
            console.log('pressure');
        });

});
