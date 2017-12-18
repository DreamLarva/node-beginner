var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

let tempHash;

bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
        console.log(hash);
        tempHash = hash
    });
});

const fun = () => {
    // Load hash from your password DB.
    bcrypt.compare(myPlaintextPassword, tempHash, function (err, res) {
        console.log(res)
        // res == true

    });
    bcrypt.compare(someOtherPlaintextPassword, tempHash, function (err, res) {
        console.log(res)
        // res == false
    });
};



setTimeout(fun,1000);


