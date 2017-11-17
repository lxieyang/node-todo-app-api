const {SHA256} = require('crypto-js');

var message = 'I am user number 4';
var hash = SHA256(message).toString();

console.log(`Message ${message}`);
console.log(`Hash: ${hash}`);

var data = {
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()    // server store the secret
};


// middle person modify the data and the hash
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();     // didn't know the secret on the server



var resulthash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resulthash === token.hash) {
    console.log('Data was not changed');
} else {
    console.log('Data was changed. Do not trust!');
}