const mongoose = require('mongoose');
const promisify = require('util').promisify;

const db = mongoose.connect('mongodb://localhost:27017/myFirstDB', {useMongoClient: true});
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

// 注册 Schema
const Tasks = new Schema({
    project: String,
    description: String
});
mongoose.model("Task", Tasks);

// 添加任务
const Task = mongoose.model('Task');
const task = new Task();
task.project = "小黑";
task.description = "黑暗游侠";



// const TaskSave = promisify(task.save).bind(task);
// TaskSave()
//     .then(console.log.bind(console))
//     .catch(console.log.bind(console));

// task.save(function (err, task) {
//     "use strict";
//     if (err) throw err;
//     console.log('Task saved');
//     console.log(task)
// });
//
// // 搜索文档
// Task.find({project: "小黑"}, function (err, tasks) {
//     "use strict";
//     if (err) throw err;
//     console.log(tasks)
//
// });

// 更新文档
// Task.update(
//     {_id:"5a1e61320f0a5e574cf95b21"},
//     {project:"呵呵呵",description:"哈哈哈"},
//     {multi:false},
//     function(err,rows_updated){
//         "use strict";
//         if(err)throw err;
//         console.log('Updated');
//         console.log(rows_updated)
//     }
// );

// 删除文档
// Task.findById(
//     '5a1e61320f0a5e574cf95b21',
//     function(err,task){
//         "use strict";
//         console.log(task);
//         task.remove()
//     }
//
// );



