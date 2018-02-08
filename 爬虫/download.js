/**
 * Created by Agent47 on 2018/2/7
 * */
"use strict";
const http = require('http');
const fs = require('fs');


module.exports = function (url, downloadPath, callback) {
    http.get(url, function (res) {
        res.on("end", function () {
            console.log(downloadPath + "下载成功");
            callback()
        });
        res.pipe(fs.createWriteStream(downloadPath));

    }).on("error", function (err) {
        callback(err)
    });
};
