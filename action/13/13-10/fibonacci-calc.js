/**
 * Created by Agent47 on 2018/1/26
 * */
"use strict";

function fib(n) {
    if (n < 2) {
        return 1
    } else {
        return fib(n - 2) + fib(n - 1)
    }
}
const input = parseInt(process.argv[2],10);

process.send({result:fib(input)});