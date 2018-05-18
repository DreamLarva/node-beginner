/**
 * Created by Agent47 on 2018/2/9
 * */
"use strict";
const Promise = require("bluebird");
/**
 * blueBird map方法 可以设置 concurrency 每次限制并行的Promise的数量
 * 但是 不能保证并行的Promise的次序
 * */
Promise.map([...new Array(20).keys()],function(v,index){
    return new Promise(function(resolve,reject){
        setTimeout(()=>{
            console.log(v);
            resolve()
        },1000)
    })
},{concurrency: 3});