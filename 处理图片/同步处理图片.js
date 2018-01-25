const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const move = require('./move');


const config = require("./config.json");
const explainMd5 = require("./md5");


const storeRootDirectoryPath = "e:\\temp";
const fromRootDirectoryPath = "d:\\temp";
let totalCount = 0;


// 分组文件夹
async function orderDir(filePath, dirInfo,type) {
    const availableDirsArr = dirInfo.availableDir;
    if (availableDirsArr.length) {
        // 有待用的文件夹
        // 移动文件
        const newFilePath  = await getNewFilePath(filePath, availableDirsArr[0],type);
        try{
            await move(filePath,newFilePath);
        }catch(err){
            console.log(err)
        }
        // 后续任务
        availableDirsArr[0].length++;
        if (availableDirsArr[0].length === availableDirsArr[0].maxFiles) availableDirsArr.shift()

    } else {
        // 没有可选的文件夹
        // 生成一个新的文件夹
        const dirPath = path.resolve(dirInfo.path, String(++dirInfo.length));
        const typeConfig = getTargetTypeConfig(type);
        fs.mkdirSync(dirPath);
        dirInfo.availableDir.push({
            ...typeConfig,
            dirPath,
            length: 0,
            maxFiles: typeConfig.maxFiles
        });
        await orderDir(filePath, dirInfo,type)
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

async function getNewFilePath(filePath, targetDir,type) {
    "use strict";
    const typeConfig = getTargetTypeConfig(type);
    const targetDirPath = targetDir.dirPath;
    const fileBasename = path.basename(filePath);
    if(!typeConfig.toMd5){

        return path.resolve(targetDirPath,fileBasename)
    }else{

        if (/[a-f0-9]{32}/.test(path.basename(filePath))) {
            // 已经是md5
            return path.resolve(targetDirPath,fileBasename)
        } else {
            // 不是md5
            const fileMd5 = await explainMd5(filePath);
            return  path.resolve(targetDirPath, fileMd5 + path.extname(filePath))
        }
    }

}


// 分拣
async function partition(filePath, existDirInfo) {
    "use strict";
    // 循环config文件 判断文件的格式 分拣
    for (let item of config) {
        if (new RegExp(item.RegExp, "i").test(path.extname(filePath))) {
            await orderDir(filePath, existDirInfo[item.dirName],item.dirName)
        }
    }

}

// 递归读取文件夹
async function recursionFolder(fromRootDirectoryPath, existDirInfo, callback) {
    const files = fs.readdirSync(fromRootDirectoryPath);
    for (let file of files) {
        // 处理文件地址
        let fileState = fs.statSync(path.resolve(fromRootDirectoryPath, file));
        let filePath = path.resolve(fromRootDirectoryPath, file);

        if (fileState.isDirectory()) {
            // 是文件夹 就递归
            await recursionFolder(filePath, existDirInfo, callback)

        } else {
            // 文件就处理
            await callback(filePath, existDirInfo)
        }
    }
}

// 初始化 获取存储目录的相关信息
function getDirInfo(storeRootDirectoryPath) {
    const result = {};

    const typeDirsArr = fs.readdirSync(storeRootDirectoryPath);

    // 类型文件夹
    for (let typeDir  of typeDirsArr) {
        result[typeDir] = {
            availableDir: [],
            length: 0,
            path: path.resolve(storeRootDirectoryPath,typeDir)
        };

        // 数字文件夹
        const numDirsArr = fs.readdirSync(path.resolve(storeRootDirectoryPath, typeDir));
        result[typeDir].length = numDirsArr.length;
        for (let numDir of numDirsArr) {
            // 读取每个数字文件夹的所有内容
            const dirPath = path.resolve(storeRootDirectoryPath, typeDir, numDir);
            const files = fs.readdirSync(dirPath);
            const typeConfig = getTargetTypeConfig(typeDir);

            // 过滤已经达到上限的文件夹
            if (files.length < typeConfig.maxFiles) {
                result[typeDir].availableDir.push({
                    ...typeConfig,
                    dirPath,
                    length: files.length,
                    maxFiles: typeConfig.maxFiles
                })
            }
        }
    }
    return result
}

// 初始化config
function initConfig(config) {
    const RegExp = "^(?!.*(" + config
        .filter(v => v.dirName !== "other")
        .reduce((pre, cur) => {

            return (typeof pre === 'string' ?
                pre  :  pre.RegExp)
                + "|" + cur.RegExp
        }) + ")+.*$).*";
    config.find(v => v.dirName === "other").RegExp = RegExp
}

// 获取对应配置的相关信息
function getTargetTypeConfig(typeName) {
    return config.find(v => v.dirName === typeName);
}

// 如果没有相关的文件夹 就都创建好
function initDir(storeRootDirectoryPath) {
    const typeDirsArr = fs.readdirSync(storeRootDirectoryPath);
    config
        .map(v => v.dirName)
        .forEach(function (type) {
            if (!typeDirsArr.some(typeDir => typeDir === type)) {
                // 如果没有type文件夹 创建type的文件夹
                fs.mkdirSync(path.resolve(storeRootDirectoryPath, type));
                fs.mkdirSync(path.resolve(storeRootDirectoryPath, type, "1"));
            }
        })
}

function main() {
    initConfig(config);
    console.log(config)
    initDir(storeRootDirectoryPath);
    const filteredData = getDirInfo(storeRootDirectoryPath);
    recursionFolder(fromRootDirectoryPath, filteredData, partition)
        .then(() => console.log("操作完毕"))

}

main();
