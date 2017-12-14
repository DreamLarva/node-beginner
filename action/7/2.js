const url = require('url');
const path = require("path");

const connect = require("connect");
const bodyParser = require('body-parser');
const qs = require("qs");
const querystring = require("querystring");
const app = connect();
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const errorHandler = require("errorhandler");
const serveStatic = require("serve-static");
const compression = require('compression');
const serverIndex = require("serve-index")

var logDirectory = path.join(__dirname, 'log');
var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});


app
    .use(compression())
    .use(serveStatic(path.join(__dirname, 'public'))) // localhost:3000/1.jpg
    .use(serverIndex('public', {'icons': true}))
    .use(morgan("combined", {stream: accessLogStream}))

    // .use(bodyParser.urlencoded({ extended: false }))
    .use("/json", bodyParser.json())
    .use("/json", function (req, res, next) {
        res.setHeader('Content-Type', 'text/plain');
        res.write('you posted:\n');
        res.end(JSON.stringify(req.body, null, 2));
        next()
    })


    .use("/form", bodyParser.urlencoded({extended: false}))
    .use("/form", function (req, res, next) {
        res.setHeader('Content-Type', 'text/plain');
        res.write('you posted:\n');
        res.end(JSON.stringify(req.body, null, 2))
        next()
    })


    .use("/limit", bodyParser.urlencoded({
            extended: false,
            limit: "1mb"
        })
    )
    .use("/limit", function (req, res, next) {
        res.setHeader('Content-Type', 'text/plain');
        res.write('you posted:\n');
        res.end(JSON.stringify(req.body, null, 2));
        next()
    })

    .use("/qs", function (req, res, next) {
        let myURL = url.parse(req.url).search;
        myURL = qs.parse(myURL.substr(1));
        res.end(JSON.stringify(myURL, null, 2));
        next()
    });

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler())
}


app.listen(3000);