var express = require('express');
var router = express.Router();

exports.notfound = function (req, res) {
    res.status(404).format({
        html(){
            res.render('404');
        },
        json(){
            res.send({
                message:"Resource not found"
            });
        },
        xml(){
            res.write('<error>\n');
            res.write(' <message>Resource not found</message>\n')
            res.end('<error>\n')
        },
        text(){
            res.send('Resource not found\n');
        }
    })

};