/**
 * Created by Agent47 on 2018/1/24
 * */
"use strict";

const fs = require('fs');

function move(oldPath, newPath, callback) {
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === "EXDEV") {
                fs.copyFile(oldPath, newPath, fs.constants.COPYFILE_EXCL, callback);
            } else {
                callback(err)
            }
            return;
        }
        callback();
    })
}


module.exports = move;