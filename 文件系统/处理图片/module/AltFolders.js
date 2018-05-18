/**
 * Created by Agent47 on 2018/3/1
 * */
"use strict";
const
    Folder = require('./Folder'),
    fs = require('fs'),
    path = require('path');

class AltFolders {
    constructor(typeFolderPath, typeConfig) {
        this.typeFolderPath = typeFolderPath;
        this.config = typeConfig;

        const numFolderPaths = fs.readdirSync(typeFolderPath);
        this.folderSize = numFolderPaths.length;
        this.folders = numFolderPaths.map(numFolderPath =>
            new Folder(path.resolve(typeFolderPath, numFolderPath), typeConfig)
        );
        this.filter()
    }

    getFolder() {
        if (this.folders.length) {
            // 有可用的
        } else {
            // 没有可用的
            const newDirPath = path.resolve(this.typeFolderPath, String(this.folderSize));
            this.mkdir(newDirPath);
            console.log(`新建文件夹`);
            // 新建一个可用的Folder
            this.folders.push(new Folder(newDirPath, this.config));
        }
        return this.folders[0]
    }


    mkdir(path) {
        fs.mkdirSync(path);
        this.folderSize++
    }

    move(fn) {
        const self = this;
        const folder = this.getFolder();


        return new Promise(function(resolve,reject){
            fn(folder, function () {
                folder.add();
                self.filter();
                resolve()
            })
        })


    }

    filter() {
        this.folders = this.folders.filter(folder => folder.isAvailable);
    }
}


module.exports = AltFolders;