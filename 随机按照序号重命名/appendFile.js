const fs = require("fs")
const path = require("path")

console.log(__dirname)
console.log(path.join(__dirname, "test"))

function appendAFileS() {
    fs.appendFileSync(path.join(__dirname, "test", (Math.random() * 100000).toFixed(5) + ".txt"), Math.random())
}

function appendAFileA() {
    fs.appendFile(path.join(__dirname, "test", (Math.random() * 100000).toFixed(5) + ".txt"), Math.random(), (error) => {})
}

function run(fun) {
    let start = Date.now()
    for (let i = 0; i < 500; i++) {
        fun()
    }
    console.log(Date.now() - start)
}

run(appendAFileS)
run(appendAFileA)