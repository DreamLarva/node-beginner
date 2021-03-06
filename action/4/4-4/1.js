const http = require('http');
const parse = require('url').parse;
const join = require('path').join;
const fs = require('fs');

const root = __dirname;

const server = http.createServer(function(req,res){
    "use strict";
   const url = parse(req.url);
   const path = join(root,url.pathname);
   fs.stat(path,function(err,stat){
       if(err){
           if('ENOENT' === err.code){
               res.statusCode = 404;
               res.end('Not Found');
           }else{
               res.statusCode = 500;
               res.end('Internal Server code');
           }
       }else{
           res.setHeader('Content-Length',stat.size);
           const stream = fs.createReadStream(path);

           // 绑定报错内容
           stream.on('error',function(err){
               res.statusCode = 500;
               res.end('Internal Server Error')
           });
           stream.pipe(res); // 执行
       }
   });


});

server.listen(3000);

// curl http://localost:3000/static.js -i