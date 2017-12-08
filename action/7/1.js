const connect = require("connect");
const Cookies = require("cookies");
const keygrip = require("keygrip");
const app = connect();

app
    .use(Cookies.express({keys: "keys"}))
    .use(function(req,res,next){
        console.log(req.headers.cookie );
       console.log(req.cookies);
       console.log(req.signedCookies);
        res.setHeader("200", {
            'Set-Cookie': 'myCookie=test',
            'Content-Type': 'text/plain'
        });

       res.end('hello\n')
    })
    .listen(3000);