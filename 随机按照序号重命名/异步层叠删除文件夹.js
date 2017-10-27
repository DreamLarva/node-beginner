const fs = require("fs");
const path = require("path")


// 文件夹的名字
const dirname = "test";

// 异步读取文件夹 内容
const readdir = (path) => new Promise((resolve, reject) => {
    fs.readdir(path, (error, files) => {
        if (error) reject(error);
        resolve(files)
    })
});

// 异步删除文件
const unlink = (path) => new Promise((resolve, reject) => {
    fs.unlink(path, (error, files) => {
        if (error) reject(error);
        resolve(files)
    })
});

// 异步删除文件夹
const rmdir = (path) => new Promise((resolve, reject) => {
    fs.rmdir(path, (error) => {
        if (error) reject(error);
        console.log("删除文件夹 " + path + " 成功")
        resolve()
    })
});

// 异步 读取 文件 or 文件夹的状态
const stat = (path) => new Promise((resolve, reject) => {
    fs.stat(path, (error, stats) => {
        if (error) reject(error);
        console.log("删除文件 " + path + " 文件成功")
        resolve(stats)
    })
});
// 判断 是文件夹吗
const isDirectory = stat => stat.isDirectory();


const deleteDirectory = (_path) => {
    // 存储 文件夹的名字
    return readdir(_path)
        .then(files => {
            let PromiseArr = files.map((v, i) => {

                let __path = path.join(_path, v)
                // console.log(__path)
                return stat(__path).then(states => {
                    // console.log(__path, states.isDirectory(), states.isFile())
                    if (states.isDirectory()) {
                        // 递归 
                        return deleteDirectory(__path)
                    } else {
                        // 异步 删除是文件的内容
                        return unlink(__path)
                    }
                })


            })
            return Promise.all(PromiseArr).then(() => rmdir(_path))
        }).catch(error => console.log(error))
}


console.time("delete")
deleteDirectory(path.join(__dirname, "test"))
    .then(() => console.timeEnd("delete"))