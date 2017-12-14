const fs = require("fs");
const path = require("path");

const _map = require("./map.json");
const promisify = require("util").promisify;

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
    await cut(outdatedFiles, targetPath, "outdated");

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
            await cut(files, targetPath, dirName);

        }
    }
}




run(_map)
    .catch(error => console.log(error))
    .then(() => console.log("操作完成"));
