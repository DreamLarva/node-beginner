/**
 * Created by Agent47 on 2018/2/9
 * */
"use strict";

const fs = require("fs");
const stream = fs.createReadStream(process.argv[2]);

stream.on('data',function(chunk){
    /**
     * 如果数据输分次打印 且数据自带换行 这个时候用process.stdout.write 更佳
     * */
   process.stdout.write(chunk);
});

stream.on('error',function(err){
   process.stderr.write("Error:" + err.message + "\n");
});