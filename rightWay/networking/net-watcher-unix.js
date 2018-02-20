/**
 * Created by Agent47 on 2018/2/13
 * */
"use strict";

/**
 * windows 当然不支持
 * */

const fs = require('fs'),
    net = require('net'),
    filename = process.argv[2],
    server = net.createServer(function (connection) {
        // reporting
        console.log('Subscriber connected.');
        connection.write(`Now watching '${filename}' for change...\n`);
        // watcher setup
        let watcher = fs.watch(filename, function () {
            connection.write(`File '${filename}' changed ${Date.now()} \n`)
        });
        // cleanup
        connection.on('close',function(){
            console.log('Subscriber disconnected.');
            watcher.close()
        });
    });

if(!filename){
    throw Error('No target filename was  specified.')
}

server.listen('tmp/watcher.sock',function(error){
    if(error)return console.log(error);
    console.log('Listen for subscribers...');
});


