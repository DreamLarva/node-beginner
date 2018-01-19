/**
 * Created by Agent47 on 2018/1/19
 * */
"use strict";

const tobi  = require('tobi');
const browser = tobi.createBrowser(3000,'127.0.0.1');

browser.get('/',function(res,$){
   $('form')
       .fill({description:'Floss the cat'})
       .submit(function (res,$) {
           $('td:nth-child(3)').text().should.equal('Floss the cat')
       })
});
