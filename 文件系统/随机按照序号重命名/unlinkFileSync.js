const fs = require("fs")
const path = require("path")




module.exports = () => {

    let nameArr = fs.readdirSync(path.join(__dirname, "test"))
    const test_Directory = path.join(__dirname, "test");
    console.time("tunlinkSyncest")
    nameArr.forEach(v => {
        fs.unlinkSync(path.join(test_Directory, v))
    })
    console.timeEnd("unlinkSync")
    
}