const doByRenmae = require("./rename");
const doByCur = require("./cut");

let start = Date.now();
let _doByRenmae, _doByCut;
/**
 * 结论 移动文件 (推测 在同一磁盘根目录)
 * 不推荐 使用copyFile 然后 unlink 速度不仅慢 而且需要大量的磁盘约70%~100%
 * 推荐 使用rename 移动文件 占用磁盘约在17%
 * */
doByRenmae()
    .then(() => {
        "use strict";
        _doByRenmae = Date.now() - start;
        start = Date.now()
    })
    .then(() => doByCur())
    .then(() => {
        "use strict";
        _doByCut = Date.now() - start;
    })
    .then(() => {
        "use strict";
        console.log(`rename耗时 ${_doByRenmae}`); // 45626
        console.log(`cut耗时 ${_doByCut}`);       // 51494
    });