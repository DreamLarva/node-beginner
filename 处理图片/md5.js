var fs = require('fs');
var crypto = require('crypto');

var path = 'D:\\test1\\ac-12203729.gif';
var start = new Date().getTime();
var md5sum = crypto.createHash('md5');
var stream = fs.createReadStream(path);
stream.on('data', function(chunk) {
    md5sum.update(chunk);
});
stream.on('end', function() {
    const str = md5sum.digest('hex').toUpperCase();
    console.log('文件:'+path+',MD5签名为:'+str+'.耗时:'+(new Date().getTime()-start)/1000.00+"秒");
});