/**
 * Created by Agent47 on 2018/3/5
 * */
"use strict";
const test = require('./test'),
    async = require('async'),
    promisify = require('util').promisify,
    fs = require('fs'),
    path = require('path');


async.map(['file1', 'file2', 'file3'], test.fun, function (err, results) {
    // results is now an array of stats for each file
    console.log(results)
});