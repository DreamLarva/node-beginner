/**
 * Created by Agent47 on 2018/1/23
 * */
"use strict";
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    setInterval(() => {
        io.emit('tick', {for: 'everyone'});
    },1000);

});

io.on('connection', (socket) => {
    console.log("another connection handler");
    socket.broadcast.emit('an event', { some: 'data' }); // everyone gets it but the sender
});



http.listen(3000, function(){
    console.log('listening on *:3000');
});
