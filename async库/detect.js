/**
 * Created by Agent47 on 2018/3/5
 * */
"use strict";

const test = require('./test'),
    async = require('async'),
    promisify = require('util').promisify,
    fs = require('fs'),
    path = require('path');

/**
 * 有点类似Promise.race 但是只返回第一个返回true的 的输入参数 都不通过就返回 undefined
 * detect(coll, iteratee, callbackopt)
 * */
async.detect(['file1', 'file2', 'file3', path.resolve('detect.js'), path.resolve('concat.js')], function (filePath, callback) {
    console.log(filePath);
    fs.open(filePath, "r", function (error) {
        callback(null, !error)
    })
}, function (err, result) {
    console.log("****");
    console.log(result)
});