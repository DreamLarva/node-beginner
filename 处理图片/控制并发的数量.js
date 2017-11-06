class limit {
    constructor(num) {
        this.max = num; // 并发上限
        this.count = 0; // 处理的并发数量
        this.queue = [] // 等待执行的并发的队列
    }

    // 执行fun 返回的必须是一个 promise
    async push(fun, ...args) {
        // 并发数量并没到最大 可以直接运行
        if (this.count < this.max) {
            let promise = fun(...args);
            this.count++;
            promise
                .then(() => {
                    this.runAfterPromise();
                })
                .catch(err => {
                    console.log(err);
                    this.runAfterPromise();
                })

        } else {
            // 并发数量已经到达最大 推入队列等待
            this.queue.push(
                fun.bind(this, ...args)
            );
            console.log(`当前队列的长度${this.queue.length}`)
        }

    }

    runAfterPromise() {
        if (--this.count < this.max && this.queue.length > 0) {
            let promise = this.queue.shift()();
            promise
                .then(() => {
                    this.runAfterPromise();
                })
                .catch(err => {
                    console.log(err);
                    this.runAfterPromise();
                })
        }

    }
}

function test() {
    "use strict";
    const lim = new limit(100);
    let _count = 0;
    for (let i = 0; i < 1000; i++) {
        lim.push(() =>
            new Promise(resolve => {
                "use strict";
                setTimeout(() => {
                    // console.log(++_count);
                    console.log(i); // 证明 确实是异步
                    resolve()
                }, ~~(Math.random() * 1000));
            })
        )

    }
}

test();


