const data = require("./data");
const fs = require("fs");
const path = require("path");

const keys = {};
for(let item of data){
    item.key.forEach(function(value){
        let key  = value.replace(/-/,"").toLowerCase();
        !keys[key] &&  (keys[key] = []);
       keys[key].push(item.path)
    })
}
console.log(Object.entries(keys).filter(v=>v[1].length>1));
fs.writeFileSync(path.resolve(__dirname,"result.json"),JSON.stringify(Object.entries(keys).filter(v=>v[1].length>1)));