const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const type = require("./type.json").type;

const rootDirectoryPath = "E:\\test";
// const rootDirectoryPath = "D:\\download\\t";
const targetPathForOther = "d:\\test\\other";
const targetPathForGif = "D:\\test\\gif";


async function main(rootDirectoryPath) {
    "use strict";
    await OneStep(rootDirectoryPath)
        .catch(err => console.log(err))
}

main(rootDirectoryPath)
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
            if (!new RegExp(type, "i").test(path.extname(filePath))) {
                let timestamp = "";
                try {
                    await open(filePath)
                } catch (error) {
                    console.log(error);
                    timestamp = Date.now()
                }
                cut(filePath, path.resolve(targetPathForOther, path.basename(file) + timestamp + path.extname(file)));

            } else if (new RegExp("gif", "i").test(path.extname(filePath))) {
                // cut(filePath,path.resolve(targetPathForGif, file));

            }
        }

    }
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
        .catch(() => console.log(`${directoryName}文件夹 已经存在`))

}

// 处理文件 剪切
function cut(filePath, targetPath) {
    "use strict";
    return promisify(fs.copyFile)
    (filePath, targetPath)
        .then(() => console.log(`已经复制${path.basename(targetPath)}`))
        .catch(err => {
            console.log(`复制${path.basename(targetPath)}失败`);
            console.log(err);
        })
        .then(() =>
            promisify(fs.unlink)
            (filePath)
                .then(() => console.log(`已经删除${path.basename(filePath)}`))
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