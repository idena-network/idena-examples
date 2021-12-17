const sha3 = require('js-sha3');
const secp256k1 = require('secp256k1');

function signVote(merkleProofDataHex, contractAddressHex, vote, keyHex) {
    let hash = sha3.keccak_256.array(
        [...hexToUint8Array(merkleProofDataHex), ...hexToUint8Array(contractAddressHex), vote]
    );
    hash = sha3.keccak_256.array(new Uint8Array(hash));
    const { signature, recid } = secp256k1.ecdsaSign(
        new Uint8Array(hash),
        hexToUint8Array(keyHex)
    );
    return toHexString([...signature, recid], true);
}

function hexToUint8Array(hexString) {
    const str = stripHexPrefix(hexString);

    var arrayBuffer = new Uint8Array(str.length / 2);

    for (var i = 0; i < str.length; i += 2) {
        var byteValue = parseInt(str.substr(i, 2), 16);
        if (isNaN(byteValue)) {
            throw 'Invalid hexString';
        }
        arrayBuffer[i / 2] = byteValue;
    }

    return arrayBuffer;
}

function isHexPrefixed(str) {
    return str.slice(0, 2) === '0x'
}

function stripHexPrefix(str) {
    if (typeof str !== 'string') {
        return str
    }
    return isHexPrefixed(str) ? str.slice(2) : str
}

function toHexString(byteArray, withPrefix = false) {
    return (
        (withPrefix ? '0x' : '') +
        Array.from(byteArray, function (byte) {
            // eslint-disable-next-line no-bitwise
            return `0${(byte & 0xff).toString(16)}`.slice(-2)
        }).join('')
    )
}

module.exports = {
    signVote,
};
