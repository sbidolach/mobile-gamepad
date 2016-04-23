var config = require('../../config/config');
var uinput = require('uinput');

var gamepad = function(inputId){

  this.inputId = inputId;

  this.setup_options = {
    EV_KEY : [
      uinput.KEY_UP,
      uinput.KEY_LEFT,
      uinput.KEY_RIGHT,
      uinput.KEY_DOWN
    ]
  };

  return {
    disconnect: function(){

      this.stream = undefined;
      return null;

    }.bind(this),
    connect: function(){

      uinput.setup(this.setup_options, function(err, stream) {
        if (err) {throw(err);}

        var create_options = {
          name : 'MobileGamePad',
          id : {
            bustype : uinput.BUS_USB,
            vendor : 0x3,
            product : 0x3,
            version : 2
          }
        };

        uinput.create(stream, create_options, function(err) {
          if (err) {
              throw(err);
          }

          this.stream = stream;

        }.bind(this));

      }.bind(this));

    }.bind(this),
    sendEvent: function(event){

      var code;
      switch (event) {
        case 'left':
          code = uinput.KEY_LEFT;
          break;
        case 'right':
          code = uinput.KEY_RIGHT;
          break;
        case 'up':
          code = uinput.KEY_UP;
          break;
        case 'down':
          code = uinput.KEY_DOWN;
          break;
        default:
          code = 'ERROR';
      }

      uinput.key_event(this.stream, code, function(err) {
          if (err) {
              throw(err);
          }
      });

    }.bind(this)
  };

};

module.exports = gamepad;
