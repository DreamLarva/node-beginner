const connect = require('connect');
const app = connect();
const router = require("./6-10");

app.use(logger);
app.use(restrict("/admin/:id")); // 如果在回调中 查看 req.url 返回 会去掉/admin的之后的部分
app.use("/admin", adminOnly);
app.use(hello);

app.listen(3000);

function logger(req, res, next) {
    "use strict";
    console.log('%s %s', req.method, req.url);
    next()
}


function hello(req, res) {
    "use strict";
    res.setHeader('Content-Type', "text/plain");
    res.end("hello world")
}

function adminOnly(req, res, next) {
    "use strict";
    res.setHeader('Content-Type', "text/plain");
    res.end("admin")
}

function restrict(){
    return router({
        GET:{
            ["/admin/:id"](req,res,id){
                console.log(`得到的url的id 为${id}`)
            }
        }
    })
}


