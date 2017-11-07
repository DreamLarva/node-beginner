const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const allType = require("./type.json").all;
const mediaType = require("./type.json").media;
const explainMd5 = require("./md5");


const rootDirectoryPath = "E:\\test2";

// 异步删除文件
const unlink = path => promisify(fs.unlink)(path)
    .then(() => console.log(`删除${path}成功`))
    .catch(err => console.log(err));


// 读取一层文件夹
async function OneStep(rootDirectoryPath) {
    "use strict";
    const files = await readdir(rootDirectoryPath);
    for (let file of files) {
        let fileState = await stat(path.resolve(rootDirectoryPath, file));
        let filePath = path.resolve(rootDirectoryPath, file);
        if (isDirectory(fileState)) {
            OneStep(filePath)
                .catch(err => console.log(err))
        } else {
            const fileStat = await stat(filePath);
            if (fileStat.size === 0) {
                await unlink(filePath)
            }

        }

    }
}

// 删除空文件夹
async function twoStep(rootDirectoryPath) {
    "use strict";
    const files = await readdir(rootDirectoryPath);
    for (let file of files) {
        let fileState = await stat(path.resolve(rootDirectoryPath, file));
        let filePath = path.resolve(rootDirectoryPath, file);
        if (isDirectory(fileState)) {
            twoStep(filePath)
                .catch(err => console.log(err))
                .then(async () => {
                    const files = await readdir(filePath);
                    files.length === 0 && await rmdir(filePath)
                        .then(async () => {
                            const files = await readdir(filePath);
                            files.length === 0 && await rmdir(filePath)
                        })
                })
        }

    }
}


function rmdir(path) {
    "use strict";
    return promisify(fs.rmdir)(path)
        .then(() => console.log("删除文件夹 " + path + " 成功"))
        .catch(err => console.log(err));
}

// 读取文件
function readdir(targetPath) {
    "use strict";
    return promisify(fs.readdir)(targetPath)
}

// 异步 读取 文件 or 文件夹的状态
function stat(path) {
    return promisify(fs.stat)(path)
        .then(stats => stats)
        .catch(err => console.log(err));
}

function isDirectory(stat) {
    "use strict";
    return stat.isDirectory();
}

async function main(rootDirectoryPath) {
    "use strict";
    await OneStep(rootDirectoryPath);
    await twoStep(rootDirectoryPath);
}


main(rootDirectoryPath);