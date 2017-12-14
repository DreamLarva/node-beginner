var http = require('http');
var fs = require('fs');
http.createServer(function(req,res){
    "use strict";
    res.writeHead(200,{
        "Content-Type":"image/jpg"
    });
    fs.createReadStream("./test.jpg").pipe(res)

}).listen(8888);
