/**
 * Created by Agent47 on 2018/1/26
 * */
"use strict";


const ansi = require('ansi');
const cursor = ansi(process.stdout);

cursor
    .write('Hello\n')
    .fg.green()
    .write('Hello')
    .fg.reset()
    .write('\n')
    .fg.red()
    .write('Hello')
    .fg.reset()
    .write('\n')
    .write('Hello')
    .fg.reset()
    .write('\n');
