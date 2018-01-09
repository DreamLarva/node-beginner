const puppeteer = require('puppeteer');


function arrangeDate() {
    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours();
    const minute = date.getMinutes();
    let delay = 0;
    if (day === 6) {
        delay += 1000 * 60 * 60 * 24; // 一天的毫秒数
    }
    if (day === 7) {
        delay += 1000 * 60 * 60 * 24; // 一天的毫秒数
    }

    const timeMap = [[new Date().setTime()],[]]
}

arrangeDate();

/*
(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("http://itsp.orientsec.com.cn/dfzq-sign/sign.do");
    await page.type('#userName','yangjiaqi',{delay:100});
    await page.type('#password','a13579',{delay:100});
    await page.click('#loginBtn');
    await page.waitFor(2000);

    // await page.screenshot({path: 'example.png'});

    // await browser.close();
})();
*/
