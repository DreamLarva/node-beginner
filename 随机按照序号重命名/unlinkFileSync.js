const fs = require("fs")
const path = require("path")


let nameArr = fs.readdirSync(path.join(__dirname, "test"))

const test_Directory = path.join(__dirname, "test");


nameArr.forEach(v => {
    fs.unlinkSync(path.join(test_Directory,v))
})
