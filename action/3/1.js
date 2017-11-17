const EventEmitter  = require('events');
const net = require('net');

const channel  = new EventEmitter ();

channel.clients = {};
channel.subscriptions = {};

channel.on('join',function(id,client){
    "use strict";
    const self = this;
    this.clients[id] = client;
    this.subscriptions[id] = function(senderId,message){
        if(id !== senderId){
            self.clients[id].write(message)
        }
    };
    this.on('broadcast',this.subscriptions[id])
});

const server = net.createServer(function(client){
    "use strict";
    const id = client.remoteAddress + ":" + client.remotePort;
    client.on('connect',function(){
        channel.emit('join',id,client);
        console.log(`与${id} 建立连接`)
    });
    client.on('data',function(data){
        data = data.toString();
        channel.emit('broadcast',id,data);
        console.log(`${id} => ${data}`)

    })
});

server.listen(8888);