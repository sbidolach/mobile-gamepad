var fs = require('fs');
var stream = fs.createReadStream( process.argv[2] );

// Event types
var types = {
	EV_SYN : 0x00,
	EV_KEY : 0x01,
	EV_REL : 0x02,
	EV_ABS : 0x03,
	EV_MSC : 0x04
}

// Codes
var codes = {}

codes[ types.EV_REL ] = {
	REL_X : 0x00,
	REL_Y : 0x01,
	REL_WHEEL : 0x08
}

codes[ types.EV_ABS ] = {
	ABS_X : 0x00,
	ABS_Y : 0x01,
	ABS_Z : 0x02
}

codes[ types.EV_KEY ] = {
	BTN_MOUSE    : 0x110,
	BTN_LEFT     : 0x110,
	BTN_RIGHT    : 0x111,
	BTN_MIDDLE   : 0x112,
	BTN_MOUSE    : 0x110,
	BTN_LEFT     : 0x110,
	BTN_RIGHT    : 0x111,
	BTN_MIDDLE   : 0x112,
	BTN_SIDE     : 0x113,
	BTN_EXTRA    : 0x114,
	BTN_FORWARD  : 0x115,
	BTN_BACK     : 0x116,
	BTN_TASK     : 0x117,
	BTN_JOYSTICK : 0x120,
	BTN_TRIGGER  : 0x120,
	BTN_THUMB    : 0x121,
	BTN_THUMB2   : 0x122,
	BTN_TOP      : 0x123,
	BTN_TOP2     : 0x124,
	BTN_PINKIE   : 0x125,
	BTN_BASE     : 0x126,
	BTN_BASE2    : 0x127,
	BTN_BASE3    : 0x128,
	BTN_BASE4    : 0x129,
	BTN_BASE5    : 0x12a,
	BTN_BASE6    : 0x12b,
	BTN_DEAD     : 0x12f,
	BTN_GAMEPAD  : 0x130,
	BTN_A        : 0x130,
	BTN_B        : 0x131,
	BTN_C        : 0x132,
	BTN_X        : 0x133,
	BTN_Y        : 0x134,
	BTN_Z        : 0x135,
	BTN_TL       : 0x136,
	BTN_TR       : 0x137,
	BTN_TL2      : 0x138,
	BTN_TR2      : 0x139,
	BTN_SELECT   : 0x13a,
	BTN_START    : 0x13b,
	BTN_MODE     : 0x13c,
	BTN_THUMBL   : 0x13d,
	BTN_THUMBR   : 0x13e
}

stream.on('data', function( buffer ){
	var tv_sec   = buffer.readInt64LE(0),
		tv_usec  = buffer.readInt64LE(8),
		type     = buffer.readUInt16LE(16),
		code     = buffer.readUInt16LE(18),
		value    = buffer.readInt32LE(20);

	var code_str, type_str;

	for( var key in types ) {
		if ( types[ key ] == type ) {
			type_str = key;
		}
	}

	if ( typeof codes[ type ] != 'undefined' ) {
		for( var key in codes[ type ] ) {
			if ( codes[ type ][ key ] == code ) {
				code_str = key;
			}
		}
	}

	console.log('tv_sec: %d tv_usec: %d\ntype: %d (%s) code: %d (%s) value: %d\n', tv_sec, tv_usec, type, type_str, code, code_str, value );
});
