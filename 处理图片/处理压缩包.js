const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const allType = require("./config.json").all;
const mediaType = require("./config.json").media;
const explainMd5 = require("./md5");


// const rootDirectoryPath = "E:\\test";
const rootDirectoryPath = "E:\\Downloads\\图片";

const targetPathForOther = "e:\\整理\\other";
const targetPathForGif = "e:\\整理\\gif";
const targetPathForMedia = "e:\\整理\\media";
const targetPathForPic = "e:\\整理\\pic";

const directoryMax = 2000;
let totalCount = 0;

async function main(rootDirectoryPath) {
    "use strict";
    return OneStep(rootDirectoryPath)
        .catch(err => console.log(err))
}

console.time("time");
main(rootDirectoryPath)
    .then(console.timeEnd("time"))
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

            if (!new RegExp(allType, "i").test(path.extname(filePath))) {
                await otherContainer(filePath, targetPathForOther, file, executeFile)

            } else if (new RegExp("gif", "i").test(path.extname(filePath))) {
                await gifContainer(filePath, targetPathForGif, file, executeFile)

            } else if (new RegExp(mediaType, "i").test(path.extname(filePath))) {
                await mediaContainer(filePath, targetPathForMedia, file, executeFile)

            } else {
                await picContainer(filePath, targetPathForPic, file, executeFile)
            }
        }

    }
}

const otherContainer = orderDir();
const gifContainer = orderDir();

const mediaContainer = orderDir();
const picContainer = orderDir();


// 分组文件夹
function orderDir(dirName = 1, count = 1) {
    return function (filePath, targetPath, file, promiseFun) {
        return Promise.resolve()
            .then(() => {
                if (count > directoryMax) {
                    count = 1;
                    dirName++
                }
                count++;
            })
            .then(() =>
                mkdir(targetPath, String(dirName))
            )
            .catch(err => console.log(`${targetPath}文件夹已经存在了`))
            .then(() => promiseFun(filePath, path.resolve(targetPath, String(dirName), file)))

    };
}

function executeFile(filePath, targetPath) {
    "use strict";
    return open(filePath, targetPath)
        .then(() => cut(filePath, targetPath))
        // .catch(async () =>
        //     cut(filePath, path.resolve(path.dirname(targetPath),
        //         path.basename(filePath,path.extname(filePath)) +　Date.now() + path.extname(filePath))
        //     )
        // )
        .catch(async () =>
            rename(filePath, path.resolve(path.dirname(targetPath),
                await explainMd5(filePath) + path.extname(filePath))
            )
        )

}


// 读取文件
function readdir(targetPath) {
    "use strict";
    return promisify(fs.readdir)(targetPath)
}


// 新建文件夹
function mkdir(targetPath, directoryName) {
    "use strict";
    return promisify(fs.mkdir)(path.resolve(targetPath, directoryName))
        .then(() => console.log(`新建${directoryName}文件夹 成功`))
        .catch(() =>{/*console.log(`${directoryName}文件夹 已经存在`)*/} )

}

// 处理文件 剪切
async function cut(filePath, targetPath) {
    "use strict";

    return promisify(fs.copyFile)
    (filePath, targetPath)
        .then(() => {
            console.log(`已经复制${path.basename(targetPath)}`)
        })
        .catch(err => {
            console.log(`复制${path.basename(targetPath)}失败`);
            console.log(err);
            return Promise.reject(err)
        })
        .then(() =>
            promisify(fs.unlink)
            (filePath)
            .then(() => console.log(`已经删除${path.basename(filePath)}`))
                .then(() => console.log(`处理了${totalCount++}`))
        )

}


// 异步 读取 文件 or 文件夹的状态
const stat = path => promisify(fs.stat)(path)
    .then(stats => stats)
    .catch(err => console.log(err));


// 判断 是文件夹吗
const isDirectory = stat => stat.isDirectory();


// 是不是已经存在 存在就在catch 中执行
const open = path => {
    return promisify(fs.open)(path, "wx")
};

function rename(oldPath, newPath) {
    "use strict";
    return promisify(fs.rename)(oldPath, newPath)
        .then(() => {
            console.log(`${oldPath} => ${newPath}`)
        })
        .then(() => console.log(`处理了${totalCount++}`))
}
