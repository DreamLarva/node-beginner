const connect = require("connect");
const Keygrip = require("keygrip");
const cookieParser = require("cookie-parser");
const app = connect();
const Cookies = require("cookies");

app
    /**
     * cookieParser 中间件 所有的cookies 方法哦res.cookies上 和 res.signedCookies 上
     * */
    .use(cookieParser("secret"))
    .use("/get", function (req, res, next) {
        res.end(JSON.stringify(req.cookies, 2, 2))
    })

    /**
     * Cookies 中间件 将添加.set 获取.get方法 放到req 和 res 上
     * */
    .use(Cookies.express("secret"))
    .use("/set", function (req, res, next) {
        console.log(req.signedCookies);
        // console.log(req.cookies);
        // res.setHeader('Set-Cookie', `myCookie=${Math.random()}`);
        // res.cookies("login",{"name":"abc"},{maxAge:1000*60*60*24});
        console.log(res.cookies.get("aaa")); // 获取
        req.cookies.set("aaa","bbb");   // 设置

        res.end('set\n')
    })
    .listen(3000);