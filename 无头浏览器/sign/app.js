const puppeteer = require('puppeteer');
const moment = require('moment');

const section = require("./timeSpan");
const user = require('./user');

const STATUS = {
    SIGN_IN: Symbol(),
    SIGN_OUT: Symbol(),
};

main(section)
    .catch(console.log);


async function main(section, date = moment()) {
    const {offset, act} = isInSignTime(section, date);

    console.log('下次执行时间是' + moment(date.valueOf() + offset).format("YYYY年M月D日 dddd HH:mm"));
    console.log("现在在时间是" + date.format("YYYY年M月D日 dddd HH:mm"));
    console.log("距今" + explainTime(offset));
    setTimeout(() => main(section), offset);

    if (act) {
        console.log("开始执行签到或者签退");
        await sign(act);
    }

}

function isInSignTime(section, date) {
    // 获取 周几
    const now = date ? moment(date) : moment();
    const day = now.day();
    const span = section[day];
    const findNextSignDay = _findNextSignDay.bind(null, section, now);
    if (!span.length) {
        // 今天不是签到日
        return {
            act: false,
            offset: randomBetween(
                now.diff(setTime(span[0][0], findNextSignDay())),
                now.diff(setTime(span[0][1], findNextSignDay()))
            )
        }


    } else if (now.isBetween(setTime(span[0][0]), setTime(span[0][1]))) {
        // 签到时间段
        return {
            act: STATUS.SIGN_IN,
            offset: randomBetween(
                now.diff(setTime(span[1][0])),
                now.diff(setTime(span[1][1]))
            )
        }

    } else if (now.isBetween(setTime(span[1][0]), setTime(span[1][1]))) {
        // 签退时间段
        return {
            act: STATUS.SIGN_OUT,
            offset: randomBetween(
                now.diff(setTime(span[0][0], findNextSignDay())),
                now.diff(setTime(span[0][1], findNextSignDay()))
            )
        }
    } else if (now.isBetween(moment().hour(0).minute(0), setTime(span[0][0]))) {
        // 今天签到前
        return {
            act: false,
            offset: randomBetween(
                now.diff(setTime(span[0][0])),
                now.diff(setTime(span[0][1]))
            )
        }
    } else if (now.isBetween(setTime(span[0][1]), setTime(span[1][0]))) {
        // 今天签退前
        return {
            act: false,
            offset: randomBetween(
                now.diff(setTime(span[1][0])),
                now.diff(setTime(span[1][1]))
            )
        }
    } else {
        // 今天签退后
        return {
            act: false,
            offset: randomBetween(
                now.diff(setTime(span[0][0], findNextSignDay())),
                now.diff(setTime(span[0][1], findNextSignDay()))
            )
        }
    }
}


// 不含头尾
function randomBetween(min, max) {
    min = Math.abs(++min);
    max = Math.abs(++max);
    return ~~(min + (max - min) * Math.random())
}

function _findNextSignDay(section, date) {
    const now = date ? moment(date) : moment();
    let day = now.day(),
        offset = 0;
    do {
        offset++;
        day === 6 ? day = 0 : day++
    } while (!section[day].length);

    now.add(offset, 'd');
    return now
}


function setTime(timeString, date = moment(), splitSign = ":") {
    const [h, m] = timeString.split(splitSign).map(v => parseInt(v));
    return date.hour(h).minute(m)
}


function explainTime(num) {
    const seconds = ~~num / 1000;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    return `${days}天${hours % 24}小时${minutes % 60}分钟${Math.floor(seconds % 60)}秒`
}


async function sign(signSignal) {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    // 进入页面
    await page.goto("http://itsp.orientsec.com.cn/dfzq-sign/sign.do");
    // 填写表单
    await page.type('#userName', user.name);
    await page.type('#password', user.password);
    // 点击跳转使用 waitForNavigation确保请求完成
    await Promise.all([
        page.click('#loginBtn'),
        page.waitForNavigation({waitUntil: "networkidle2"})
    ]);

    let signFrame = await selectSignTab(page);
    let signButtons = await getSignButtons(signFrame);

    if (signSignal === STATUS.SIGN_OUT) {
        // 签退情况
        await signButtons[1].click();
        await signFrame.waitForSelector("#signOutDialog > div > div:nth-child(1)");

        if (await isWriteReport(signFrame)) {
            // 还没有填写日报
            console.log("开始填写日报");
            // 切换到填写日报tab
            const reportFrame = await selectReportTab(page);
            // 填写今天的 周报
            await inputReport(reportFrame);
            // 保存
            await (await reportFrame.$("body > div > div > h4 > a > img")).click();
            // 切回签到页面
            signFrame = await selectSignTab(page);
            signButtons = await getSignButtons(signFrame);

        }
        // 开始签退
        await signButtons[1].click();
        await signFrame.waitForSelector("#signOutDialog > div > div:nth-child(1)");


    } else if (signSignal === STATUS.SIGN_IN) {
        // 签到情况
        // 开始签到
        await signButtons[0].click();

    }

    // 弹出框确定

    Promise.all([
        await (await signFrame.$("#signOutDialog > div > div:nth-child(3) > a:nth-child(1)")).click(),
        page.waitForNavigation({waitUntil: "networkidle0"})
    ]);

    await browser.close();

}

/**
 * 切换到 签到的tab
 * @return 签到页的frame
 * */
async function selectSignTab(page) {
    const tab = await page.$("#easyui-tabs > div.tabs-header > div.tabs-wrap > ul > li:nth-child(1)");
    await tab.click();

    const childFrames = page.mainFrame().childFrames();
    await childFrames[0].waitForSelector("body > table");
    console.log("切换到签到tab");
    return childFrames[0];
}

/**
 * 切换到 周报的tab
 * @return 周报的tab
 * */
async function selectReportTab(page) {
    const tab = await page.$("#easyui-tabs > div.tabs-header > div.tabs-wrap > ul > li:nth-child(2)");
    await tab.click();

    const childFrames = page.mainFrame().childFrames();
    await childFrames[1].waitForSelector("#kqlogForm");
    console.log("切换到周报页");
    return childFrames[1];
}

/**
 * 获取 签到和 签退的按钮
 * */
async function getSignButtons(signFrame) {
    return await signFrame.$$("body > div > a > img");
}

/**
 * 判断是否填写了周报
 * @return {boolean}
 * */
async function isWriteReport(page) {
    return (await page.$eval("#signOutDialog > div > div:nth-child(1)", e => e.innerHTML)).includes("您的今日小结还未完成")
}

/**
 * 填写今天的周报
 * */
async function inputReport(frame) {
    const now = moment();
    const date = now.format("YYYY-MM-DD");
    const day =now.day();

    const {byDate,byDay}= require('./report');
    let inputContent = byDate[date] || byDay[day] || "";


    const input = await frame.$(`#kqlogForm > table:nth-child(5) > tbody > tr:nth-child(${day}) > td > textarea`);
    await input.type(inputContent)
}
