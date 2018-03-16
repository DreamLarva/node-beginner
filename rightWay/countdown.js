/**
 * Created by Agent47 on 2018/3/6
 * */
"use strict";
const countdown = function* (count) {
        while (count > 0) {
            yield count;
            count -= 1;
        }
    },
    counter = countdown(5),
    callback = function () {
        let item = counter.next();
        if (!item.done) {
            console.log(item.value);
            setTimeout(callback, 1000)
        }
    };

callback();