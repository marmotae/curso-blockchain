pragma solidity ^0.4.4;

contract Notary {

    struct Record {
        uint mineTime;
        uint blockNumber;
    }

    mapping (bytes32 => Record) private docHashes;

    event ValorRecibido(string valor, bytes32 hash);
    event HashRegistrado(bytes32 hash, uint256 timestamp);

    constructor() public {
        // constructor
    }

    function addDocHash (bytes32 hash) public {
        Record memory newRecord = Record(block.timestamp, block.number);
        docHashes[hash] = newRecord;
        emit HashRegistrado(hash,block.timestamp);
    }

    function findDocHash (bytes32 hash) public constant returns(uint, uint) {
        return (docHashes[hash].mineTime, docHashes[hash].blockNumber);
    }

    function agregaTexto(string valor) public returns(bytes32) {
        bytes32 hash = sha256(abi.encodePacked(valor));
        emit ValorRecibido(valor,hash);
        addDocHash(hash);
        return hash;
    }
}