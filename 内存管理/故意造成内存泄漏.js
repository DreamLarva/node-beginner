const http = require("http");

const leakArray = [];
const leak = function () {
    for(let i=0 ;i<10000;i++){
        leakArray.push("leak" + Math.random());
    }
};
http.createServer(function (req, res) {
    leak();
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(1337);
console.log('Server running at http://127.0.0.1:1337/');