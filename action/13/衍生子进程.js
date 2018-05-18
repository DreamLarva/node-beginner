/**
 * Created by Agent47 on 2018/1/26
 * */
"use strict";
const spawn = require('child_process').spawn;
const bat = spawn('ls'); // 使用shell方法指定一个shell选项
bat.stdout.on('data', (data) => {
    console.log(data.toString());
});
bat.stderr.on('data', (data) => {
    console.log(data.toString());
});

bat.on('exit', (code) => {
    console.log(`Child exited with code ${code}`);
});