var crypto = require('crypto');

function calculaHash(valor){
    return crypto.createHash('sha256').update(valor).digest('base64');;
}

class Block{
    constructor(datos, hashAnterior){
        this.datos = datos;
        this.hashAnterior = hashAnterior;
        this.estampadoDeTiempo = Date.now();
        this.hash = this.calculaHashBloque();
        this.nonce = 0;
    }

    calculaHashBloque(){
        return calculaHash(this.hashAnterior+this.estampadoDeTiempo+JSON.stringify(this.datos)+this.nonce);
    }

    minarBloque(dificultad){
        while(this.hash.substring(0,dificultad)!= Array(dificultad+1).join('0')){
            this.nonce++;
            this.hash = this.calculaHashBloque();
        }
    }
}

class Blockchain{
    constructor(dificultad){
        this.dificultad = dificultad;
        this.blockchain = [];
        this.agregaBloque("Bloque Génesis")
    }

    ultimoBloque(){
        return this.blockchain[this.blockchain.length-1];
    }

    agregaBloque(datos){
        var Bloque
        if(this.ultimoBloque()!=null){
            Bloque = new Block(datos,this.ultimoBloque().hash);
        }else{
            Bloque = new Block(datos,null);
        }
        Bloque.minarBloque(this.dificultad);
        this.blockchain.push(Bloque);
        console.log ("Agregado:\n "+datos + " - "+Bloque.hash);
    }

    esValida(){
        for(let contador=1; contador<this.blockchain.length; contador++){
            let blockActual = this.blockchain[contador];
            let blockAnterior = this.blockchain[contador-1];
            if(blockActual.hashAnterior!=blockAnterior.hash ||
                blockActual.hash != blockActual.calculaHashBloque()){
                    return false;
                }
        }
        return true;
    }
}

miBlockchain = new Blockchain(1);
console.log ("Blockchain creado");
console.log ("Agregando un bloque");
miBlockchain.agregaBloque("Primer bloque agregado");
console.log ("Agregando otro bloque");
miBlockchain.agregaBloque("Segundo bloque agregado");
console.log ("Validando Blockchain");
console.log (miBlockchain.esValida());
console.log (miBlockchain);