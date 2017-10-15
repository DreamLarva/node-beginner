const fs = require("fs")
const path = require("path")

console.log(__dirname)
console.log(path.join(__dirname, "test"))

function appendAFileS(i,start) {
    fs.appendFileSync(path.join(__dirname, "test", (Math.random() * 100000).toFixed(5) + ".txt"), Math.random())
    if(i === 0){
        console.log("Sfirst", Date.now() - start)
    }
    if(i === 499){
        console.log("Slast", Date.now() - start)
    }
}

function appendAFileA(i,start) {
    fs.appendFile(path.join(__dirname, "test", (Math.random() * 100000).toFixed(5) + ".txt"), Math.random(), (error) => {
        if(i === 0){
            console.log("Afirst", Date.now() - start)
        }
        if(i === 499){
            console.log("Alast", Date.now() - start)
        }
    })
}

function run1(fun) {
    let start = Date.now()
    for (let i = 0; i < 500; i++) {
        fun(i,start)
    }
    console.log(fun.name," finish",Date.now() - start)
}
function run2(fun) {
    let start = Date.now()
    for (let i = 0; i < 500; i++) {
        fun(i,start)
    }
    console.log(fun.name," finish",Date.now() - start)
    
}

run2(appendAFileS)
run1(appendAFileA)