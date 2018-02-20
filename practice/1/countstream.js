var Writable = require('stream').Writable;
var util = require('util');

module.exports = CountStream;

util.inherits(CountStream, Writable); //

function CountStream(matchText, options) {
    Writable.call(this, options);
    this.count = 0;
    this.matcher = new RegExp(matchText, 'ig');
    // this.on("drain",console.log);
    // this.on("pipe",console.log)
}

// 必须写在 Writable 流的子类上
CountStream.prototype._write = function(chunk, encoding, cb) {
    var matches = chunk.toString().match(this.matcher);
    if (matches) {
        this.count += matches.length;
    }
    // 执行cb 后 就会触发drain 事件
    cb();
};

CountStream.prototype.end = function() {
    this.emit('total', this.count);
};