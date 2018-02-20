/**
 * Created by Agent47 on 2018/2/13
 * */
"use strict";

/**
 * 使用telnet localhost 5432 来查看
 * */

const fs = require('fs'),
    net = require('net'),
    filename = process.argv[2],
    server = net.createServer(function (connection) {
        // reporting
        console.log('Subscriber connected.');
        connection.write(JSON.stringify({
            type:"watching",
            file:filename,
            timestamp:Date.now()
        }) + "\n");
        // watcher setup
        let watcher = fs.watch(filename, function () {
            connection.write(JSON.stringify({
                type:"changed",
                file:filename,
                timestamp:Date.now()
            }) + "\n");
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

server.listen(5432,function(){
    console.log('Listen for subscribers...');
});


