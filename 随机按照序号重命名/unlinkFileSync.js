const fs = require("fs")
const path = require("path")


let nameArr = fs.readdirSync(path.join(__dirname, "test"))

const absolutePath = path.join(__dirname, "test");


nameArr.forEach(v => {
    fs.unlinkSync(path.join(absolutePath,v))
})
