console.log("Starting app.js")
const fs = require('fs')
const _ = require("lodash")

const notes = require("./notes")
const yargs = require("yargs")

const argv = yargs.argv;
console.log(argv)