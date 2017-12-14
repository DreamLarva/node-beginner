const connect = require("connect");

const app = connect();


app.use("/a",function(req,res,next){
   console.log("/a",req.url);
    next()
});

const f = connect();
f.use("/f",function(req,res,next){
    console.log("/f",req.url);
    next()
});

app.use("/b",function(req,res,next){
    console.log("/b",req.url);
    c.use("/",f);
    next()
});
const c = connect();
c.use("/d",function(req,res,next){
    console.log("/d",req.url);
    next()
});

c.use("/b",function(req,res,next){
    console.log("/e",req.url);
    // next(f) // 不行

    // c.use("/",f); 本次c得流成不会执行
    next()
});

app.use('/',c);

app.listen(3000);