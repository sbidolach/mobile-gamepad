
$(function() {
    console.log( "ready!" );
    var socket = io();
    socket.emit('hello', 'add new input');


    $('#left').click(function(){
      socket.emit('event', 'key left');
    })
    $('#right').click(function(){
      socket.emit('event', 'key right');
    })
    $('#up').click(function(){
      socket.emit('event', 'key up');
    })
    $('#down').click(function(){
      socket.emit('event', 'key down');      
    })

});
