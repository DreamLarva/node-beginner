const fs = require("fs")
const path = require("path")

console.log(__dirname)
console.log(path.join(__dirname, "test"))

function appendAFileS() {
    fs.appendFileSync(path.join(__dirname, "test", (Math.random() * 100000).toFixed(5) + ".txt"), Math.random())
}


function run(fun) {
    console.time("appendFileSync")
    for (let i = 0; i < 500; i++) {
        fun()
    }
    console.timeEnd("appendFileSync")
}

// run(appendAFileS)s
module.exports = run


