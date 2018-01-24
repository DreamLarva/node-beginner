const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;

const readdir = promisify(fs.readdir);


const config = require("./config.json");
const explainMd5 = require("./md5");


const fromDir = "";
const toDir = "";
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
        if (/[a-f0-9]{32}/.test(path.basename(filePath))) {
            // 已经是md5
            console.log(`${filePath} => ${path.resolve(targetPath, path.basename(filePath))}`);
            fs.renameSync(filePath, path.resolve(targetPath, path.basename(filePath)))
        } else {
            // 不是md5
            const fileMd5 = await explainMd5(filePath);
            fs.renameSync(filePath, path.resolve(targetPath, fileMd5 + path.extname(filePath)));
        }
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

async function getDirInfo(rootDirName) {
    "use strict";
    const typeDirsArr = await readdir(rootDirName);
    return Promise.all(typeDirsArr
        // todo 过滤 temp 文件夹
            .filter(typeDirName => typeDirName !== "temp")

            // 查询所有类型内容的问题夹
            .map(
                async typeDirName => {

                    const numDirsArr = await readdir(path.resolve(rootDirName, typeDirName));
                    const result = [];

                    //  查询每个类型的文件夹的 数字名命名的子文件夹
                    for (let numDirsName of numDirsArr) {
                        const numDirsNamePath = path.resolve(rootDirName, typeDirName, numDirsName);
                        const filesArr = await readdir(numDirsNamePath);
                        result.push({
                            typeDirName,
                            dirName: numDirsNamePath,
                            length: filesArr.length
                        })
                    }
                    return result
                }
            )
    )
        .then(typeDirsArr => {
            const result = {};

            typeDirsArr.forEach(typeDir => {
                result[typeDir[0].typeDirName] = {availableDir: [], length: typeDir.length};
                typeDir.forEach(numDir => {
                    const typeDirNameInfo = result[numDir.typeDirName];
                    numDir.length < getTargetTypeConfig(numDir.typeDirName) && typeDirNameInfo.availableDir.push(numDir);

                })
            });
            console.log(result);


            return typeDirsArr
            // 过滤一个文件夹下都么的
                .filter(function (v) {
                    return v.length !== 0
                })

                // 过滤已经达到文件上限的文件夹
                .map(v => {

                    const typeDirInfo = getTargetTypeConfig(v[0].typeDirName);
                    return {
                        [v[0].typeDirName]: v.filter(v => v.length !== typeDirInfo.maxFiles)
                    }
                })

                .reduce((pre, cur) => {
                    // 合并数组
                    return Object.assign(pre, cur)
                })

        })
}


async function getDirInfo2(rootDir) {
    const result = {};

    const typeDirsArr = (await readdir(rootDir)).filter(typeDirName => typeDirName !== "temp");

    for (let typeDir  of typeDirsArr) {
        result[typeDir] = {availableDir: [], length: 0};

        const numDirsArr = await readdir(path.resolve(rootDir, typeDir));
        result[typeDir].length = numDirsArr.length;
        for (let numDir of numDirsArr) {
            const dirPath = path.resolve(rootDir, typeDir, numDir);
            const files = await readdir(dirPath);
            const typeConfig = getTargetTypeConfig(typeDir);
            if (files.length < typeConfig.maxFiles) {
                result[typeDir].availableDir.push({
                    dirPath,
                    length: files.length
                })
            }
        }
    }
}


function getTargetTypeConfig(typeName) {
    return config.find(v => v.dirName === typeName);
}


const rootDirectoryPath = "e:\\temp";

getDirInfo(rootDirectoryPath)
    .then(filteredData =>
            console.log(filteredData)
        //startExecute(path.resolve(rootDirectoryPath, "temp"), filteredData)
    );