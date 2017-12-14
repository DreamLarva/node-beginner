const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;


const config = require("./config.json");
const explainMd5 = require("./md5");


const rootDirectoryPath = "G:\\mine";
let totalCount = 0;


// 分组文件夹
async function orderDir(filePath, targetPath, allDirInfo, dirInfo, configItem) {
    // console.log(filePath, targetPath, existDirInfo);
    // console.log(dirInfo);
    // console.log(allDirInfo);
    if (dirInfo && dirInfo.length !== 0) {
        await rename(filePath, dirInfo[0].dirName);
        if (dirInfo.length !== 0) {
            dirInfo[0].length++;
            if (dirInfo[0].length === configItem.maxFiles) dirInfo.shift()
        }
    } else {
        // todo 没有可选的文件夹
        // 新建文件夹
        const dirs = fs.readdirSync(targetPath);
        let existMaxDir;
        if (dirs.length === 0) {
            existMaxDir = 0
        } else {
            existMaxDir = Math.max(...dirs.map(v => Number(v)));
        }
        try {

            fs.mkdirSync(path.resolve(targetPath, String(existMaxDir + 1)));
        } catch (err) {
            console.log(`${path.resolve(targetPath, existMaxDir + 1)}文件夹已经存在了`)
        }
        // rename 文件
        await rename(filePath, path.resolve(targetPath, String(existMaxDir + 1)));
        // 添加可选的 文件夹
        allDirInfo[configItem.dirName] = [{
            dirName: path.resolve(targetPath, String(existMaxDir + 1)), length: 1
        }]


    }

    async function rename(filePath, targetPath) {
        "use strict";
        // todo 不在重命名

        console.log(`${filePath} => ${path.resolve(targetPath, path.basename(filePath))}`);
        fs.renameSync(filePath, path.resolve(targetPath, path.basename(filePath)))

    }

    // if (dirName === 1 && count === 1) {
    //     try {
    //         fs.mkdirSync(path.resolve(targetPath, String(dirName)));
    //     } catch (err) {
    //         console.log(`${path.resolve(targetPath, String(dirName))}文件夹已经存在了`)
    //     }
    // }
    // if (count > directoryMax) {
    //     count = 1;
    //     dirName++;
    //     try {
    //         fs.mkdirSync(path.resolve(targetPath, String(dirName)));
    //     } catch (err) {
    //         console.log(`${path.resolve(targetPath, String(dirName))}文件夹已经存在了`)
    //     }
    // }
    // count++;
    // const fileMd5 = await explainMd5(filePath);
    // fs.renameSync(filePath, path.resolve(targetPath, String(dirName), fileMd5 + path.extname(file)));
    //
    // console.log(++totalCount, filePath => path.resolve(targetPath, String(dirName), fileMd5 + path.extname(file)))
}

async function startExecute(rootDirectoryPath, existDirInfo) {
    "use strict";
    // 读取文件夹
    const files = fs.readdirSync(path.resolve(rootDirectoryPath));
    for (let file of files) {
        // 处理文件地址
        let fileState = fs.statSync(path.resolve(rootDirectoryPath, file));
        let filePath = path.resolve(rootDirectoryPath, file);

        if (fileState.isDirectory()) {
            // 是文件夹 就递归
            await startExecute(filePath, existDirInfo)
        } else {
            // 循环config文件 判断文件的格式 分拣
            for (let item of config) {
                if (new RegExp(item.RegExp, "i").test(path.extname(filePath))) {
                    let targetPath = rootDirectoryPath.replace(/temp.*$/, "");
                    targetPath = path.resolve(targetPath, item.dirName);
                    // console.log(filePath, targetPath)
                    await orderDir(filePath, targetPath, existDirInfo, existDirInfo[item.dirName], item)
                }
            }
        }
    }
}

async function getDirInfo(rootDirectoryPath) {
    "use strict";
    const files = await promisify(fs.readdir)(rootDirectoryPath);
    return Promise.all(files
        .filter(v => v !== "temp")
        .map(async dirName => {
            const files = await promisify(fs.readdir)(path.resolve(rootDirectoryPath, dirName));
            const result = [];
            for (let file of files) {
                const dirPath = path.resolve(rootDirectoryPath, dirName, file);
                const innerFile = await promisify(fs.readdir)(dirPath);
                result.push({
                    dirName: dirPath,
                    length: innerFile.length
                })
            }
            return result
        }))
        .then(data => {
            // console.log(data);
            return data
                .filter(function (v) {
                    return v.length !== 0
                })
                .map(v => {
                    const dirName = path.basename(path.join(v[0].dirName, ".."));
                    const maxFiles = config.find(v => v.dirName === dirName).maxFiles;
                    return {
                        [dirName]: v.filter(v => v.length !== maxFiles)
                    }
                })
                .reduce((pre, cur) => {
                    return Object.assign(pre, cur)
                })


        })
}


getDirInfo(rootDirectoryPath)
    .then(filteredData =>
        startExecute(path.resolve(rootDirectoryPath, "temp"), filteredData)
    );