// 通知stream准备开始读取数据
process.stdin.resume();

process.stdin.setEncoding('utf-8');

process.stdin.on('data',function(text){
    process.stdout.write(text.toUpperCase())
});

/**
 * 运行另个脚本的同时运行本程序
 * 例: node xxx.js | node process (本脚本)
 *
 * */