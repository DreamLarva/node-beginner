/**
 * Created by Agent47 on 2018/2/14
 * */
"use strict";
const
    net = require('net'),
    ldj = require('./ldj'), // ldj = {connect,LDJClient}}
    netClient = net.connect({port: 5432}), // nerClient 有 data 事件
    ldjClient = ldj.connect(netClient);

ldjClient.on('message', function (message) {
    if (message.type === 'watching') {
        console.log(`Now watching: ${message.file}`);
    } else if (message.type === 'changed') {
        console.log(`File '${message.file} changed at ${new Date(message.timestamp)}'`)
    } else {
        throw Error(`Unrecognized message type: ${message.type}`);
    }
});