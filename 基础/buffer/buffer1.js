const fs = require("fs")
var zlib = require('zlib');

var rs = fs.createReadStream("testBig.pdf");
var ws = fs.createWriteStream("testBig_write.pdf");
rs.pipe(ws);
console.log("复制完毕");


// 压缩 input.txt 文件为 input.txt.gz
rs
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('压缩文件.gz'));

console.log("文件压缩完成。");