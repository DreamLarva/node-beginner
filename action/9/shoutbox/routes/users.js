const express = require('express');
const bcrypt = require("bcrypt");
const db = require("redis");


const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;

class User {
    constructor(obj) {
        Object.assign(this, obj)
    }

    save(fn) {
        if (this.id) {
            this.update(fn);
        } else {
            const user = this;
            db.incr('user:ids', function (err, id) {
                if (err) return fn(err);
                user.id = id;
                user.hashPassword(function (err) {
                    if (err) return fn(err);
                    user.update(fn);
                })
            })
        }
    }

    update(fn) {
        const user = this;
        const id = user.id;
        db.set("user:id:" + user.name, id, function (err) {
            if (err) return fn(err);
            db.hmset('user:' + id, user, function (err) {
                fn(err)
            })
        })
    }

    hashPassword(fn) {
        const user = this;
        bcrypt.genSalt(12, function (err, salt) {
            if (err) return fn(err);
            user.salt = salt;
            bcrypt.hash(use.pass, salt, function (err, hash) {
                if (err) return fn(err);
                user.pass = hash;
                fn();
            })
        })
    }

    getByName(name, fn) {
        const user = this;
        user.getId(name, function (err, id) {
            if (err) return fn(err);
            user.get(id, fn);
        })
    }

    getId(name, fn) {
        db.get('user:id' + name, fn);
    }

    get(id, fn) {
        db.hgetall('user:' + id, function (err, user) {
            if (err) return fn(err);
            fn(null, new User(user))
        })
    }

    authenticate(name, pass, fn) {
        const user = this;
        user.getByName(name, function (err, user) {
            if (err) return fn(err);
            if (!user.id) return fn();
            bcrypt.hash(pass, user.salt, function (err, hash) {
                if (err) return fn(err);
                if (hash === user.pass) return fn(null, user);
                fn();
            })
        })
    }
}
