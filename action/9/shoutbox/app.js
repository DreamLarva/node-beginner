var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var messages = require('./lib/messages');
var Entry = require('./lib/entry');
var page = require('./lib/middleware/page');
var user = require("./lib/middleware/user");
var validate = require('./lib/middleware/validate');

var users = require('./routes/users');
var register = require('./routes/register');
var login = require('./routes/login');
var entries = require('./routes/entries');
var api = require('./routes/api');

var app = express();

// view engine setup
// region
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// endregion

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// region
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    cookie: {maxAge: 60000},
    resave: true,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api.auth);
app.use(user);
app.use(messages);
// endregion

// router
// region
app.use(function(err,req,res,next){
    console.log(err);
    next(err)
});

app.use('/users', users);

app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);

app.get('/logout', login.logout);

app.get('/', page(Entry.count, 5), entries.list);
app.get('/post', entries.form);
app.post('/post',
    validate.required('title'),
    validate.lengthAbove('title', 4),
    entries.submit
);

app.get('/api/user/:id', api.user);
app.post('/api/entry', entries.submit);
app.get('/api/entries/:page?',page(Entry.count),api.entries);
// endregion


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
