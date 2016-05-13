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
          // hapticCallback();
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

  setEvent = function(type, code, value) {
    socket.emit("event", {
      type: type,
      code: code,
      value: value
    });
  }

  setDirection = function(event, data) {
    switch (event.type) {
      case "dir:left":
        setEvent(0x01, 0x222, 1);
        setEvent(0x01, 0x222, 0);
        break;
      case "dir:right":
        setEvent(0x01, 0x223, 1);
        setEvent(0x01, 0x223, 0);
        break;
      case "dir:up":
        setEvent(0x01, 0x220, 1);
        setEvent(0x01, 0x220, 0);
        break;
      case "dir:down":
        setEvent(0x01, 0x221, 1);
        setEvent(0x01, 0x221, 0);
        break;
    }
  };

  var prevType;

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
      // })
      // .on('start end', function(evt, data) {
      // })
      // .on('move', function(evt, data) {
      // }).on('dir:up plain:up dir:left plain:left dir:down ' +
      //   'plain:down dir:right plain:right',
  }).on('dir:up dir:left dir:down dir:right ',
    function(evt, data) {

      // if(evt.type !== prevType) {
      console.log(evt.type);
      setDirection(evt, data);
      // prevType = evt.type;
      // }

      // else {
      //     setEvent(0x03, 0x00, 127);
      //     setEvent(0x03, 0x01, 127);
      // }

      // socket.emit("event", {type: 0x03, code: 0x00, value: data.position.x});
      // socket.emit("event", {type: 0x03, code: 0x01, value: data.position.y});

      // })
      // .on('pressure', function(evt, data) {
    });

});
