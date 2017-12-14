/**
 * 创建tcp服务器
 * */



var net = require('net');

var server = net.createServer(function (socket) {
// ?的?接
    socket.on('data', function (data) {
        socket.write("你好");
    });
    socket.on('end', function () {
        console.log('连接断开');
    });
    socket.write("哈哈哈啊啊哈哈哈哈\n");
});
server.listen(8124, function () {
    console.log('server bound');
});

