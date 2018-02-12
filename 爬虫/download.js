/**
 * Created by Agent47 on 2018/2/7
 * */
"use strict";
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require("url");

const protocol = {http, https};

module.exports = function (downloadUrl, downloadPath, callback) {
    protocol[url.parse(downloadUrl).protocol.slice(0, -1)].get(downloadUrl, function (res) {
        res.on("end", function () {
            console.log(downloadPath + "下载成功");
            callback()
        });
        res.pipe(fs.createWriteStream(downloadPath));

    }).on("error", function (err) {
        callback(err)
    });
};
