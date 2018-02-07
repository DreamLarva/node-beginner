/**
 * Created by Agent47 on 2018/2/7
 * */
"use strict";
const http = require('http');
const fs = require('fs');


module.exports = function (url, downloadPath, callback) {
    http.get(url, function (res) {
        res.on("data", function (data) {

            fs.appendFile(downloadPath, data, (err) => err && console.log(err))
        });
        res.on("end", function () {
            console.log(downloadPath + "下载成功");
            callback()
        })

    }).on("error", function (err) {
        callback(err)
    });
};
