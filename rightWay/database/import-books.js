/**
 * Created by Agent47 on 2018/2/23
 * */
"use strict";
const


    path = require('path'),
    file = require("file"),
    { URL } = require('url'),
    request = require('request'),

    async = require("async"),
    rdfParser = require('./rdf-parser'),

    rootPath = "D:\\temp\\rdf-files\\",
    couchDB_Url = "http://192.168.112.89:5984",

    work = async.queue(function (_path, done) {
        rdfParser(_path, function (err, doc) {
            const url = new URL(couchDB_Url);
            url.pathname = path.join("books",doc._id);
            console.log(url.href);

            request({
                method: "PUT",
                url:url.href,
                json: doc
            },function(err,res,body){
                if(err)throw Error(err);
                console.log(res.statusCode,body);
                done()
            })
        })
    }, 10);


console.log('beginning directory walk');
file.walk(path.resolve(rootPath, "cache"), function (err, dirPath, dirs, files) {
    // console.log(dirPath, dirs, files);
    files.forEach(function (path) {
        work.push(path);
    })
});