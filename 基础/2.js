/**
 * Created by Agent47 on 2018/4/23
 * */
"use strict";

setTimeout(() => console.log(1));
setImmediate(() => console.log(2));
setImmediate(() => process.nextTick(()=>console.log("d")));
setImmediate(() => console.log("e"));
Promise.resolve().then(() => console.log(7));

process.nextTick(() => console.log(3));
Promise.resolve().then(() =>{
    setTimeout(()=>console.log("c"))
    process.nextTick(()=>console.log("a"));
    process.nextTick(()=>console.log("b"))
});
Promise.resolve().then(() => console.log(6));
process.nextTick(() => console.log(8));
(() => console.log(5))();