const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const allType = require("./config.json").all;
const mediaType = require("./config.json").media;
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

// 删除空文件夹 传入的文件夹 是父的文件夹
async function twoStep(rootDirectoryPath) {
    "use strict";
    let currentFiles = await readdir(rootDirectoryPath);
    // 过滤掉不是文件夹 的文件
    currentFiles = await Promise.all(currentFiles.map(async v => {
        const currentFilesPath = path.resolve(rootDirectoryPath, v);
        const currentFileStat = await stat(currentFilesPath);
        // console.log(!!isDirectory(currentFileStat) , v);
        return !!isDirectory(currentFileStat) && v
    }));
    currentFiles = currentFiles.filter(v=>v);

    console.log(currentFiles);
    // currentFiles = await currentFiles.filter(async v => {
    //     const currentFilesPath = path.resolve(rootDirectoryPath, v);
    //     const currentFileStat = await stat(currentFilesPath);
    //     return isDirectory(currentFileStat)
    // });
    await Promise.all(currentFiles.map(async v => {
        const currentFilesPath = path.resolve(rootDirectoryPath, v);
        const childFiles = await readdir(currentFilesPath);
        if (childFiles.length === 0) {
            // 没有子文件 删除文件夹
            await rmdir(currentFilesPath)
        } else {
            // 有子文件 递归
            await twoStep(currentFilesPath)
        }
    }));
    // 处理了 所有子文件后查看父文件夹 是否 还有子文件
    const rootDirectoryFiles = await readdir(rootDirectoryPath);
    if (rootDirectoryFiles.length === 0) {
        await  rmdir(rootDirectoryPath)
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