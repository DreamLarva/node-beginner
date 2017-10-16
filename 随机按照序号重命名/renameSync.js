const fs = require("fs")
const path = require("path")


let nameArr = fs.readdirSync(path.join(__dirname, "test"))

const absolutePath = path.join(__dirname, "test");

let start = Date.now()





nameArr.forEach((v, index) => {
    const filePath = path.join(absolutePath, v);
    const fileState = fs.statSync(path.join(absolutePath, v))
    if (fs.statSync(filePath).isDirectory()) {
        fs.renameSync(filePath, path.join(absolutePath, String(index)))
    } else {
        fs.renameSync(filePath, path.join(absolutePath, index + path.extname(v)))
    }


    // fs.renameSync("./dir 1/" + v.name, "./dir 1/" + index +"."+ v._extension)
})

console.log(Date.now() - start)


nameArr = fs.readdirSync(path.join(__dirname, "test"))

start = Date.now()
nameArr.forEach((v, index,all) => {
    const filePath = path.join(absolutePath, v);
    const fileState = fs.statSync(path.join(absolutePath, v))
    if (fs.statSync(filePath).isDirectory()) {
        fs.rename(filePath, path.join(absolutePath, "_"+String(index)),error=>{})
    } else {
        fs.rename(filePath, path.join(absolutePath, "_"+index + path.extname(v)),error=>{
            if(index === all.length - 1){
                console.log(Date.now() - start)
            }

        })
    } 
})