const fs = require("fs")
const path = require("path")




function rename(absolutePath, v, index) {
    const filePath = path.join(absolutePath, v);
    const fileState = fs.statSync(path.join(absolutePath, v))
    if (fs.statSync(filePath).isDirectory()) {
        return new Promise((resolve, reject) =>
            fs.rename(filePath, path.join(absolutePath, String(index)), error => {
                if (error) reject(error);
                resolve()
            }))
    } else {
        return new Promise((resolve, reject) =>        
        fs.rename(filePath, path.join(absolutePath, index + path.extname(v)), error => {
            if (error) reject(error);
            resolve()
        }))
    }
}

function main() {
    console.time("rename")

    const absolutePath = path.join(__dirname, "test");

    return new Promise((resolve,reject)=>{
        fs.readdir(path.join(__dirname, "test"),(error,files)=>{
            if(error)reject(error);
            resolve(files)
        })
    }).then( files =>
        Promise.all(
            files.map((v,index)=> rename(absolutePath,v,index) )
        ).then(data =>{
            console.timeEnd("rename")
        })
    )
    





}


module.exports = main