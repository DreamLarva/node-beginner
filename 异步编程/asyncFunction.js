const fs = require("fs");



const Promiseify = (fn) => (...args)=> new Promise((resolve,reject)=>{
    "use strict";
    const callback = args.pop();
    fs.appendFile(args, (error) => {
        if (error) reject(error);
        resolve()
});

function appendAFileA() {
    return new Promise((resolve, reject) =>
        fs.appendFile(path.join(__dirname, "test", (Math.random() * 100000).toFixed(5) + ".txt"), Math.random(), (error) => {
            if (error) reject(error);
            resolve()
        }))
}

function doSomethingAsy(str = "默认", time = 1000) {
    return new Promise((resolve, reject) =>
        setTimeout(
            () => {
                console.log(`过了${time}ms`);
                resolve(str)
            }, time
        )
    )
}


async function a() {
    let a = await doSomethingAsy("黑暗游侠",1000);
    let b = await doSomethingAsy("风行者",1000);
    let c = await doSomethingAsy("小牛",1000);
    console.log(a,b,c);
    return doSomethingAsy()
}

// a()
//     .then(res => console.log(res));

async function b() {
    let con = await doSomethingAsy("黑暗游侠",1000)+await doSomethingAsy("风行者",1000)+await doSomethingAsy("小牛",1000)
    console.log(con);

    return doSomethingAsy()
}

// b()
// .catch(err => console.log(err));


async function c() {
    let con = Promise.all([ doSomethingAsy("黑暗游侠",1000), doSomethingAsy("风行者",2000), doSomethingAsy("小牛",3000)]);
    console.log(await con);

    return doSomethingAsy()
}
c().catch();