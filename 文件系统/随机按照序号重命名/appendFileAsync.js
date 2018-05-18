const fs = require("fs")
const path = require("path")

function appendAFileA() {
    return new Promise((resolve, reject) =>
        fs.appendFile(path.join(__dirname, "test", (Math.random() * 100000).toFixed(5) + ".txt"), Math.random(), (error) => {
            if (error) reject(error);
            resolve()
        }))
}




module.exports = () => {
    console.time("appendFile")
    Promise.all(new Array(500).fill(1).map(() => appendAFileA()))
        .then(data => {
            console.timeEnd("appendFile")
        })
}

