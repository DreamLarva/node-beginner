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
)