const puppeteer = require('puppeteer');


async function arrangeDate() {

    const section = [
        [setTodayTime(9, 30), setTodayTime(9, 45)],
        [setTodayTime(17, 15), setTodayTime(17, 30)]
    ];

    // 只要落在区间内 执行主进程
    await main(section)

    // 定时器 准备下一次执行
    // todo


}

function setTodayTime(hours, minutes) {
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date

}

// tempUse()

function tempUse() {
    const nowTimeStamp = Date.now()
    const target = new Date()
    target.setHours(17);
    target.setMinutes(15);
    const targetTimeStamp = target.getTime()
    setTimeout(() => main(), targetTimeStamp - nowTimeStamp)

}


async function main(section) {


    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    // 进入页面
    await page.goto("http://itsp.orientsec.com.cn/dfzq-sign/sign.do");
    // 填写表单
    await page.type('#userName', 'yangjiaqi', {delay: 100});
    await page.type('#password', 'a13579', {delay: 100});
    await page.click('#loginBtn');
    // 等待跳转
    await page.waitFor(2000);
    // 执行a 或 b

    const childFrames = page.mainFrame().childFrames();
    const signFrame = childFrames[0];
    const img = await signFrame.$$("img");
    await img[1].click();


    await page.waitFor(1000);

    const signOut = await signFrame.$("#signOutDialog>div>*:last-child>a")

    await signOut.click();

    await page.waitFor(1000);

    await browser.close();


}





// 最后一次校验 保证不会在非正常时间执行
function valid() {
    const date = new Date();
    return (
        date.getDay() === 6 ||
        date.getDay() === 7 ||
        date.getHours() === 9 ||
        date.getHours() === 17
    )
}

function doSign() {

}
