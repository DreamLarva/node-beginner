/**
 * Created by Agent47 on 2018/3/1
 * */
"use strict";
const
    fs = require('fs');


class Folder {
    constructor(folderPath, typeConfig) {
        this.path = folderPath;
        this.type = typeConfig.dirName;
        this._size = fs.readdirSync(folderPath).length;
        this.maxSize = typeConfig.maxFiles;
        this.isAvailable = this._size !== this.maxSize;

        if(this.size > this.maxSize)
            throw new Error("文类型件的数量超过了配置")
    }

    set size(value){
        this._size = value;
        this.isAvailable = this._size !== this.maxSize;
    }
    get size(){
        return this._size
    }
    add() {
        this.size++;
    }
}

module.exports = Folder;