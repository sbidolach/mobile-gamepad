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
            if(!$("#warning-message").is(":visible")) {
                $("#wrapper").show();
                $("#disconnect-message").hide();
            }
            socket.emit('hello', 'add new input');
        })
        .on("hello", function(data) {
            var gamePadId = data.inputId;

            $("#padText").html("<h1>Nr " + gamePadId + "</h1>");

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
        })
        .on('disconnect', function() {
            if(!$("#warning-message").is(":visible")) {
                $("#wrapper").hide();
                $("#disconnect-message").show();
            }
        });

    sendEvent = function(type, code, value) {
        socket.emit("event", {
            type: type,
            code: code,
            value: value
        });
    };

    convertJoystickDegreeToEvent = function(degree) {
        if (degree > 295 && degree < 335) {
            return 'right:down';
        } else if (degree >= 245 && degree <= 295) {
            return 'down';
        } else if (degree > 205 && degree < 245) {
            return 'left:down';
        } else if (degree >= 155 && degree <= 205) {
            return 'left';
        } else if (degree > 115 && degree < 155) {
            return 'left:up';
        } else if (degree >= 65 && degree <= 115) {
            return 'up';
        } else if (degree > 25 && degree < 65) {
            return 'right:up';
        } else if (degree <= 25 || degree >= 335) {
            return 'right';
        }
    };

    sendEventToServer = function(type, event) {
        console.log(event);
        switch (event) {
            case "left":
                sendEvent(type, 0x00, 0);
                sendEvent(type, 0x01, 127);
                break;
            case "left:up":
                sendEvent(type, 0x00, 0);
                sendEvent(type, 0x01, 0);
                break;
            case "left:down":
                sendEvent(type, 0x00, 0);
                sendEvent(type, 0x01, 255);
                break;
            case "right":
                sendEvent(type, 0x00, 255);
                sendEvent(type, 0x01, 127);
                break;
            case "right:up":
                sendEvent(type, 0x00, 255);
                sendEvent(type, 0x01, 0);
                break;
            case "right:down":
                sendEvent(type, 0x00, 255);
                sendEvent(type, 0x01, 255);
                break;
            case "up":
                sendEvent(type, 0x00, 127);
                sendEvent(type, 0x01, 0);
                break;
            case "down":
                sendEvent(type, 0x00, 127);
                sendEvent(type, 0x01, 255);
                break;
            default:
                sendEvent(type, 0x00, 127);
                sendEvent(type, 0x01, 127);
        }
    };

    var prevJoystickEvent;
    var prevMotionEvent = 'middle';

    // Create Joystick
    nipplejs.create({
            zone: document.querySelector('.joystick'),
            mode: 'static',
            color: 'white',
            position: {
                left: '50%',
                top: '50%'
            },
            multitouch: true
        })
        // start end
        .on('end', function(evt, data) {
            // set joystick to default position
            sendEventToServer(0x03, 'end');
            prevJoystickEvent = evt.type;
            // dir:up plain:up dir:left plain:left dir:down plain:down dir:right plain:right || move
        }).on('move', function(evt, data) {
            var event = convertJoystickDegreeToEvent(data.angle.degree);
            if (event !== prevJoystickEvent) {
                sendEventToServer(0x03, event);
                prevJoystickEvent = event;
            }
        })
        .on('pressure', function(evt, data) {
            console.log('pressure');
        });

    var motion_limit_x = 15;
    var motion_limit_y = 25;

    convertMotionStepsToEvent = function(step_x, step_y) {
        if (step_y === -25) {
            return 'down';
        } else if (step_x === -15) {
            return 'left';
        } else if (step_y === 25) {
            return 'up';
        } else if (step_x === 15) {
            return 'right';
        } else {
            return 'middle';
        }
    };

    sendMotionEventToServer = function(type, event) {
        console.log(event);
        switch (event) {
            case "left":
                sendEvent(type, 0x00, -25);
                break;
            case "right":
                sendEvent(type, 0x00, 25);
                break;
            case "up":
                sendEvent(type, 0x01, -25);
                break;
            case "down":
                sendEvent(type, 0x01, 25);
                break;
            default:
                sendEvent(type, 0x00, 1);
                sendEvent(type, 0x01, 1);
        }
    };

    motionDevice.create({
            limit_x: motion_limit_x,
            limit_y: motion_limit_y
        }).on('move', function(self, data) {

            var event = convertMotionStepsToEvent(
                data.step.x,
                data.step.y
            );

            if (prevMotionEvent !== event) {
                sendMotionEventToServer(0x02, event);
                prevMotionEvent = event
            }

        });

    // Reload page when gamepad is disconnected
    $("#disconnect-message").click(function() {
        location.reload();
    });

});
