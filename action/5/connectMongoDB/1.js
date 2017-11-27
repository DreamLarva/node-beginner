const MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


const url = 'mongodb://localhost:27017/myFirstDB';

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    findDocuments(db,function(){
        "use strict";
        db.close()
    });
});



function findDocuments(db, callback) {
    "use strict";

    return new
    const collection = db.collection('col');
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback && callback(docs);
    });

}