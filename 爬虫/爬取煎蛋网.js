/**
 * Created by Agent47 on 2018/1/29
 * */
"use strict";
const puppeteer = require("puppeteer");

const path = require("path");
const _download = require('./download');
const promisify = require('util').promisify;
const asyncCtrl = require("./asyncCtrl")(5);

const download = promisify(asyncCtrl(_download));


async function main() {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    try {
        await page.goto("http://jandan.net/pic/page-189#comments", {waitUntil: "networkidle2"});
    } catch (e) {
    }
    const hrefs = await page.evaluate(() => {
        // 相当于在浏览器的控台中使用代码 如果return 就会返回来
        return Array.from($("a:contains(查看原图)")).map(v => v.href)
    });


    await Promise.all(hrefs.map(href => download(href, path.resolve("test", path.resolve("test", path.basename(href))))));

    console.log(hrefs)
    // console.log(links.join("\n"));
    browser.close();
}

main()