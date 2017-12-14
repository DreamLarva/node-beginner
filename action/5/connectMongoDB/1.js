const MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


const url = 'mongodb://localhost:27017/myFirstDB';


async function main() {
    "use strict";
    try{
        const db = await connectMongoDB();
        console.log("Connected successfully to server");
        const collection = await consoleAllDocuments(db);
        console.log("Found the following records");
        console.log(collection)

    }catch(err){
        throw err
    }


}

// 连接数据库
function connectMongoDB() {
    "use strict";
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            err && reject(err);
            resolve(db);
        });
    })
}

// 
function consoleAllDocuments(db) {
    return new Promise((resolve,reject)=>{
        const collection = db.collection('col');
        collection.find({}).toArray(function (err, docs) {
            err && reject(err);
            resolve(docs);
        });
    });


}

main();