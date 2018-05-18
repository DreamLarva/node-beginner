/**
 * Created by Agent47 on 2018/5/18
 * */
"use strict";
const
    path = require('path'),
    fs = require('fs');

const
    file = require('file');

const rootPath = 'D:\\Program Files';

Array.prototype.shuffle = function () {
    let i = this.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [this[j], this[i]] = [this[i], this[j]];
    }
    return this
};


const all = [];
file.walkSync(rootPath, function (dirPath, dirs, files) {
    for (let file of files) {
        all.push(path.join(dirPath, file))
    }
});

const randomArr =  numberArray(0, all.length).shuffle().splice(-4, 4);
randomArr.forEach( v => {
    console.log(all[v])
});


function numberArray(start, length) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr[i] = start + i;
    }
    return arr
}





