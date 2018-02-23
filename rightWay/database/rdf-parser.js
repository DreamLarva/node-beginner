/**
 * Created by Agent47 on 2018/2/23
 * */
"use strict";

const
    fs = require('fs'),
    cheerio = require('cheerio');


function rdf_parser(filename, callback) {
    fs.readFile(filename, function (err, data) {
        if (err) return callback(err);
        const
            $ = cheerio.load(data.toString()),
            collect = function (index, elem) {
                return $(elem).text();
            };

        callback(null, {
            _id: $('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', ''),
            title: $('dcterms\\:title').text(),
            authors: $('pgterms\\:agent pgterms\\:name').map(collect).get().filter(v=>v),
            // 这里不能用 兄弟选择器 我他妈也不知道为什么
            subjects: $('[rdf\\:resource$="/LCSH"]').map(function(i,e){
                return $(e).siblings("rdf\\:value").text()
            }).get().filter(v=>v)
        })
    });
}

module.exports = rdf_parser;