const fs = require('fs');
const request = require('request');
const htmlparser = require('htmlparser');

const configFilename = './rss_feeds.txt';

function checkForRSSFile() {
    "use strict";
    fs.open(configFilename, 'r', function (err) {
        "use strict";
        if (err) throw err;
        next(null, configFilename)
    });
}

function readRSSFile(configFilename) {
    "use strict";
    fs.readFile(configFilename, function (err, feedList) {
        if (err) return next(err);
        feedList = feedList
            .toString()
            .replace(/^\s|\s+$/g, "")
            .split("\n");
        const random = Math.floor(Math.random() * feedList.length);
        return next(null, feedList[random])
    })
}

function downloadRSSFeed(feedUrl) {
    "use strict";
    request(feedUrl, function (err, response, body) {
        if (err) return next(err);
        if (response.statusCode !== 200) {
            return next(new Error("Abnormal response status code"));
        }
        next(null, body);

    })
}

function parseRSSFeed(res) {
    "use strict";
    const handler = new htmlparser.RssHandler();
    const parser = new htmlparser.Parser(handler);
    parser.parseComplete(res);
    if (!handler.dom.length) return next(new Error("No Rss items found"));
    console.log( handler.dom[1].children[0].name); // head 标签的 tag name
    const $ = cheerio.load('<ul id="fruits">...</ul>');
}

const tasks = [
    checkForRSSFile,
    readRSSFile,
    downloadRSSFeed,
    parseRSSFeed
];


function next(err, result) {
    if (err) throw err;
    const currentTask = tasks.shift();
    if (currentTask) {
        currentTask(result)
    }
}


next();