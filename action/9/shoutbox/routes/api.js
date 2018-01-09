const express = require("express");
const User = require('../lib/user');
const basicAuth = require('basic-auth');
const Entry = require('../lib/entry');


exports.auth = function (req, res, next) {
    /**
     * 授权的内容必须是 在header中
     * header:{
     *      authorization: basic(不区分大小写)  base64内容(解码后的内容是 userName:userPass)
     * }
     *
     * */
    const Credentials = basicAuth(req);
    if (Credentials) {
        // 将认证信息 存储到 req上
        req.remoteUser = Credentials;

        const {name, pass} = Credentials;
        User.authenticate(name, pass, function (err) {
            if(err) return next(err);
            console.log("验证通过");
            next()
        });
    }
};


exports.user = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        if (!user.id) return res.send(404);
        res.json({
            name: user.name,
            id: user.id
        });
    })
};


exports.entries = function (req, res, next) {
    const page = req.page;
    Entry.getRange(page.from, page.to, function (err, entries) {
        if (err) return next(err);

        res.format({
            ['json']() {
                res.send(entries);
            },
            ['xml']() {
                res.render('entries/xml', {entries})
            }
        });

    })
};