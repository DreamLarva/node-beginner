console.log("Starting app.js");
const fs = require('fs');
const _ = require("lodash");

const notes = require("./notes");
const yargs = require("yargs");


const get = require("lodash/get");


const argv = yargs.argv;
// console.log(argv)
// console.log(get)

// console.log(require("./test"));

console.log(process.nextTick.toString());