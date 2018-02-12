/**
 * Created by Agent47 on 2018/2/9
 * */
"use strict";

/**
 * gitbash  中使用才有效果
 * */
const spawn = require('child_process').spawn;
// 相当于在gitbash 中使用 使用ls 命令
let ls = spawn('ls');
ls.stdout.pipe(process.stdout);