var fs = require('fs');
var crypto = require('crypto');


function explainMd5(path) {
    "use strict";
    return new Promise((resolve, reject) => {

            let md5sum = crypto.createHash('md5');
            let stream = fs.createReadStream(path);
            stream.on('data', function (chunk) {
                md5sum.update(chunk);
            });
            stream.on('end', function () {
                // console.log(md5sum.digest('hex'))
                resolve(md5sum.digest('hex'))

            });
            stream.on('error', function (error) {
                reject(error);
                console.log(error)
            });
        }
    );

}



module.exports = explainMd5;
