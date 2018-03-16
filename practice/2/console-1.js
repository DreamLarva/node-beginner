console.log("string")
console.log({a:1,b:2})
setTimeout(()=>console.log("async finish"));
/**
 * 将某个输出流直接 重定向到文件
 * node console-1 2>errors-file.log
 * 0 代表输入流
 * 1 代表输出流
 * 2 代表错误流
 * */