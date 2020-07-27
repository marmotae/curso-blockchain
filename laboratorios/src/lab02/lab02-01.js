var crypto = require('crypto');

function calculaHash(valor){
    return crypto.createHash('sha256').update(valor).digest('base64');;
}

var texto1 = "Pablito";
var texto2 = "pablito";
var texto3 = "Pablito";

console.log (calculaHash(texto1));
console.log (calculaHash(texto2));
console.log (calculaHash(texto3));

