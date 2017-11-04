const https = require("https");
const cheerio = require("cheerio")
// const url = "https://jandan.net/ooxx"
const url = "https://jandan.net/ooxx"

const fs = require("fs")



for(let i=0;i<1;i++){
    https.get(`https://jandan.net/ooxx/page-${218-i}#comments`, function (res) {
        let _data = "";
        res.on('data', function (data) {
            _data += data
        })
        res.on('end', function () {
            let $ = cheerio.load(String(_data))
            const list = $(".commentlist .row .text>p>a");
          
            list.each(function(index,value){
                try{
                    let src = value.attribs.href
                    let srcArr = src.split("/")
                    let fileName = srcArr[srcArr.length-1]
                    console.log("src",src)
                   console.log("fileName",fileName)
                   console.log("src","https:" + src)
                    https.get("https:" + src, function (res) {
                        res.on("data",function(data){
                            fs.appendFileSync(index + fileName, data)
                        })
                        res.on("end",function(data){
                            console.log("end")
                        })
                           
                    })
                    console.log("***********")
                }catch(e){
    
                }
              
            })
           
    
        })
    }).on('error', function (err) {
        console.log(err)
    })
}
