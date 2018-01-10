const puppeteer = require('puppeteer');


async function arrangeDate() {

    const section = [
        [setTodayTime(9,30),setTodayTime(9,45)],
        [setTodayTime(17,15),setTodayTime(17,30)]
    ];

    // 只要落在区间内 执行主进程
    await main(section)

    // 定时器 准备下一次执行
    // todo



}

function setTodayTime(hours,minutes){
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date

}

// arrangeDate();

async function main(section){
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("http://itsp.orientsec.com.cn/dfzq-sign/sign.do");
    await page.type('#userName','yangjiaqi',{delay:100});
    await page.type('#password','a13579',{delay:100});
    await page.click('#loginBtn');
    await page.waitFor(2000);
}


// 最后一次校验 保证不会在非正常时间执行
function  valid() {
    const date = new Date();
    return (
        date.getDay() === 6 ||
        date.getDay() === 7 ||
        date.getHours() === 9 ||
        date.getHours() === 17
    )
}
