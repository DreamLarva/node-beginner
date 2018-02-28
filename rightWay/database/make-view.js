/**
 * Created by Agent47 on 2018/2/27
 * */
"use strict";
const async = require('async'),
    request = require('request'),
    views = require('./view');

async.waterfall([
    // get the existing design doc (if present)
    function (next) {
        request.get("http://192.168.112.89:5984/books/_design/books", next)
    },

    // create a new design doc or use existing
    function (res, body, next) {
        if (res.statusCode === 200) {
            next(null, JSON.parse(body))
        } else if (res.statusCode === 404) {
            next(null, {views: {}})
        }
    },

    // add views to document ans submit
    function (doc, next) {
        Object.keys(views).forEach(function (name) {
            doc.views[name] = views[name];
        });

        request({
            method: "PUT",
            url: "http://192.168.112.89:5984/books/_design/books",
            json: doc
        }, next)
    }
], function (err, res, body) {
    if (err) throw err;
    console.log(res.statusCode, body)
});


/**
 * 建立视图后
 *
 * 获取所有的 作者名 添加加了parameter:  group=true 会归类相同的数据
 * 执行 node dbcli.js GET books/_design/books/_view/by_author?group=true
 *
 * 获取所有的 subject
 * 执行 node dbcli.js GET books/_design/books/_view/by_subject
 * */

