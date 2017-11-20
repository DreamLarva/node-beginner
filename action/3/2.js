const events = require('events'),
    util = require('util'),
    path = require('path');

const fs = require("fs"),
    watchDir = './watch',
    processedDir = './done';

class Watcher extends events {
    constructor(watchDir, processedDir) {
        super();
        this.watchDir = watchDir;
        this.processedDir = processedDir

    }

    watch() {
        const watcher = this;
        fs.readdir(watcher.watchDir, function (err, files) {
            if (err) throw err;
            Object.keys(files).forEach(function (file) {
                watcher.emit('process', files[file]);
            });
        })
    }

    start() {
        const watcher = this;
        fs.watchFile(this.watchDir, function (current,previous) {
            console.log(current,previous);
            watcher.watch();
        })
    }
}

const watcher = new Watcher(
    path.resolve(__dirname,"test",watchDir),
    path.resolve(__dirname,"test",processedDir)
);
watcher.on('process', function (file) {
    "use strict";
    const watchFile = this.watchDir + "/" + file;
    const processedFile = this.processedDir + "/" + file.toLowerCase();

    fs.rename(watchFile,processedFile,function(err){
        if(err)throw  err;
    })
});

watcher.start();

