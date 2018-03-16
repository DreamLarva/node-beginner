function fun(str, callback) {
    setTimeout(() => {
        console.log(str);
        callback(null, `result : ${str}`)
    }, str === 3 ? 5000 : 1000)
}

function proFun(str) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log(str);
            resolve(str)
        }, 1000)
    })

}


async function asyFun(str) {
    return await proFun(str)
}

module.exports = {
    fun,
    proFun,
    asyFun
};