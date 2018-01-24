/**
 * Created by Agent47 on 2018/1/24
 * */
"use strict";

const net = require('net');
const host = process.argv[2];
const port = Number(process.argv[3]);

const socket = net.connect(port,host);

socket.on('connect',function(){
    // 将进程的stdin 传给socket
   process.stdin.pipe(socket);
   socket.pipe(process.stdout);
   process.stdin.resume();
});

socket.on('end',function(){
   process.stdin.pause();
});