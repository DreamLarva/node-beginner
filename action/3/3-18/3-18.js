const fs = require('fs');
let completedTasks = 0;
let tasks = [];
const wordCounts = {};
const filesDir = './test';

function checkIfComplete() {
    "use strict";
    completedTasks++;
    if (completedTasks === tasks.length) {
        Object.keys(wordCounts).forEach(v => {
            console.log(v + " : " + wordCounts[v])
        })

    }
}

function countWordsInText(text) {
    let words = text.toString()
        .toLowerCase()
        .split(/\\[rnt]|\W+/)
        .sort();
    words.forEach(word => {
        "use strict";
        if (word) {
            wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
        }
    })
}


fs.readdir(filesDir, function (err, files) {
    "use strict";
    if (err) throw  err;
    Object.keys(files).forEach(index => {
       const task = (function(file){
            return function(){
                fs.readFile(file, 'utf8',function(err,text){
                    if(err)throw err;
                    countWordsInText(text);
                    checkIfComplete();
                })
            }
       }(filesDir + '/' + files[index]));
        tasks.push(task)
    });
    Object.keys(tasks).forEach(task => {
        tasks[task]();
    })
});