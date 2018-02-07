/**
 * Created by Agent47 on 2018/1/26
 * */
"use strict";


const asyncCtrl =
    //  限制队列的长度  当前队列的长度      等待的队列
    (queueLimit, currentQueueLength = 0, waitQueue = []) =>
        (fun) =>
            (...args) => {

                const originCallback = args.pop();
                const callback = function (...args) {

                    // 执行原回调
                    originCallback(...args);

                    if (waitQueue.length) {
                        waitQueue.shift()()

                    } else {
                        currentQueueLength--;
                    }

                };

                if (currentQueueLength === queueLimit) {
                    waitQueue.push(() => fun.call(null, ...args, callback));
                    console.log("等待队列长度" + waitQueue.length)

                } else {
                    currentQueueLength++;
                    fun(...args, callback);
                }
            };


module.exports = asyncCtrl;
