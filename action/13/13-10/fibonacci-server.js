/**
 * Created by Agent47 on 2018/1/26
 * */
"use strict";
const http =  require('http');
const cp = require('child_process');

const server = http.createServer(function(req,res){
   const child = cp.fork("fibonacci-calc.js",[req.url.substring(1)]);
   child.on('message',function (m) {
       res.end(m.result + "\n");
   })
});
server.listen(8000);