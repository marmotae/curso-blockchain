var crypto = require('crypto');

var test01 = "Pablito";
var test02 = "pablito";
var test03 = "Pablito";

console.log (getHash(test01));
console.log (getHash(test02));
console.log (getHash(test03));

function getHash(valor){
    return crypto.createHash('sha256').update(valor).digest('base64');;
}