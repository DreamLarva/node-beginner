const fs = require("fs")
const path = require("path")


/**
 * @param {string} entireFileName 完整的文件名
 */
function explainFileName(entireFileName) {
    let name = "";
    let extension = ""
    if (entireFileName.includes(".")) {
        if (entireFileName.startsWith(".")) {
            // 只有拓展名
            extension = entireFileName;
        } else {
            // 有文件名也有拓展名
            const temp = /^(.+)(\..+)$/.exec(entireFileName)
            name = temp[1]
            extension = temp[2]
        }

    } else {
        // 只有文件名
        name = entireFileName
    }

    return {
        name,
        extension
    }
}
const nameArr = fs.readdirSync(path.join(__dirname, "test"))

const absolutePath = path.join(__dirname, "test");


nameArr.forEach((v, index) => {
    const filePath = path.join(absolutePath, v);
    const fileState = fs.statSync(path.join(absolutePath, v))
    if (fs.statSync(filePath).isDirectory()) {
        fs.renameSync(filePath, path.join(absolutePath, String(index)))
    } else {
        fs.renameSync(filePath, path.join(absolutePath, index + explainFileName(v).extension))
    }


    // fs.renameSync("./dir 1/" + v.name, "./dir 1/" + index +"."+ v._extension)
})