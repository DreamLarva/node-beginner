var bin = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]);
var dup = new Buffer(bin.length);
var recommend = Buffer.from([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]);
const fs = require("fs")

bin.copy(dup);
dup[0] = 0x48;
console.log(bin); // => <Buffer 68 65 6c 6c 6f>
console.log(dup); // => <Buffer 48 65 65 6c 6f>
console.log(recommend);

var rs = fs.createReadStream("test.md");
var ws = fs.createWriteStream("testTarget.md");


rs.on('data', function (chunk) {
    const isDrain = (ws.write(chunk));
    console.log(isDrain);
    if (isDrain === false) {
        rs.pause();
    }
});


ws.on('drain', function () {
    console.log("drain");
    rs.resume();
});


rs.on('end', function () {
    ws.end();
});