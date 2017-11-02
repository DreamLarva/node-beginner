const fs = require("fs");
const path = require("path");

const _map = require("./map.json");

const targetPath = "E:\\test";

async function run(map) {
    // 读取所有的文件
    const AllFiles = await readdir(targetPath);
    // 处理过时的文档
    const outdatedFiles = AllFiles.filter(v => {
        "use strict";
        const result = v.match(/20\d{2}/g);
        return result && result.length !== 0 && result.every(v => Number(v) <= 2013)
    });
    console.log(outdatedFiles);
    // 新建文件夹
    await mkdir(targetPath, "outdated");
    await cut(outdatedFiles, targetPath,"outdated");

    for (let i = 0, len = map.length; i < len; i++) {
        let {dirName, reg} = map[i];

        // 读取文件夹 由于上一批文件已经操作完成 所以同一个文件不可能被读两次
        let files = await readdir(targetPath);

        // 筛选符合要求的文件
        files = files.filter(v =>
            path.extname(v) === ".pdf" &&
            new RegExp(reg, "i").test(path.basename(v))
        );
        console.log(files);

        if (files.length) {
            // 新建文件夹
            await mkdir(targetPath, dirName);

            // 复制文件
            await cut(files, targetPath,dirName);

        }
    }
}

// 读取文件
async function readdir(targetPath) {
    "use strict";
    return await new Promise((resolve, reject) => {
        fs.readdir(targetPath, function (error, files) {
            if (error) reject(error);
            resolve(files)
        })
    });
}

// 新建文件夹
async function mkdir(targetPath, directoryName) {
    "use strict";
    return new Promise((resolve, reject) => {
        fs.mkdir(path.resolve(targetPath, directoryName), function (err) {
            // 文件夹已经存在
            if (err) {
                console.log(`${"outdated"}文件夹 已经存在`)
            } else {
                // 新建文件夹
                console.log(`新建${"outdated"}文件夹 成功`);
            }
            resolve()
        })
    });
}

// 处理文件 剪切
async function cut(files, targetPath,dirName) {
    "use strict";
    return Promise.all(files.map(v => {
        return new Promise((resolve, reject) => {
            "use strict";
            fs.copyFile(
                path.resolve(targetPath, v),
                path.resolve(targetPath, dirName, v),
                function (err) {
                    if (err) reject(err);
                    console.log(`已经复制${v}`);
                    fs.unlink(path.resolve(targetPath, v), function (err) {
                        if (err) reject(err);
                        console.log(`已经删除${v}`);
                        resolve()
                    })
                }
            )
        });
    }));
}


run(_map)
    .catch(error => console.log(error))
    .then(() => console.log("操作完成"));
