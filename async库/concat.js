/**
 * Created by Agent47 on 2018/3/5
 * */
"use strict";
const test = require('./test');
const async = require('async');
const promisify = require('util').promisify;

/**
 * concat(coll, iteratee, callback(err)opt)
 *
 * 并行执行 注入了 coll(可迭代的对象) 的iteratee 方法
 * 与async.map 的却别在于 最后的方法会 使用concat连接 而不是直接返回
 * 相当于 Promise.all 但是 代码量少
 *
 * Name    Type    Description
 * coll    Array | Iterable | Object
 * A collection to iterate over.
 *
 * iteratee    AsyncFunction
 * A function to apply to each item in coll, which should use an array as its result. Invoked with (item, callback).
 *
 * callback(err)    function <optional>
 * A callback which is called after all the iteratee functions have finished, or an error occurs. Results is an array containing the concatenated results of the iteratee function. Invoked with (err, results).
 * concat(coll, iteratee, callback(err)opt)
 *
 * */

/*{
    async.concat(['first', 'second', 'third'], test.asyFun, function (error, data) {
        console.log(data)
    });

    // 可以直接使用promise
    const concatP = promisify(async.concat);
    console.time("t");
    concatP(['first', 'second', 'third'], test.asyFun)
        .then(() =>
            console.timeEnd("t")
        );

}*/


/**
 * concatLimit(coll, limit, iteratee, callbackopt)
 * limit 限制同时并行的数量
 * */
/*{
    async.concatLimit([1,2,3,4,5,6,7,8,9,10],2, test.fun, function (error, data) {
        console.log(data)
    });

}*/

/**
 * concatSeries(coll, iteratee, callback(err)opt)
 * 相当于 concatLimit(coll, 1, iteratee, callbackopt)
 * */
// {
//     async.concatSeries([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], test.fun, function (error, data) {
//         console.log(data)
//     });
// }


//对数组中的元素进行迭代操作，形成一个新数组
// async.concat([1,2,3,4,5], function(item, callback){
//
//     callback(null, [item]);
//
// }, function(err, results){
//
//     console.log("concat:"+results);//
//
// });


async.transform([1,2,3], [999],function(acc, item, index, callback) {
    console.log(acc)
    // pointless async:
    process.nextTick(function() {
        acc.push(item * 2)
        callback(null)
    });
}, function(err, result) {
    console.log(result)
    // result is now equal to [2, 4, 6]
});
