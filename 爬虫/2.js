const https = require("https");
const cheerio = require("cheerio");
// const url = "https://jandan.net/ooxx"
const url = "//ba.hitomi.la/galleries/1131499/00";

const fs = require("fs");



//aa.hitomi.la/galleries/1094794/9.jpg
for(let index=1;index<=24;index++){

    console.log("https:" + url +"00"+index + ".jpg");
    https.get("https:" + url +index + ".jpg" , function (res) {
        res.on("data",function(data){
            fs.appendFileSync(index + ".jpg", data)
        });
        res.on("end",function(data){
            console.log("end")
        })
           
    }).on("error",function(err){
            console.log(err)
    })
    
}

