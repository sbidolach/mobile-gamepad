var config = require('../../config/config');
var uinput = require('uinput');
var fs = require('fs');
var ioctl = require('ioctl');
var struct = require('struct');

var gamepad = function(inputId) {

  this.inputId = inputId;

  return {
    disconnect: function() {

      if (this.fd) {
        ioctl(this.fd, uinput.UI_DEV_DESTROY);
        fs.close(this.fd);
        this.fd = undefined;
      }

      return null;
    }.bind(this),

    connect: function() {

      console.log('connect gamepad');

      fs.open('/dev/uinput', 'w+',
        function(err, fd) {
          if (err) {
            console.log(err);
            throw (err);
          }

          this.fd = fd;

          ioctl(this.fd, uinput.UI_SET_EVBIT, uinput.EV_KEY);
          ioctl(this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_A);
          ioctl(this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_B);
          ioctl(this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_X);
          ioctl(this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_Y);
          ioctl(this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_TL);
          ioctl(this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_TR);
          ioctl(this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_START);
          ioctl(this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_SELECT);

          ioctl(this.fd, uinput.UI_SET_KEYBIT, 0x220);
          ioctl(this.fd, uinput.UI_SET_KEYBIT, 0x221);
          ioctl(this.fd, uinput.UI_SET_KEYBIT, 0x222);
          ioctl(this.fd, uinput.UI_SET_KEYBIT, 0x223);

          ioctl(this.fd, uinput.UI_SET_EVBIT, uinput.EV_ABS);
          ioctl(this.fd, uinput.UI_SET_ABSBIT, uinput.ABS_X);
          ioctl(this.fd, uinput.UI_SET_ABSBIT, uinput.ABS_Y);

          var name = "MobileGamePad"; // max 80 chars
          var bustype = uinput.BUS_USB; // USB
          var vendor = 0x5432; // Just some random numbers
          var product = 0x1515;
          var version = 1;

          var buffer = new Buffer(1116);
          buffer.fill(0);
          buffer.write(name, 0, 80);
          buffer.writeUInt16LE(bustype, 80);
          buffer.writeUInt16LE(vendor, 82);
          buffer.writeUInt16LE(product, 84);
          buffer.writeUInt16LE(version, 86);

          fs.write(fd, buffer, 0, buffer.length, null, function(err, written, buffer) {
            if (err) {
              console.log(err);
              throw (err);
            } else {
              ioctl(this.fd, uinput.UI_DEV_CREATE);
            }
          }.bind(this));

        }.bind(this)
      );

    }.bind(this),

    sendEvent: function(event) {

      if (this.fd) {

        var ev = new Buffer(24);
        ev.fill(0);

        var tv_sec = Math.round(Date.now() / 1000),
        tv_usec = Math.round(Date.now() % 1000 * 1000),
        type = event.type, // uinput.EV_KEY
        code = event.code, // ABS_X,
        value = event.value; // 1

        ev.writeInt32LE(tv_sec, 0);
        ev.writeInt32LE(tv_usec, 8);
        ev.writeInt16LE(type, 16);
        ev.writeInt16LE(code, 18);
        ev.writeInt32LE(value, 20);

        console.log('type: ' + type);
        console.log('code: ' + code);
        console.log('value: ' + value);
        console.log('buffer: ' + ev);
        console.log('###############');

        var ev_end = new Buffer(24);
        ev_end.fill(0);

        ev_end.writeInt32LE(tv_sec, 0);
        ev_end.writeInt32LE(tv_usec, 8);

        fs.writeSync(this.fd, ev, 0, ev.length, null);
        fs.writeSync(this.fd, ev_end, 0, ev_end.length, null);

        return null;
      }
    }.bind(this)
  }
};

module.exports = gamepad;
