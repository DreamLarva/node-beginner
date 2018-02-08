/**
 * Created by Agent47 on 2018/2/8
 * */
"use strict";
const fs = require("fs");

const puppeteer = require("puppeteer");
const mime = require("mime");

const path = require("path");
const promisify = require('util').promisify;


async function main() {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    /*
        page.on("response", async function (response) {
            const type = mime.getType(response.url);
            if (/image/.test(type)) {
                await page.waitForSelector("body > div.container > div.login > img");
                const src = await page.$eval("body > div.container > div.login > img", img => img.src);
                if (src === response.url) {
                    await promisify(fs.writeFile)(path.resolve("test", path.basename(src)),response.buffer());
                }
            }
        });
    */

    page.on("requestfinished", async function (request) {
        if (
            request.method === "GET" &&
            /image/.test(mime.getType(request.url))
        ) {
            await page.waitForSelector("body > div.container > div.login > img");
            const src = await page.$eval("body > div.container > div.login > img", img => img.src);
            if (src === request.url) {
                await promisify(fs.writeFile)(path.resolve("test", path.basename(src)), await request.response().buffer());
                browser.close()
            }
        }
    });
    await page.goto("http://itsp.orientsec.com.cn/dfzq-sign/sign.do", {waitUntil: "domcontentloaded"});
}


function downloadTargetImage(frame, url, dest, callback) {
    frame.on("requestfinished", async function (request) {
        if (
            request.method === "GET" &&
            /image/.test(mime.getType(request.url))
        ) {
            await page.waitForSelector("body > div.container > div.login > img");
            const src = await page.$eval("body > div.container > div.login > img", img => img.src);
            if (src === request.url) {
                const downloadPath = explainDownloadPath(dest, url)
                await promisify(fs.writeFile)(downloadPath, await request.response().buffer());
                callback(src, downloadPath);
            }
        }
    });
}

function explainDownloadPath(dest, url) {
    switch (typeof dest) {
        case "string":
            return dest(url);
        case "function":
            return path.resolve(dest, path.basename(url))
    }
}

module.exports = downloadTargetImage