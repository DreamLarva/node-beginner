const redis = require("../connect-database/connect-redis");

class Entry {
    constructor(obj) {
        Object.assign(this, obj)
    }

    static getRange(from, to, fn) {
        redis.lrange('entries', from, to, function (err, items) {
            if (err) return fn(err);
            const entries = [];

            items.forEach(function (item) {
                entries.push((JSON.parse(item)))
            });

            fn(null, entries);

        })
    }

    save(fn) {
        const entryJSON = JSON.stringify(this);
        redis.lpush(
            'entries',
            entryJSON,
            function (err) {
                if (err) return fn(err);
                fn()
            }
        )
    }


    static count(fn){
        redis.llen('entries',fn)
    }

}


module.exports = Entry;