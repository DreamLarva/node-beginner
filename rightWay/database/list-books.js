/**
 * Created by Agent47 on 2018/2/23
 * */
"use strict";
const
    rootPath = "D:\\temp\\rdf-files\\",
    path = require('path'),
    // promisify = require('util').promisify,
    // Promise = require('bluebird'),
    file = require("file"),
    async = require("async"),
    rdfParser = require('./rdf-parser'),
    work = async.queue(function (path, done) {
        rdfParser(path, function (err, doc) {
            if (err) throw err;
            console.log(doc);
            done();
        })
    }, 1000);


console.log('beginning directory walk');

file.walk(path.resolve(rootPath, "cache"), function (err, dirPath, dirs, files) {
    console.log(dirPath, dirs, files);
    files.forEach(function (path) {
        work.push(path);
    })
});