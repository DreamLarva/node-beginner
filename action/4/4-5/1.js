const http = require('http');
const qs = require('querystring');
const items = [];

const server = http.createServer(function (req, res) {
    "use strict";
    if ('/' === req.url) {
        switch (req.method) {
            case "GET":
                show(res);
                break;
            case "POST" :
                add(req, res);
                break;
            default:
                badRequest(res)
        }
    }else{
        notFound(res)
    }
});

server.listen(3000);

function show(res) {
    "use strict";
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>TodoList</title>
        </head>
        <body>
        <h1>Todo List</h1>
        <ul>
            ${items.map(v => `<li>${v}</li>`).join("")}
        </ul>
        <form method="post" action="/">
            <p><input type="text" name="item"></p>
            <p><input type="submit" value="Add Item"></p>
        </form> 
        </body>
        </html>`;

    res.setHeader('Content-Type','text/html');
    res.setHeader('Content-Length',Buffer.byteLength(html));
    res.end(html)
}

function notFound(res){
    "use strict";
    res.statusCode = 404;
    res.setHeader('Content-type','text/plain');
    res.end('Bad Request');

}


function add(req,res) {
    "use strict";
    let body = '';
    req.setEncoding('utf-8');
    req.on('data',function(chunk){
        body += chunk
    });
    req.on('end',function(){
        const obj = qs.parse(body);
        console.log(body);
        console.log(obj);
        items.push(obj.item);
        show(res)
    })
}


function badRequest(res) {
    "use strict";
    res.statusCode = 400;
    res.setHeader('Content-type','text/plain');
    res.end('Bad Request');
}