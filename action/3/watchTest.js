const fs = require('fs'),
    path = require('path');
/**
 * 监视单个文件
 * */
const filePath = path.resolve(__dirname,"test","done","a.txt");
fs.watchFile(filePath,function(current,previous){
    "use strict";
    console.log(current,previous)
});
