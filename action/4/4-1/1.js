const http = require('http');
const url = require('url');

const items = [];
const server = http.createServer(function (req, res) {
    "use strict";
    switch (req.method) {
        case "POST":
            let item = '';
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                item += chunk;
            });
            req.on('end', function () {
                items.push(item);
                res.end('OK\n');
            });
            break;
        case "GET":
            const body = items.map(function (item, i) {
                return i + ")" + item;
            }).join("\n");
            res.setHeader('Content-Length', Buffer.byteLength(body));
            res.setHeader('Content-Type', 'text/plain;charset="utf-8"');
            res.end(body);
            break;
        case 'DELETE':
            const path = url.parse(req.url).pathname;
            const i = parseInt(path.slice(1),10);
            if(isNaN(i)){
                res.statusCode = 400;
                res.end('Invalid item id');
            }else if(!items[i]){
                res.statusCode = 404;
                res.end('Item not found');
            }else{
                items.splice(i,1);
                res.end('OK\n');
            }
            break;
    }
});
server.listen(1234);