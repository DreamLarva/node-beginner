var fs = require('fs');
/**
 * 这里用了 {highWaterMark: 11}  模拟刚好buffer 截断了一个中文字符的情况 (虽然正常情况下出现的情况因为buffer 很大而截断的次数很少而不太发生)
 * 可能没法辨识这个文字
 *
 * */
var rs = fs.createReadStream('test.md', {highWaterMark: 11});
rs.setEncoding("utf-8"); // 加上这句后 就会保证截断的时候不会 在一个宽字符的中间
var data = '';
rs.on("data", function (chunk){
    data += chunk;
});
rs.on("end", function () {
    console.log(data);
});