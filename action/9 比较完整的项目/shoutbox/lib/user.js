const bcrypt = require("bcrypt");
const db = require("../connect-database/connect-redis");

module.exports = class User {
    constructor(obj) {
        Object.assign(this, obj)
    }

    save(fn) {
        if (this.id) {
            this.update(fn);
        } else {
            const self = this;
            db.incr('user:ids', function (err, id) {
                if (err) return fn(err);
                self.id = id;
                self.hashPassword(function (err) {
                    if (err) return fn(err);
                    self.update(fn);
                })
            })
        }
    }

    update(fn) {
        const self = this;
        const {id} = self;
        db.set("user:id:" + self.name, id, function (err) {
            // 将user 的id 值 和 username 对应的信息存储到redis
            if (err) return fn(err);
            // 用user的id作为key 存储 用户的信息
            db.hmset('user:' + id, self, function (err) {
                fn(err)
            })
        })
    }

    hashPassword(fn) {
        const self = this;
        bcrypt.genSalt(12, function (err, salt) {
            if (err) return fn(err);
            self.salt = salt;
            bcrypt.hash(self.pass, salt, function (err, hash) {
                if (err) return fn(err);
                self.pass = hash;
                fn();
            })
        })
    }

    static getByName(name, fn) {
        const self = this;
        self.getId(name, function (err, id) {
            if (err) return fn(err);
            self.get(id, fn);
        })
    }

    static getId(name, fn) {
        db.get('user:id:' + name, fn);
    }

    static get(id, fn) {
        db.hgetall('user:' + id, function (err, user) {
            if (err) return fn(err);
            fn(null, new User(user))
        })
    }

    static authenticate(name, pass, fn) {
        const self = this;
        self.getByName(name, function (err, self) {
            if (err) return fn(err);
            if (!self.id) return fn(new Error("没有找到用户"));
            bcrypt.hash(pass, self.salt, function (err, hash) {
                if (err) return fn(err);
                if (hash === self.pass) return fn(null, self);
                fn();
            })
        })
    }
};


// test
// var redis = require('redis');
// var db = redis.createClient(6379, '192.168.112.67');
//
// db.on("error", function (err) {
//     console.log("Error " + err);
// });
//
//
// const tobi = new User({
//     name: 'Tobi',
//     pass: "im a ferret",
//     age: "2"
// });

// tobi.save(err=>{
//     if(err)throw err;
//     console.log(`user id ${tobi.id}`)
// });

