process.on('uncaughtException', function (err) {
    console.log('Error: %s', err.message);
});

console.log(process)