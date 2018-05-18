const fs = require("fs")
const path = require("path")




module.exports = () => {
    console.time("unlink")
    const test_Directory = path.join(__dirname, "test");
    new Promise((resolve,reject)=>{
        fs.readdir(path.join(__dirname, "test"),(error,files)=>{
            if(error)reject(error);
            resolve(files)
        })
    }).then( files =>{
        Promise.all(
            files.map((v,index)=> unlink(test_Directory,v) )
        ).then(data =>{
            console.timeEnd("rename")
        })
    })
    
}