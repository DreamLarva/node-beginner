/**
 * Created by Agent47 on 2018/1/26
 * */
"use strict";

const asyncCtrl = require("./asyncCtrl");
const promisify = require("util").promisify;

function test(time, callback) {
    setTimeout(() => callback(null, time), time)
}

function test2(time, callback) {
    setTimeout(() => callback(null, time), time)
}

const asyncCtrlWithParam = asyncCtrl(2);

const _test = promisify(asyncCtrlWithParam(test));
const _test2 = promisify(asyncCtrlWithParam(test2));


_test(1000).then((time) => {console.log('任务1-1-0 完成', time);return 100})
    .then((time) => _test(time))
    .catch(console.log)
    .then((time) => console.log('任务1-1-1 完成',time));
_test2(1000).then((time) => console.log('任务2-1 完成', time));

_test(1000).then((time) => console.log('任务1-2 完成', time));
_test2(1000).then((time) => console.log('任务2-2 完成', time));

_test(1000).then((time) => console.log('任务1-3 完成', time));
_test2(1000).then((time) => console.log('任务2-3 完成', time));

_test(1000).then((time) => console.log('任务1-4 完成', time));
_test2(1000).then((time) => console.log('任务2-4 完成', time));

_test(1000).then((time) => console.log('任务1-5 完成', time));


