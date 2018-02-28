const
    fs = require("fs"),
    path = require("path"),
    promisify = require("util").promisify,
    file = require("file");

const
    config = require("./config.json"),
    explainMd5 = require("./md5"),
    move = require('./move');


const storeRootDirectoryPath = "d:\\test\\test2";
const fromRootDirectoryPath = "d:\\test\\test1";

function main(fromRootDirectoryPath, storeRootDirectoryPath) {
    initConfig(config);
    initDir(storeRootDirectoryPath);
    const dataArray = explainStoreFiles(storeRootDirectoryPath);
    filterDir(dataArray);
    walk(fromRootDirectoryPath, storeRootDirectoryPath, dataArray)

}

main(fromRootDirectoryPath, storeRootDirectoryPath);

// 初始化config
function initConfig(config) {
    // 拼接 other 所要使用的正则
    config.find(v => v.dirName === "other").RegExp =
        "^(?!.*(" +
        config
            .filter(v => v.dirName !== "other")
            .reduce((pre, cur) => {

                return (typeof pre === 'string' ?
                    pre : pre.RegExp)
                    + "|" + cur.RegExp
            }) +
        ")+.*$).*";
}

// 初始化文件夹
function initDir(storeRootDirectoryPath) {
    // 确定每个config 中每个 dirName 都有文件夹
    const storeRootDirectory = fs.readdirSync(storeRootDirectoryPath);
    for (let dirName of config.map(v => v.dirName)) {
        if (!storeRootDirectory.includes(dirName)) {
            // 如果还没有文件夹 就新建
            fs.mkdirSync(path.resolve(storeRootDirectoryPath, dirName));
            console.log(`新建文件夹${dirName}`)
        }
    }
}

// 读取已经存储好的文件
function explainStoreFiles(storeRootDirectoryPath) {
    return fs.readdirSync(storeRootDirectoryPath)
        .map(function (typeDirName) {
            const typeDirPath = path.resolve(storeRootDirectoryPath, typeDirName);
            return {
                dirName: typeDirName,
                data: explainTypeFiles(typeDirPath)
            }
        })
        // 合成一个对象
        .reduce(function (pre, cur) {
            return Object.assign(pre, {[cur.dirName]: cur.data})
        }, {})

}

// 读取 类型中的文件
function explainTypeFiles(typeDirPath) {
    return fs.readdirSync(typeDirPath)
        .map(function (numDirName) {
            const numDirPath = path.resolve(typeDirPath, numDirName);
            return {
                dirPath: numDirPath,
                length: fs.readdirSync(numDirPath).length
            }
        })
}

// 过滤已经满了的文件夹 数据
function filterDir(dataArray) {
    for (let type of Object.keys(dataArray)) {
        let data = dataArray[type];
        dataArray[type] = data.filter(function (data) {
            const maxFiles = getConfig(type).maxFiles;
            if (maxFiles < data.length) throw Error(`${type} 文类型件的数量 ${data.length}超过了配置的 ${maxFiles}`);
            return maxFiles !== data.length
        });
    }
}

// 读取需要归类的文件
function walk(fromRootDirectoryPath, storeRootDirectoryPath, dataArray) {
    file.walkSync(fromRootDirectoryPath, function (dirPath, dirs, files) {
        for (let fileName of files) {
            const fileDirPath = getRemovePath(fileName, dataArray)
        }
    })
}

function getRemovePath(fileName, dataArray) {
    // 获取类型
    const typeConfig = explainType(fileName);
    if (dataArray[typeConfig.dirName].length) {
        dataArray[typeConfig.dirName][0].length++;
        return dataArray[typeConfig.dirName]
    }

    // 有可以使用的文件夹

    // 一个文件夹都没有

    // 有文件夹但是 都满了

}

// 获取对应的配置
function getConfig(type) {
    return config.find(function (value) {
        return value.dirName === type
    })
}

// 判断拓展名的是落在那个类型
function explainType(fileName) {
    return config.find(function (value) {
        const reg = new RegExp(value.RegExp);
        return reg.test(path.extname(fileName));
    })
}
