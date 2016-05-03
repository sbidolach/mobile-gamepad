
$(window).load(function() {

    // turn off context menu
    document.oncontextmenu = function(event){
      if(event.preventDefault){ event.preventDefault(); }
      if(event.stopPropagation){ event.stopPropagation(); }
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
        console.log(gamePadId);

        $(".btn")
          .off("touchstart touchend")
          .on("touchstart", function(event) {
            socket.emit("event", {type: 0x01, code: $(this).data("code"), value: 1});
            // hapticCallback();
          })
          .on("touchend", function(event) {
            socket.emit("event", {type: 0x01, code: $(this).data("code"), value: 0});
          });
      });

    // Create Joystick
    nipplejs.create({
      zone: document.querySelector('.zone_joystick.dynamic'),
      mode: 'static',
      color: 'black',
      position: {left: '50%', top: '50%'},
      multitouch: true
    })
    .on('start end', function(evt, data) {
      //dump(evt.type);
      //debug(data);
    }).on('move', function(evt, data) {
      //debug(data);
    }).on('dir:up plain:up dir:left plain:left dir:down ' +
      'plain:down dir:right plain:right', function(evt, data) {
        console.log(evt);
        //dump(evt.type);
      }
    ).on('pressure', function(evt, data) {
      //debug({
      //  pressure: data
      //});
    });

});
