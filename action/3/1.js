const EventEmitter = require('events');
const net = require('net');
/**
 *  监视watch 文件家中的文件 如果改动或者新增 就 剪切到done 文件夹中
 * */
const channel = new EventEmitter();

channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id, client) {
    "use strict";
    const self = this;
    this.clients[id] = client;
    this.subscriptions[id] = function (senderId, message) {
        if (id !== senderId) {
            self.clients[id].write(message)
        }
    };
    this.on('broadcast', this.subscriptions[id])
});
channel.on('leave', function (id) {
    "use strict";
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id + " has left the chat. \n")
});
channel.on("shutdown", function () {
    "use strict";


});

const server = net.createServer(function (client) {
    "use strict";
    const id = client.remoteAddress + ":" + client.remotePort;
    client.on('connect', function () {
        channel.emit('join', id, client);
        console.log(`与${id} 建立连接`)
    });
    client.on('data', function (data) {
        data = data.toString();
        if (data === "shutdown") {
            channel.emit('shutdown')
        }
        channel.emit('broadcast', id, data);
        console.log(`${id} => ${data}`)

    });
    client.on('close', function () {
        channel.emit('leave', id)
    });
    client.on('shutdown', function () {
        channel.emit('broadcast', '', "Chat has shut down. \n");
        channel.removeAllListeners('broadcast')
    })

});

server.listen(8888);