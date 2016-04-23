var config = require('../../config/config');
var gameController = require('./gamepad');

var gamehub = function(){

  this.gamepads = [];

  return {
    // disconnect input devide to hub
    disconnect: function(inputId){
      if(this.gamepads[inputId] !== undefined){
        this.gamepads[inputId].disconnect();
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
            this.gamepads[i] = new gameController(i);
            this.gamepads[i].connect();
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
      this.gamepads[inputId].sendEvent(event);
      return null;
    }.bind(this)
  }

};

module.exports = new gamehub();
