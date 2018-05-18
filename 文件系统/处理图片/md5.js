const fs = require('fs'),
    path = require('path'),
    crypto = require('crypto');

/**
 * @function 得到文件的md5码
 * @param {string} filePath - 完整文件路径
 * @param {function} callback - 回调函数
 * */
function toMd5(filePath, callback) {
    "use strict";
    const reg = /[\d\w]{32,}/;
    if (reg.test(path.basename(filePath))) {
        console.log(`${path.basename(filePath)} 已经hash了`);
        return callback(null, path.parse(filePath).name)
    }

    const md5sum = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    stream.on('data', function (chunk) {
        md5sum.update(chunk);
    });
    stream.on('end', function () {
        callback(null, md5sum.digest('hex'))

    });
    stream.on('error', function (error) {
        callback(error);
    });
}


module.exports = toMd5;
