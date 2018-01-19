const db = [];
exports.save = function (doc,cb) {
    db.push(doc);
    cb && setTimeout(()=>cb,2000);
};

exports.first = function (obj) {
    return db.filter(function (doc) {
        return Object.keys(obj).some(key =>
            doc[key] === obj[key]
        );
    }).shift()
};

exports.clear = function(){
    db.length = 0;
};

