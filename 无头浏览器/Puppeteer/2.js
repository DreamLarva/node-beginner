const puppeteer = require('puppeteer');
const moment = require('moment');

const section = [
    // 周日
    [],
    // 周一
    [["9:30", "9:40"], ["17:00", "17: 15"]],
    // 周二
    [["9:30", "9:40"], ["17:15", "17: 30"]],
    // 周三
    [["9:30", "9:40"], ["17:15", "17: 30"]],
    // 周四
    [["9:30", "9:40"], ["17:15", "17: 30"]],
    // 周五
    [["9:30", "9:40"], ["17:15", "17: 30"]],
    // 周六
    []
];
const STATUS = {
    SIGN_IN: Symbol(),
    SIGN_OUT: Symbol(),
};

const user = {
    name: "yangjiaqi",
    password: "a13579"
};


async function main(section,date = moment()) {
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

main(section)
    .catch(console.log);


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
    await page.type('#userName', user.name, {delay: 100});
    await page.type('#password', user.password, {delay: 100});
    await page.click('#loginBtn');
    await page.waitFor(2000);

    const childFrames = page.mainFrame().childFrames();
    const signFrame = childFrames[0];
    const img = await signFrame.$$("img");

    await page.waitFor(2000);
    if (signSignal === STATUS.SIGN_OUT) {
        await img[1].click();
    } else if (signSignal === STATUS.SIGN_IN) {
        await img[0].click();
    }

    await page.waitFor(2000);
    await (await signFrame.$("#signOutDialog > div > div:nth-child(3) > a:nth-child(1)")).click();


    await page.waitFor(2000);
    await browser.close();

}

