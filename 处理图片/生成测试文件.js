/**
 * Created by Agent47 on 2018/5/7
 * */
"use strict";
const
    path = require('path'),
    fs = require("fs");
const fromRootDirectoryPath = "d:\\test\\test1";

writeRandomFile(fromRootDirectoryPath,100);

function writeRandomFile(dirPath, num, {fileSize = [100, 1000]} = {}) {
    for (let i = 0; i <= num; i++) {
        fs.appendFileSync(path.resolve(dirPath,`${i}.text`), createRandomFile(fileSize[0], fileSize[1]));
    }
}

function createRandomFile(min, max) {
    const times = min + Math.random() * (max - min);
    let result = "";
    for (let i = 0; i <= times; i++) {
        result += String(Math.random())
    }
    return result

}