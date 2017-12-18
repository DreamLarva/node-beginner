const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost:27017/myFirstDB', {useMongoClient: true});

const schema = new mongoose.Schema({
    name:String,
    path:String
});

module.exports = db.model('Photo',schema);