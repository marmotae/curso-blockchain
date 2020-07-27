# Introducción a los Conceptos de Criptografía

## 1 - Primer Ejercicio : Hashes

El objetivo del primer ejercicio es entender el concepto del Hash o Resumen o Digestión como fué discutido en la parte teórica.

### 1 - Preparar el ambiente

Para preparar nuestro ambiente tenemos que hacer algunas actividades previas

- Primero debemos abrir nuestra terminal o ventana de comando de la misma forma que vimos en el [Laboratorio 01](./laboratorio_01.md)
- Crearemos ahora un directorio para este ejercicio con el siguiente commando ```mkdir lab02```
- Nos cambiamos al directorio recien creado con la instrucción ```cd lab02```
- Finalmente incluimos una librería de criptografía que hará la mayor parte del trabajo pesado de este ejercicio con el siguiente comando ```npm install crypto```
- Una vez terminada la instalación invocamos el Visual Studio Code con la instruccion ```code lab02-01.js``` esto abrirá Visual Studio Code y creará un archivo en blanco con el nombre __lab02-01.js__

### 2 - Creando nuestro programa

Lo primero que debemos hacer, es invocal la biblioteca de funciones criptográficas que instalamos en la sección anterior, esto lo hacemos escribiendo la siguiente instrucción en la primera linea del archivo:

``` javascript
var crypto = require('crypto');
```
Esta instrucción no solo integra la biblioteca (con el comando require) sino que además crea una variable que representa la biblioteca, aqui nombrada como __crypto__

Acto seguido, crearemos una función agregando el siguiente texto a nuestro archivo

```javascript
function calculaHash(valor){
    return crypto.createHash('sha256').update(valor).digest('base64');;
}
```

Con esto creamos una funcion llamada __calculaHash__ que recibe la variable __valor__ como parámetro. Esta función reresará como resultado el valor resultante de ejecutar la instrucción __createHash__ de nuestra biblioteca __crypto__.

Cabe hacer notar un par de consideraciones:
1. Hemos invocado la funcion __createHash__ con el valor "sha256", esto indica el tipo de resumen a usar, donde sha256 es uno de tantos tipos disponibles.
2. Pasamos nuestro parámetro __valor__ mediante la instrucción __update__
3. Finalmente transformamos el resultado en una cadena imprimible de texto solicitando que el "digest" o resumen, se exprese en "base64"

Luego de crear la función, agregaremos unas cuantas lineas para probarla. Agregemos lo siguiente a nuestro programa:

```javascript
var texto1 = "Pablito";
var texto2 = "pablito";
var texto3 = "Pablito";

console.log (calculaHash(texto1));
console.log (calculaHash(texto2));
console.log (calculaHash(texto3));
```

En estas lineas primero definimos 3 variables que contienen 3 textos. Como podemos ver, el primero y el tercero son identicos mientras que el seguindo tiene una pequeña diferencia. Las siguientes líneas mandan imprimir a la pantalla mediante el comando __console.log__ el resultado de invocar nuestra función __calculaHash__.

Una vez terminado esto, salvamos nuestro archivo y desde la línea de comando ejecutamos la siguiente instrucción

```
node lab02-01
```

Esto ejecutará nuestro programa y veremos salir algo así:

```
55uQNM7CqTyGWzuXIBHZEJLCktWr1dzA5LNjAMYlnyI=
32euTHSt7RKsjr+3cxFcoa2h7XyLKcBe/487VV5K3iM=
55uQNM7CqTyGWzuXIBHZEJLCktWr1dzA5LNjAMYlnyI=
```

Estas 3 líneas son las respuestas de nuestra función. Como podemos ver, la primera y tercera son indéticas. La segunda no sólo es distinta, sino que adicionalmente es evidentemente distinta. Esto quiere decir que un cambio pequeño tiene un gran impacto en el resultado de una función de resumen

### 3 - Simulando una Blockchain

Una vez que entendemos como funcionan los hashes, podemos simular la manera en que se forman los blockchains. Para esto, crearemos un nuevo archivo dentro del mismo directorio con el nombre __lab02-02.js__. Esto lo podemos hacer desde dentro del mismo Visual Studio Code seleccionando "crear un nuevo archivo" desde el menú de archivos.

Las primeras líneas son unas que ya conocemos:

```javascript
var crypto = require('crypto');

function calculaHash(valor){
    return crypto.createHash('sha256').update(valor).digest('base64');;
}
```
Como hemos visto, con estas lineas importamos la biblioteca cripto y creamos una funcion para generar hashes.

Ahora agregamos las siguientes líneas al final del archivo:

```javascript
class Block{
    constructor(datos, hashAnterior){
        this.datos = datos;
        this.hashAnterior = hashAnterior;
        this.estampadoDeTiempo = Date.now();
        this.hash = this.calculaHashBloque();
    }

    calculaHashBloque(){
        return calculaHash(this.hashAnterior+this.estampadoDeTiempo+JSON.stringify(this.datos));
    }
}
```

Con estas instrucciones estamos definiendo una _clase_ o tipo de objeto con el nombre __Block__ esto es crearemos una estructura lógica que representará un bloque dentro de una cadena. La primera parte define el __constructor__ la cual es la función que ejecutamos al crear por primera vez una instancia de una clase. Esta función lleva como parámetros los datos contenidos dentro de este bloque y el hash del bloque anterior. Acto seguido y luego de asignar los valores de los parametros a sus instancias locales, agregamos dos valores mas que son calculados. El primero es el estampado de tiempo que se llenará con la fecha y hora actual. El segundo es el valor del hash de este nodo, para llenarlo usaremos la función calculaHashBloque que no es otra cosa mas que una invocación a la función que ya conocíamos pero hecha de una forma distinta. Ahora al invocar la función, lo que usaremos será una concatenación de los siguente valores:
- El hash del nodo anterior
- El valor del estampado de tiempo
- Una cadena de texto representando los datos de el nodo actual

Por lo tanto, el resultado de esta invocación genera un resumen sobre los 3 datos y generaría evidencia de alteración si uno de ellos fuera cambiado.

Bien ahora que ya tenemos un Bloque, necesitamos crear una estructura para armar una cadena de ellos. Para esto, agregaremos las siguientes líneas al final de nuestro archivo:

```javascript
class Blockchain{
    constructor(){
        this.blockchain = [new Block("Bloque Génesis","")];
    }

    ultimoBloque(){
        return this.blockchain[this.blockchain.length-1];
    }

    agregaBloque(datos){
        this.blockchain.push(new Block(datos,this.ultimoBloque().hash));
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
```

Esta estructura es similar a la que creamos con los bloques pero con diferencias cruciales. Al igual que en el caso anterior aquí tenemos un constructor pero en este caso el constructor crea una variable local (_blockchain_) que contendrá nuestra cadena de blockes bajo la forma de un arreglo o array que es simplemente una cadena de elementos denotada con los símbolos __[]__ ahora en este caso particular al crear la cadena estamos creando un nuevo miembro (el primero) con la instrucción __New__. Como podemos ver ese nuevo miembro es del tipo __Block__ que definimos con anterioridad y para su construcción tenemos que pasar parámetros. El primer parámetro, sus datos, consiste únicamente en la cadena de texto _"Boque Génesis"_ y el segundo parámetro, el hash del bloque anterior lo pasamos como un texto en blanco con "".

Luego agregamos la función __ultimoBloque__ que tiene el fin de devolver el último bloque de nuestra cadena. Esto lo logramos pidiendo el "n-ésimo" elemento de la cadena donde n es igual a la longitud de la cadena menos 1. Esto puede parecer confuso para los que no han programado, pero es comun que los arreglos tengan como base 0, esto el el primer elemento tiene el sub índice 0 en lugar de 1. Luego entonces una cadena de 3 elementos de longitud tendrán como sub índices [0,1,2] por lo que el subíndice del ultimo elemento sería la longitud de la cadena - 1, en otras palabras 2. El resultado final de esto es una función que siempre nos regresará el último elemento de nuestra cadenas de bloques.

Luego agregamos la función __agregaBloque__ que recibe como parámetros los datos del bloque a agregar. Para hacerlo, tendremos que lograr dos cosas, por una parte crear un nuevo bloque y por otro lado agregar ese nuevo bloque al final de la cadena. La funcion simplemente agrega un nuevo elemento a la cadena usando la funcion __push__, pero que agregaremos? Agregaremos el resultado de la invocación a __new Block()__ que ya discutimos. Ahora notemos que el primer parámetro son los datos y tal cual resulta simple pasarlos, el segundo parámetro es un poco mas dificil pero simplemente consiste en el hash del elemento anterior de la cadena. Esto lo podemos generar invocando a __ultimoBloque()__ y pidiendo su valor hash. A manera de resumen, podemos decir que cuando invocamos esta funcion, creamos un nuevo bloque con los datos proporcionados y el valor del hash del último bloque. Una vez creado el bloque, es añadido como último elemento a nuestra cadena

Finalmente creamos una función llamada __esValida__ que pasará por cada nodo de la cadena y realizará dos evaluaciones:
1. Validará que los datos contenidos corresponden con su hash
2. Validará que el hash del bloque anterior coincide con el que tiene almacenado

Con esto buscamos validar de una manera simplificada, que los datos de cada bloque son íntegros y que el orden de los bloques dentro de la cadena es el correcto.

Finalmente agregaremos las siguientes líneas a nuestro programa:

```javascript
miBlockchain = new Blockchain();
console.log ("Blockchain creado");
console.log (miBlockchain);

console.log ("Agregando un bloque");
miBlockchain.agregaBloque("Primer bloque agregado");
console.log (miBlockchain);

console.log ("Agregando otro bloque");
miBlockchain.agregaBloque("Segundo bloque agregado");
console.log (miBlockchain);

console.log ("Validando Blockchain");
console.log (miBlockchain.esValida());

console.log ("Alterando datos el el segundo bloque");
miBlockchain.blockchain[1].datos = "Datos alterados";
console.log ("Validando Blockchain");
console.log (miBlockchain.esValida());
```

Estas líneas haran lo siguiente:
1. Crear una variable llamada __miBlockchain__ con una nueva blockchain, conteniendo únicamente su nodo génesis.
2. Imprimimos el blockchain en pantalla para verlo
3. Agregamos un nuevo nodo con el valor "Primer bloque agregado"
4. Imprimimos el blockchain en pantalla para verlo
5. Agregamos un nuevo nodo con el valor "Segundo bloque agregado"
6. Ejecutamos una validación de nuestro blockchain, mismo que debe arrojar como resultado __true__ pues los datos son coincidentes
7. "Maliciosamente" cambiamos el dato del segundo elemento (con subindice 1) para que su valor de datos sea ahora "Datos alterados"
8. Ejecutamos la validación nuevamente y el resultado como es esperable será __false__ pues hemos alterado los datos

Salvamos el archivo y ejecutamos desde la línea de comando la siguiente instrucción

```shell
node lab02-02
```

nuestro resultado, si hemos hecho todo de forma correcta será

```shell
Blockchain creado
Blockchain {
  blockchain:
   [ Block {
       datos: 'Bloque Génesis',
       hashAnterior: '',
       estampadoDeTiempo: 1595878666510,
       hash: 'aq03IKqRNCpBOUQV+bc5LQv2oQXSwbRtj4jVR3z3i0s=' } ] }
Agregando un bloque
Blockchain {
  blockchain:
   [ Block {
       datos: 'Bloque Génesis',
       hashAnterior: '',
       estampadoDeTiempo: 1595878666510,
       hash: 'aq03IKqRNCpBOUQV+bc5LQv2oQXSwbRtj4jVR3z3i0s=' },
     Block {
       datos: 'Primer bloque agregado',
       hashAnterior: 'aq03IKqRNCpBOUQV+bc5LQv2oQXSwbRtj4jVR3z3i0s=',
       estampadoDeTiempo: 1595878666519,
       hash: 'FsJWLqDyLU74kalFMGt+qEAdATNOxII35dXecLT4egw=' } ] }
Agregando otro bloque
Blockchain {
  blockchain:
   [ Block {
       datos: 'Bloque Génesis',
       hashAnterior: '',
       estampadoDeTiempo: 1595878666510,
       hash: 'aq03IKqRNCpBOUQV+bc5LQv2oQXSwbRtj4jVR3z3i0s=' },
     Block {
       datos: 'Primer bloque agregado',
       hashAnterior: 'aq03IKqRNCpBOUQV+bc5LQv2oQXSwbRtj4jVR3z3i0s=',
       estampadoDeTiempo: 1595878666519,
       hash: 'FsJWLqDyLU74kalFMGt+qEAdATNOxII35dXecLT4egw=' },
     Block {
       datos: 'Segundo bloque agregado',
       hashAnterior: 'FsJWLqDyLU74kalFMGt+qEAdATNOxII35dXecLT4egw=',
       estampadoDeTiempo: 1595878666520,
       hash: 'ThiuyrN89FE9coH8v0DSO8/AhT+J0iHzm8bQQNaHKCI=' } ] }
Validando Blockchain
true
Alterando datos el el segundo bloque
Validando Blockchain
false
```