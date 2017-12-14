const http = require('http');
const server = http.createServer(function(req,res){
    "use strict";
    switch(req.method){
        case 'GET':
            show(req,res);
            break;
        case 'POST':
            upload(req,res);
            break;
    }
});

function show(req,res){
    "use strict";
    const html = `
        <form method="post" action="/" enctype="multipart/form-data">
            <p><input type="text" name="name"/></p>
            <p><input type="file" name="file"/></p>
            <p><input type="submit" value="Upload"/></p>
        </form>
    `;
    res.setHeader('Content-Type','text/html');
    res.setHeader('Content-Length',Buffer.byteLength(html));
    res.end(html);
}

function upload(){
    "use strict";

}