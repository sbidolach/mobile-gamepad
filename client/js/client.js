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
    var hapticCallback = function () {
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

    setDirection = function(event, type, value) {

        if (event) {
            var remoteEvent = null;
            switch (event) {
                case "dir:left":
                    remoteEvent = 0x222;
                    break;
                case "dir:right":
                    remoteEvent = 0x223;
                    break;
                case "dir:up":
                    remoteEvent = 0x220;
                    break;
                case "dir:down":
                    remoteEvent = 0x221;
                    break;
            }

            if (remoteEvent) {
                // console.log(type + ';' + event + ';' + value);

                socket.emit("event", {
                    type: type,
                    code: remoteEvent,
                    value: value
                });

                if (value !== 0) {
                    prevEvent = event;
                } else {
                    prevEvent = null;
                }
            }
        }

    };

    var prevEvent;

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
            setDirection(prevEvent, 0x01, 0);

            // })
            // .on('move', function(evt, data) {
            // })

        // dir:up plain:up dir:left plain:left dir:down plain:down dir:right plain:right
        }).on('dir:up dir:left dir:down dir:right ', function(evt, data) {

            if (evt.type !== prevEvent) {
                setDirection(prevEvent, 0x01, 0);
                setDirection(evt.type, 0x01, 1);
            }

        })
        .on('pressure', function(evt, data) {
            console.log('pressure');
        });

});
