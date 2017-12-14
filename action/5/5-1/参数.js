const fs = require("fs");
const path = require('path');

const args = process.argv.slice(2);
const command = args.shift();
const taskDescription = args.join(' ');
const file = path.join(process.cwd(), '/tasks');

switch (command) {
    case 'list':
        listTask(file);
        break;
    case 'add':
        addTask(file, taskDescription);
        break;
    default:
        console.log('Usage: ' + process.argv[0] +
            ' list|add [taskDescription]'
        )

}

function loadOrInitializeTaskArray(file, cb) {
    "use strict";
    fs.open(file, 'r', function (error, fd) {
        if (error) {
            cb([]);
            return
        }
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) throw err;
            data = data.toString();
            const tasks = JSON.parse(data || '[]');
            cb(tasks)
        })
    })
}

function listTask(file) {
    "use strict";
    loadOrInitializeTaskArray(file, function (tasks) {
        for (let i in tasks) {
            console.log(tasks[i])
        }
    })
}

function storeTask(file, tasks) {
    "use strict";
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved');
    })
}

function addTask() {
    "use strict";
    loadOrInitializeTaskArray(file, function (tasks) {
        tasks.push(taskDescription);
        storeTask(file, tasks);
    })
}