
/**
 * Created by Agent47 on 2018/1/29
 * */
"use strict";

const puppeteer = require("puppeteer");
(async() => {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto("https://news.ycombinator.com", { waitUntil: "networkidle2" });
    await page.click("a.storylink");
    try{
        const response = await page.waitForNavigation({ waitUntil: "networkidle2" });
    }catch(err){
        console.log(err)
    }
    console.log(await page.title());
    console.log(page.url());
    browser.close();
})();