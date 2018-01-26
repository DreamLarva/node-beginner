/**
 * Created by Agent47 on 2018/1/24
 * */
"use strict";

const fs = require('fs');
const promisify = require("util").promisify;
const asyncCtrl = require('./asyncCtrl');

const asyncCtrlWithLimit = asyncCtrl(2);
const copy = promisify(asyncCtrlWithLimit(fs.copyFile));

async function move(oldPath, newPath) {
    try {
        await promisify(fs.rename)(oldPath, newPath)
    } catch (err) {
        if (err.code === "EXDEV") {
            await copy(oldPath, newPath, fs.constants.COPYFILE_EXCL);
            // await promisify(fs.copyFile)(oldPath, newPath, fs.constants.COPYFILE_EXCL);
            await promisify(fs.unlink)(oldPath);
            console.log(oldPath + " => " + newPath)

        }
    }
}

module.exports = move;