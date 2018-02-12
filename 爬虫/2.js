const puppeteer = require("puppeteer");



(async()=>{
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto("http://jandan.net/pic/page-189#comments", {waitUntil: "networkidle2"});

    const aHandle = await page.evaluateHandle(() => document.body);
    const resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle);
    console.log(await resultHandle.jsonValue());
    await resultHandle.dispose();
})();

