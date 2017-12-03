const data = require("./data")

const keys = new Set();
for(let item of data){
    item.key.forEach(function(value){
        keys.add(value.replace(/-/,""))
    })
}
console.log(keys.size);
