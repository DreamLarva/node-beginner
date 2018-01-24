/**
 * Created by Agent47 on 2018/1/19
 * */
"use strict";

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const workers = {};
let requests = 0;

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        workers[i] = cluster.fork();
        workers[i].on('message', function (message) {
            if (message.cmd === 'incrementRequestTotal') {
                requests++;
                for (let i = 0; i < numCPUs; i++) {
                    workers[i].send({
                        cmd: "updateOfRequestTotal",
                        requests
                    })
                }
            }
        })
    }
    cluster.on('exit', function (worker, code, signal) {
        console.log(`工作进程 ${worker.process.pid} 已退出`)
    });
} else {
    process.on('message', function (message) {
        if (message.cmd === 'updateOfRequestTotal') {
            requests = message.requests;
        }
    });
    http.Server(function (req, res) {
        res.writeHead(200);
        const str = 'Worker in process ' + process.pid + ' says cluster has responded to ' + requests + ' requests.'
        console.log(str);
        res.end(str);
        process.send({cmd: "incrementRequestTotal"})
    }).listen(3000);
    console.log(`工作进程 ${process.pid} 已启动`);
}

