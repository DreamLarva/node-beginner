const fs = require("fs");
const path = require("path");

const rootPath = "F:\\mine\\media";
const data = [];

main(rootPath);
fs.writeFileSync(path.resolve(__dirname,"data.json"),JSON.stringify(data))


function main(rootPath){
    const files = readdirSync(rootPath);
    for(let file of files){
        const filePath = path.resolve(rootPath,file);
         let stat =  statSync(filePath);
         if(stat.isDirectory()){
             main(filePath)
         }else{
             data.push({
                 path:filePath,
                 fileName:path.basename(filePath),
                 size:stat.size,
                 key:(path.basename(filePath).match(/[a-zA-Z][\da-zA-Z]{2,3}-?[\da-zA-Z]{3,4}/g) || []).filter(
                     function(value){
                         return /\d/.test(value)
                     }
                 )
             })

         }
    }
}


function readdirSync (rootPath){
    return fs.readdirSync(rootPath)
}
function statSync(filePath){
    return fs.statSync(filePath)
}
