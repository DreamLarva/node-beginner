const fs = require("fs")
const path = require("path")




function main(){
    let nameArr = fs.readdirSync(path.join(__dirname, "test"))
    
    const absolutePath = path.join(__dirname, "test");

    console.time("renameSync")
    nameArr.forEach((v, index) => {
        const filePath = path.join(absolutePath, v);
        const fileState = fs.statSync(path.join(absolutePath, v))
        if (fs.statSync(filePath).isDirectory()) {
            fs.renameSync(filePath, path.join(absolutePath, String(index)))
        } else {
            fs.renameSync(filePath, path.join(absolutePath, "_"+index + path.extname(v)))
        }
    })
    console.timeEnd("renameSync")
}


module.exports = main;



