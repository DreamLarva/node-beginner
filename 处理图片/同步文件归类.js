const
    fs = require("fs"),
    path = require("path"),
    promisify = require("util").promisify,
    file = require("file");

const
    config = require("./config.json"),
    explainMd5 = promisify(require("./md5")),
    moveSync = require('./move').moveSync,
    AltFolders = require("./module/AltFolders");


const storeRootDirectoryPath = "d:\\test\\test2";
const fromRootDirectoryPath = "d:\\test\\test1";

function main(fromRootDirectoryPath, storeRootDirectoryPath) {
    initConfig(config);
    initDir(storeRootDirectoryPath);
    const dataObj = explainStoreFiles(storeRootDirectoryPath);
    walk(fromRootDirectoryPath, dataObj)

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
                data: new AltFolders(typeDirPath, getConfig(typeDirName))
            }
        })
        // 合成一个对象
        .reduce(function (pre, cur) {
            return Object.assign(pre, {[cur.dirName]: cur.data})
        }, {})

}


// 读取需要归类的文件
function walk(fromRootDirectoryPath, dataObj) {
    file.walkSync(fromRootDirectoryPath, async function (dirPath, dirs, files) {
        for (let fileName of files) {
            const
                typeConfig = explainType(fileName),
                type = typeConfig.dirName;

            await dataObj[type].move(async function (Folder, finish) {
                const
                    fileExtname = path.extname(fileName);
                if (typeConfig.toMd5) {
                    await explainMd5(path.resolve(dirPath, fileName))
                        .then(hash => {
                            const newfileName = hash + fileExtname;
                            moveSync(
                                path.resolve(dirPath, fileName),
                                path.resolve(Folder.path, newfileName)
                            );
                            finish()
                        })
                } else {
                    moveSync(
                        path.resolve(dirPath, fileName),
                        path.resolve(Folder.path, fileName)
                    );
                    finish()
                }


            })
        }
    })
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
