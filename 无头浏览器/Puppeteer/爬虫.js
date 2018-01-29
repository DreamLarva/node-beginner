/**
 * Created by Agent47 on 2018/1/29
 * */
"use strict";

const puppeteer = require("puppeteer");
(async() => {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    page.on("console", (...args) => console.log("PAGE LOG:", ...args));
    await page.goto("http://jandan.net/pic", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
        // 相当于在浏览器的控台中使用代码 如果return 就会返回来
       $(".gif-mask").click()
    });
    // console.log(links.join("\n"));
    // browser.close();
})();