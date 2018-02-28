/**
 * Created by Agent47 on 2018/2/27
 * */
"use strict";
const
    http = require('http'),
    server = http.createServer(function(req,res){
        res.writeHead(200,{'Content-Type':'text/plain'});
        res.end('Hello world\n')
    });
server.listen(3000,function(){
   console.log('ready captain!')
});
