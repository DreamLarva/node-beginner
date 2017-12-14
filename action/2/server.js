const http = require('http');
const fs = require('fs');
const path = require("path");
const mime = require('mime');

const chatServer = require("./lib/chat_server");

const cache = {};

const server = http.createServer(function(request,response){
    "use strict";
    let filePath;
    console.log(request.url);
    if(request.url === "/"){
        filePath = 'public/index.html';
    }else{
        filePath = 'public' + request.url
    }
    const absPath = './' + filePath;
    serverStatic(response,cache,absPath)
});

chatServer.listen(server);



server.listen(3000,function(){
    "use strict";
    console.log("Server listening on port 3000")
});


function send404(response) {
    "use strict";
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write("Error 404;resource not found.");
    response.end();
}

function sendFile(response, filePath, fileContents) {
    "use strict";
    response.writeHead(200, {
        "Content-Type": mime.getType(path.basename(filePath))
    });
    response.end(fileContents)
}

function serverStatic(response, cache, absPath) {
    "use strict";
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath])
    } else {
        /**
         * fd 是文件描述符
         * 标准输入（standard input）的文件描述符是 0，标准输出（standard output）是 1，标准错误（standard error）是 2。
         * window 似乎返回的是3
         * */
        fs.open(absPath, 'r', (err, fd) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error(`${absPath} does not exist`);
                    return;
                }
                send404(response);
                throw err;
            }else{

                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(response)
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data)
                    }
                })
            }


        });
    }
}



















