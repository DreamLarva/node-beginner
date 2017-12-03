const connect = require('connect');
const app = connect();


app.use(logger);
app.use("/admin", restrict);
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

function restrict(req, res, next) {
    "use strict";
    const authorization = req.headers.authorization;
    if (!authorization) return next(new Error("Unauthorized"));
    const parts = authorization.split((' '));
    const scheme = parts[0];
    const auth = new Buffer(parts[1], 'base64').toString().split(":");
    const user = auth[0];
    const pass = auth[1];

    // 从redis 中判断用户是否已经登录了
    // authenticateWithDatabase(user,pass,function(err){
    //     if(err)return next(err); // 出错 报错
    //     next() // 确认登录了就继续

    // })
}