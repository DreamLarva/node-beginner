const puppeteer = require('puppeteer');
const moment = require('moment');

const section = {
    // 周日
    "0": [],
    // 周一
    "1": [["9:30", "9:45"], ["17:15", "17: 30"]],
    // 周二
    "2": [["9:30", "9:45"], ["17:15", "17: 30"]],
    // 周三
    "3": [["9:30", "9:45"], ["17:15", "17: 30"]],
    // 周四
    "4": [["9:30", "9:45"], ["17:15", "17: 30"]],
    // 周五
    "5": [["9:30", "9:45"], ["17:15", "17: 30"]],
    // 周六
    "6": []

};

/**
 * @return {boolean}
 * */
function isInSignTime(section) {
    const now = moment();
    // 获取 周几
    const day = String(now.day());
    const span = section[day];

    if(span.length && now.isBetween(todayTime(span[0][0]), todayTime(span[0][1]))){
        // 签到时间段
    }else if(span.length && now.isBetween(todayTime(span[1][0]), todayTime(span[1][1]))){
        // 签退时间段
    }else{
        // 不在签到 或者 签到的时间段
    }
}

function todayTime(timeString,splitSign = ":"){
    const [h,m] = timeString.split(splitSign).map(v => parseInt(v));
    return moment().hour(h).minute(m)
}

async function arrangeDate() {


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



