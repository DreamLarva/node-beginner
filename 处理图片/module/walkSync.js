/**
 * Created by Agent47 on 2018/5/7
 * */
"use strict";
const
    path = require("path"),
    fs = require("fs");

async function walkSync(start, callback) {
    var stat = fs.statSync(start);

    if (stat.isDirectory()) {
        var filenames = fs.readdirSync(start);

        var coll = filenames.reduce(function (acc, name) {
            var abspath = path.join(start, name);

            if (fs.statSync(abspath).isDirectory()) {
                acc.dirs.push(name);
            } else {
                acc.names.push(name);
            }

            return acc;
        }, {"names": [], "dirs": []});

        await callback(start, coll.dirs, coll.names);

        for (let i = 0; i < coll.dirs.length; i++) {
            var abspath = path.join(start, coll.dirs[i]);
            await walkSync(abspath, callback);
        }

    } else {
        throw new Error("path: " + start + " is not a directory");
    }
}

module.exports = walkSync;