const redis = require('redis');
const db = redis.createClient(6379, '192.168.112.67');

module.exports = db;