/**
 * Created by Agent47 on 2018/2/12
 * */
"use strict";
const path = require("path");
var logger = require('morgan');

const express = require("express");
const  proxy = require('http-proxy-middleware');

const app = express();


app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/message', proxy({target: 'http://itest.dfzq.com.cn', changeOrigin: true}));

app.listen(3000);