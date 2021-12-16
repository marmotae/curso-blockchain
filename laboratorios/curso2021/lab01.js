var crypto = require('crypto');

function calculaHash(valor){
    return crypto.createHash('sha256').update(valor).digest('base64');;
}

var texto1 = "Pablito";
var texto2 = "pablito";
var texto3 = "Pablito";

console.log ("El hash de "+texto1+" es "+calculaHash(texto1));
console.log ("El hash de "+texto2+" es "+calculaHash(texto2));
console.log ("El hash de "+texto3+" es "+calculaHash(texto3));
