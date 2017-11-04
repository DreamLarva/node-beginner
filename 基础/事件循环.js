
setTimeout(()=> console.log("setTimeout1"),0);
// 加入??nextTick()的回调函数
process.nextTick(function () {
    console.log('nextTick??执行1');
});
process.nextTick(function () {
    console.log('nextTick??执行2');
});
// 加入??setImmediate()的回调函数
setImmediate(function () {
    console.log('setImmediate??执行1');
// 进入??循环
    process.nextTick(function () {
        console.log('插入');
    });
});
setTimeout(()=> console.log("setTimeout2"),0);
setImmediate(function () {
    console.log('setImmediate??执行2');
});
console.log('正常执行');