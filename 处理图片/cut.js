const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const type = require("./config.json").type;
const explainMd5 = require("./md5");

const rootDirectoryPath = "E:\\test";
const targetDirectoryPath = "E:\\test2";


module.exports = async function main(rootDirectoryPath) {
    "use strict";
    await OneStep("E:\\test")
        .catch(err => console.log(err))

};


// 读取一层文件夹
async function OneStep(rootDirectoryPath) {
    "use strict";
    const files = await readdir(rootDirectoryPath);
    for (let file of files) {
        let fileState = await stat(path.resolve(rootDirectoryPath, file));
        let filePath = path.resolve(rootDirectoryPath, file);
        if (isDirectory(fileState)) {
            await OneStep(filePath)
                .catch(err => console.log(err))
        } else {
            let md5 = await explainMd5(filePath);
            await cut(filePath, path.resolve(targetDirectoryPath, md5 + path.extname(file)))
                .then(() => console.log(`${filePath}=>${md5 + path.extname(file)}`))
        }

    }
}

// 处理文件 剪切
async function cut(filePath, targetPath) {
    "use strict";

    return promisify(fs.copyFile)
    (filePath, targetPath)
        .then(() => {
            console.log(`已经复制${path.basename(targetPath)}`)
        })
        .then(() =>
            promisify(fs.unlink)
            (filePath)
                .then(() => console.log(`已经删除${path.basename(filePath)}`))
        )

}


function rename(oldPath, newPath) {
    "use strict";
    return promisify(fs.rename)(oldPath, newPath)
}

// 读取文件
function readdir(targetPath) {
    "use strict";
    return promisify(fs.readdir)(targetPath)
}


// 异步 读取 文件 or 文件夹的状态
const stat = path => promisify(fs.stat)(path)
    .then(stats => stats)
    .catch(err => console.log(err));


// 判断 是文件夹吗
const isDirectory = stat => stat.isDirectory();


