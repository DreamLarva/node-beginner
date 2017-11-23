const http = require('http');
const path = require("path");
const formidable = require('formidable');
const server = http.createServer(function (req, res) {
    "use strict";
    switch (req.method) {
        case 'GET':
            show(req, res);
            break;
        case 'POST':
            upload(req, res);
            break;
    }
}).listen(3000);

function show(req, res) {
    "use strict";
    const html = `
        <form method="post" action="/" enctype="multipart/form-data">
            <p><input type="text" name="name"/></p>
            <p><input type="file" name="file"/></p>
            <p><input type="submit" value="Upload"/></p>
        </form>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

function upload(req, res) {
    "use strict";
    if (!isFormDate(req)) {
        res.statusCode = 400;
        res.end("Bad Request : expecting multipart/form-data");
        return
    }
    const form = new formidable.IncomingForm();
    // form.on('field',function(field,value){
    //     console.log(field);
    //     console.log(value);
    // });
    // form.on('file',function(name,file){
    //    console.log(name);
    //    console.log(file)
    // });
    // form.on('end',function(){
    //     res.end('upload complete!')
    // });
    form.uploadDir = path.resolve(__dirname, "test");
    form.encoding = 'utf-8';
    form.keepExtensions = true; // 保留拓展名
    form.on('progress',function(bytesReceived,bytesExcepted){
        let percent = Math.floor(bytesReceived/bytesExcepted  * 100)
        console.log(percent + "%");
    });
    form.parse(req, function (error, fields, files) {
        if (error) throw error;
        console.log(fields);
        console.log(files);
        res.end('upload complete!')
    })
}

function isFormDate(req) {
    "use strict";
    const type = req.headers['content-type'] || '';
    return type.includes('multipart/form-data')
}