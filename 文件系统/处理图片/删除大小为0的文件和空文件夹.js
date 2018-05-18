/**
 * Created by Agent47 on 2018/2/28
 * */
"use strict";

const
    fs = require("fs"),
    path = require("path"),
    file = require('file');


/**
 * 删除大小为0 的文件
 * */
function clearFile(dirPath) {
    file.walkSync(dirPath, function (dirPath, dirs, files) {
        /**
         * dirPath 当前文件夹
         * dirs 当前文件中的文件夹
         * files 当前文件夹中的文件
         * */
        for (let file of files) {
            const filePath = path.resolve(dirPath, file);
            const stat = fs.statSync(filePath);
            if (stat.size === 0) {
                fs.unlinkSync(filePath);
                console.log("删除大小为0的文件" + filePath)
            }
        }
    })
}

/**
 * 删除空文件夹
 * */
function clearDir(rootdirPath) {
    file.walkSync(rootdirPath, function (dirPath, dirs, files) {
        /**
         * dirPath 当前文件夹
         * dirs 当前文件中的文件夹
         * files 当前文件夹中的文件
         * */

        // 如果当前文件夹 下没有文件 且 没有文件夹 那么认为是空文件件
        if (files.length === 0 && dirs.length === 0) {
            // 删除空文件夹
            fs.rmdirSync(dirPath);
            console.log(`删除空文件夹 ${dirPath}`);
            // 父文件如果不是根文件夹 重新检查是不是空文件夹
            const fatherDir = path.resolve(dirPath, "..");
            rootdirPath !== fatherDir && clearDir(fatherDir)
        }
    })
}

exports = {
    clearFile,
    clearDir
};