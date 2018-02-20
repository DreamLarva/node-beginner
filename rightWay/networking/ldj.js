/**
 * Created by Agent47 on 2018/2/13
 * */
"use strict";
const
    events = require('events'),
    util = require('util');


/**
 * 可能先为了兼容旧版的nodejs 会写成events.EventEmitter  新版的 events === events.EventEmitter 所以只写events 就行了
 * */
/*
const LDJClient = function (stream) {
    events.call(this);
    let
        buffer = "",
        self = this;

    stream.on('data', data => {
        buffer += data;
        let boundary = buffer.indexOf("\n");
        while (boundary !== -1) {
            let input = buffer.substr(0,boundary);
            buffer = buffer.substr(boundary + 1);
            self.emit("message", JSON.parse(input));
            boundary = buffer.indexOf('\n')
        }
    })
};
util.inherits(LDJClient, events);
*/



class LDJClient extends events {
    constructor(stream) {
        super();

        let buffer = "";

        stream.on('data', data => {
            buffer += data;
            let boundary = buffer.indexOf("\n");
            while (boundary !== -1) {
                let input = buffer.substr(0, boundary);
                buffer = buffer.substr(boundary + 1);
                this.emit("message", JSON.parse(input));
                boundary = buffer.indexOf('\n')
            }
        })
    }
}


exports.LDJClient = LDJClient;
exports.connect = function (stream) {
    return new LDJClient(stream)
};
