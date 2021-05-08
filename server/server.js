var express = require('express');
var websocket = require('socket.io');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gamehub = require('./src/gamehub');

app.use(express.static('./dist/public'));

app.get('/', function(req, res){
  res.render('index');
})

io.on('connection', function(socket) {
  console.log('gamepad connected');

  socket.on('disconnect', function() {
    if(socket.inputId !== undefined){
      console.log('goodbye input -> ' + socket.inputId);
      gamehub.disconnect(socket.inputId);
    }
    console.log('gamepad disconnected');
    return null;
  });

  socket.on('hello', function() {
    gamehub.connect(function(inputId){
      if (inputId !== -1) {
        socket.inputId = inputId;
        console.log('hello input -> ' + socket.inputId);
        socket.emit('hello', {
          inputId: inputId
        })
      }
      return null;
    });
    return null;
  });

  socket.on('event', function(code) {
    // console.log('event -> ' + code + ' input -> ' + socket.inputId);
    if(socket.inputId !== undefined && code){
      gamehub.sendEvent(socket.inputId, code);
    }
    return null;
  });

});

// Start the server on port provided by grunt-express-server
http.listen(process.env.PORT, function() {
    console.log('Express server listening on port ' + process.env.PORT);
});

module.exports = app;
