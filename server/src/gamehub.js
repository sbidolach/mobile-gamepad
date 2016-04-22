var config = require('../../config/config');

var gamehub = function(){

  this.gamepads = [];

  return {
    // disconnect input devide to hub
    disconnect: function(inputId){
      if(this.gamepads[inputId] !== undefined){
        this.gamepads[inputId] = undefined;
      }
      return null;
    }.bind(this),
    // connect input devide to hub
    connect: function(callback){
      try{
        /// find free slot
        for(var i=1; i <= config.padLimit; i++){
          if(this.gamepads[i] === undefined){
            this.gamepads[i] = 'install gamepad';
            return callback(i);
          }
        }
        // no available free slot
        return callback(-1);
      }catch(err){
        console.log(err);
        return callback(500);
      }
    }.bind(this),
    sendEvent: function(inputId, event){
      return null;
    }.bind(this)
  };

};

module.exports = new gamehub();
