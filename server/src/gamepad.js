var config = require('../../config/config');
var uinput = require('uinput');
var fs = require('fs');
var ioctl = require('ioctl');
var Struct = require('struct');

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
                    ioctl(this.fd, uinput.UI_SET_EVBIT, uinput.EV_ABS);
                    ioctl(this.fd, uinput.UI_SET_ABSBIT, uinput.ABS_X);
                    ioctl(this.fd, uinput.UI_SET_ABSBIT, uinput.ABS_Y);

                    var input_id = Struct()
                        .word16Ule('bustype')
                        .word16Ule('vendor')
                        .word16Ule('product')
                        .word16Ule('version');

                    var uinput_user_dev = Struct()
                        .chars('name', uinput.UINPUT_MAX_NAME_SIZE)
                        .struct('id', input_id)
                        .word32Ule('ff_effects_max')
                        .array('absmax', uinput.ABS_CNT, 'word32Sle')
                        .array('absmin', uinput.ABS_CNT, 'word32Sle')
                        .array('absfuzz', uinput.ABS_CNT, 'word32Sle')
                        .array('absflat', uinput.ABS_CNT, 'word32Sle');

                    uinput_user_dev.allocate();
                    var buffer = uinput_user_dev.buffer();
                    var uidev = uinput_user_dev.fields;
                    buffer.fill(0);

                    uidev.name = "MobileGamePad";
                    uidev.id.bustype = uinput.BUS_USB;
                    uidev.id.vendor = 0x5432;
                    uidev.id.product = 0x1515;
                    uidev.id.version = 1;
                    //uidev.ff_effects_max = 255;
                    uidev.absmax[uinput.ABS_X] = 255;
                    uidev.absmin[uinput.ABS_X] = 0;
                    uidev.absfuzz[uinput.ABS_X] = 0;
                    uidev.absflat[uinput.ABS_X] = 15;
                    uidev.absmax[uinput.ABS_Y] = 255;
                    uidev.absmin[uinput.ABS_Y] = 0;
                    uidev.absfuzz[uinput.ABS_Y] = 0;
                    uidev.absflat[uinput.ABS_Y] = 15;

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
