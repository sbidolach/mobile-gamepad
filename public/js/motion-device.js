///////////////////////
///   SUPER CLASS   ///
///////////////////////

function Super() {};

// Basic event system.
Super.prototype.on = function(arg, cb) {
    var self = this;
    var types = arg.split(/[ ,]+/g);
    var type;
    self._handlers_ = self._handlers_ || {};

    for (var i = 0; i < types.length; i += 1) {
        type = types[i];
        self._handlers_[type] = self._handlers_[type] || [];
        self._handlers_[type].push(cb);
    }
    return self;
};

Super.prototype.off = function(type, cb) {
    var self = this;
    self._handlers_ = self._handlers_ || {};

    if (type === undefined) {
        self._handlers_ = {};
    } else if (cb === undefined) {
        self._handlers_[type] = null;
    } else if (self._handlers_[type] &&
        self._handlers_[type].indexOf(cb) >= 0) {
        self._handlers_[type].splice(self._handlers_[type].indexOf(cb), 1);
    }
    return self;
};

Super.prototype.trigger = function(arg, data) {
    var self = this;
    var types = arg.split(/[ ,]+/g);
    var type;
    self._handlers_ = self._handlers_ || {};

    for (var i = 0; i < types.length; i += 1) {
        type = types[i];
        if (self._handlers_[type] && self._handlers_[type].length) {
            self._handlers_[type].forEach(function(handler) {
                handler.call(self, {
                    type: type,
                    target: self
                }, data);
            });
        }
    }
};

//////////////////////////
///   MOTION DEVICE    ///
//////////////////////////

function MotionDevice(options) {

    this.default = {
        limit: {
            x: 15.5,
            y: 25.5
        }
    }

    this.options = this.default || {};
    this.options.limit.x = options.limit_x || this.default.limit.x;
    this.options.limit.y = options.limit_y || this.default.limit.y;
    this.data = this.data || {};
    this.data.event = this.data.event || {};
    this.data.limit = this.data.limit || {};
    this.data.middle = this.data.middle || {};
    this.data.step = this.data.step || {};

    this.runDeviceMotionEvent();

    this.instance = {
        on: this.on.bind(this),
        off: this.off.bind(this),
        trigger: this.trigger.bind(this),
        option: this.option,
        data: this.data
    }

    return this.instance;
};

MotionDevice.prototype = new Super();
MotionDevice.constructor = MotionDevice;

// private method
MotionDevice.prototype.runDeviceMotionEvent = function() {

    if (window.DeviceMotionEvent) {
        window.addEventListener('deviceorientation', function(eventData) {
            var x = event.beta; // In degree in the range [-180,180]
            var y = event.gamma; // In degree in the range [-90,90]

            this.data.event.x = x;
            this.data.event.y = y;

            if (!this.data.start) {

                this.data.start = {};
                this.data.start.x = x;
                this.data.start.y = y;

                // get up and down limit bound for axis y and middle point
                if (!this.isLimitY()) {
                    this.setLimitY(y);
                    this.setMiddlePointY(y);
                }

                if (!this.isLimitX()) {
                    this.setLimitX(x);
                    this.setMiddlePointX(x);
                }

            }

            this.updateStepX(x);
            this.updateStepY(y);

            this.trigger('move', this.data);

        }.bind(this), false);

    }

};

// private method
MotionDevice.prototype.setLimitY = function(y) {
    var _limit = this.data.limit || {};
    // set up and down limits for axis y
    if (y < 0) {
        _limit.up = y + this.options.limit.y;
        _limit.down = y - this.options.limit.y;
        if (_limit.down < -90) {
            _limit.down = 90 + (90 + _limit.down);
        }
    } else {
        _limit.down = y - this.options.limit.y;
        _limit.up = y + this.options.limit.y;
        if (_limit.up > 90) {
            _limit.up = -90 - (90 - _limit.up);
        }
    }
};

// private method
MotionDevice.prototype.setMiddlePointY = function(y) {
    var _middle = this.data.middle || {};
    var _limit = this.data.limit || {};
    var _size = (180 - (2 * this.options.limit.y)) / 2;
    if (y > 0) {
        _middle.y = _limit.down - _size;
    } else {
        _middle.y = _limit.up + _size;
    }
};

// private method
MotionDevice.prototype.isLimitY = function() {
    return (this.data.limit.up && this.data.limit.down);
};

// private method
MotionDevice.prototype.setLimitX = function(x) {
    var _limit = this.data.limit || {};
    // set left and right limits for axis x
    _limit.right = x + this.options.limit.x;
    _limit.left = x - this.options.limit.x;
};

// private method
MotionDevice.prototype.setMiddlePointX = function(x) {
    var _middle = this.data.middle || {};
    var _limit = this.data.limit || {};
    var _size = (360 - (2 * this.options.limit.x)) / 2;
    if (x > 0) {
        _middle.x = _limit.left - _size;
    } else {
        _middle.x = _limit.right + _size;
    }
};

// private method
MotionDevice.prototype.isLimitX = function() {
    return (this.data.limit.right && this.data.limit.left);
};

// private method
MotionDevice.prototype.updateStepX = function(x) {
    var _limit = this.data.limit || {};
    var _start = this.data.start || {};
    var _step = this.data.step || {};
    if (x > _limit.right) {
        x = _limit.right;
    } else if (x < _limit.left) {
        x = _limit.left;
    }
    _step.x = x - _start.x;
};

// private method
MotionDevice.prototype.updateStepY = function(y) {
    var _limit = this.data.limit || {};
    var _start = this.data.start || {};
    var _middle = this.data.middle || {};
    var _step = this.data.step || {};
    // limita area for axis y
    if (_limit.down > _limit.up) {

        if (y > _limit.up && y < _middle.y) {
            y = _limit.up;
        } else if (y < _limit.down && y > _middle.y) {
            y = _limit.down;
        }

        if ((_start.y < 0 && y < 0) || (_start.y > 0 && y > 0)) {
            _step.y = y - _start.y;
        } else {
            if (_start.y > 0) {
                if (y > 0) {
                    _step.y = y + _limit.down;
                } else {
                    _step.y = (90 + y) - _middle.y;
                }
            } else {
                if (y > 0) {
                    _step.y = (-90 + y) - _middle.y;
                } else {
                    _step.y = y - _limit.down;
                }
            }
        }

    } else {

        if (_middle.y < 0) {
            if ((y > _limit.up && y < 90) || (y > -90 && y < _middle.y)) {
                y = _limit.up;
            } else if (y < _limit.down && y > _middle.y) {
                y = _limit.down;
            }
        } else {
            if ((y > _limit.up && y < _middle.y)) {
                y = _limit.up;
            } else if ((y < _limit.down && y > -90) || (y < 90 && y > _middle.y)) {
                y = _limit.down;
            }
        }

        _step.y = y - _start.y;

    }
};

// Singleton class
var motionDevice = (function() {

    var INSTANCE;

    return {
        create: function(window, options) {
            if (!INSTANCE) {
                INSTANCE = new MotionDevice(window, options);
            }
            return INSTANCE;
        }
    };

}());
