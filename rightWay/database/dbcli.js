/**
 * Created by Agent47 on 2018/2/23
 * */
"use strict";
const request = require('request'),
    argv = require('yargs').argv._,
    options = {
        method: argv[0],
        url: `http://192.168.112.89:5984/${argv[1] || ""}`
    };
console.log(argv);

request(options, function (err, res, body) {
    if (err) {
        throw new Error(err)
    } else {
        console.log(res.statusCode, JSON.parse(body))
    }
});