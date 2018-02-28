/**
 * Created by Agent47 on 2018/2/27
 * */
"use strict";
const
    express = require('express'),
    app = express(),
    logger = require('morgan');

app.use(logger('dev'));

app.get('/');