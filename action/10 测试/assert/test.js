const assert = require('assert');
const Todo = require('./todo');
const todo = new Todo();


let testsCompleted = 0;

function deleteTest() {
    todo.add('Delete Me');
    assert.equal(todo.getCount(), 1, '1 item should exist');
    todo.deleteAll();
    assert.equal(todo.getCount(), 0, 'No item should exist');
    testsCompleted++;
}

function addTest() {
    todo.deleteAll();
    todo.add('Add');
    assert.notEqual(todo.getCount(), 0, '1 item should exist');
    testsCompleted++
}

function doAsyncTest(cb) {
    todo.doAsync(function (value) {
        assert.ok(value, 'Callback should be passed true');
        testsCompleted++;
        cb();
    })
}

function throwsTest(cb) {
    assert.throws(todo.add, /requires/);
    testsCompleted++;
}


deleteTest();
addTest();
throwsTest();
doAsyncTest(function(){
    console.log('Completed ' + testsCompleted + ' tests');
});
