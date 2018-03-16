/**
 * Created by Agent47 on 2018/3/5
 * */
const
    app = require('express')(),
    logger = require('morgan'),

    config = {
        bookdb: 'http://192.168.112.89:5984/books/',
        b4db: 'http://192.168.112.89:5984/b4/'
    };

app.use(logger('dev'));

// require('./lib/book-search.js')(config, app);
require('./lib/field-search.js')(config, app);
require('./lib/bundle.js')(config, app);


app.listen(3000);