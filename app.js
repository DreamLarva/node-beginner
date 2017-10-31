const fs = require("fs");
const path = require("path");
let targetPath = "E:/文档教程/[JavaScript]---前端书";
let dirName = "backbone"

fs.readdir(targetPath, function (err, files) {
    const pdf = files.filter(v =>
        path.extname(v) === ".pdf" &&
        new RegExp(dirName,"i").test(path.basename(v))
    )
    console.log(pdf)

    fs.mkdir(path.resolve(targetPath, dirName), function (err) {
        if (err) {
            // 已经存在文件夹
            // console.log(err)
        }
        pdf.forEach(v => {

            fs.copyFile(
                path.resolve(targetPath, v),
                path.resolve(targetPath, dirName, v),
                function (err) {
                    if (err) throw err;
                    console.log(`已经复制${v}`);
                    fs.unlink(path.resolve(targetPath, v), function (err) {
                        if (err) {
                            console.log(err)
                        }
                        console.log(`已经删除${v}`);
                    })
                }
            )

        })


    })

})

