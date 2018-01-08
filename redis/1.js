var redis = require('redis');
// var client = redis.createClient(6379, '192.168.112.67');

var client = redis.createClient(17258, 'redis-17258.c10.us-east-1-4.ec2.cloud.redislabs.com', {no_ready_check: true});





client.on("error", function (err) {
    console.log("Error " + err);
});

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});