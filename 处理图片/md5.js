const fs = require('fs');
const crypto = require('crypto');
const promisify = require("util").promisify;


function explainMd5(path, callback) {
    "use strict";
    const md5sum = crypto.createHash('md5');
    const stream = fs.createReadStream(path);
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


module.exports = promisify(explainMd5);
