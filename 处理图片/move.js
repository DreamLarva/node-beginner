/**
 * Created by Agent47 on 2018/1/24
 * */
"use strict";

const
    fs = require('fs'),
    promisify = require("util").promisify,
    rename = promisify(fs.rename),
    copy = promisify(fs.copyFile),
    unlink = promisify(fs.unlink);


/**
 * @async
 * @function 移动文件 如果在同样盘符下就移动 不是就复制并删除源文件
 * @param {string} oldPath - 源文件地址
 * @param {string} newPath - 目标文件地址
 * */
async function move(oldPath, newPath) {
    try {
        // 路径都在同一磁盘下就 使用rename
        await rename(oldPath, newPath)
    } catch (err) {
        // 路劲在不同磁盘下 使用 copy + unlink
        if (err.code === "EXDEV") {
            await copy(oldPath, newPath, fs.constants.COPYFILE_EXCL);
            await unlink(oldPath);
        }
    }
    console.log(oldPath + " => " + newPath)
}

/**
 * @async
 * @function 移动文件 如果在同样盘符下就移动 不是就复制并删除源文件
 * @param {string} oldPath - 源文件地址
 * @param {string} newPath - 目标文件地址
 * */
function moveSync(oldPath, newPath) {
    try {
        // 路径都在同一磁盘下就 使用rename
        fs.renameSync(oldPath, newPath)
    } catch (err) {
        // 路劲在不同磁盘下 使用 copy + unlink
        if (err.code === "EXDEV") {
            fs.copyFileSync(oldPath, newPath, fs.constants.COPYFILE_EXCL);
            fs.unlinkSync(oldPath);
        }
    }
    console.log(oldPath + " => " + newPath)

}


exports = Object.assign(exports, {
        move,
        moveSync,
    }
);