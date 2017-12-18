const Photo = require('../models/photos');
const path = require('path');
const fs = require('fs');
const join = path.join;
const mime = require('mime');

const _photos = [
    {
        name: 'Node.js Logo',
        path: '1.png'
    }, {
        name: 'bar',
        path: '2.jpg'
    }
];

exports.list = function (req, res, next) {
    Photo.find({}, function (error, photos) {
        if (error) return next(error)
        console.log(photos);
        res.render('photos', {
            title: 'Photos',
            photos: photos.concat(_photos)
        })
    });
};

exports.form = function (req, res) {
    res.render('photos/upload', {
        title: 'Photo upload'
    })
};


exports.submit = function (dir) {
    return function (req, res, next) {
        console.log(req.file);
        const root = process.cwd();
        const img = req.file;
        const name = req.body.photoName || img.originalname;    // name字段
        const extName = path.extname(img.originalname);         // 拓展名
        const targetFileName = img.filename +extName;           // 完整文件名
        const targetPath = join(dir, targetFileName);           // 存贮路径
        const originPath = path.resolve(root, img.path);        // 缓存路径
        fs.rename(originPath, targetPath, function (err) {
            if (err) return next(err);
            Photo.create({
                name,
                path: targetFileName
            }, function (err) {
                if (err) return next(err);
                res.redirect("/photos")
            })
        })
    }
};


exports.download = function(dir){
    return function(req,res,next){
        const id = req.params.id;
        Photo.findById(id,function(err,photo){
            if(err)return next(err);
            const path = join(dir,photo.path);
            res.sendFile(path); // 直接发送 浏览器并不会提示下载 而是尽可能的执行文件
            res.download(path); // 浏览器会提示下载文件
        })

    }
}