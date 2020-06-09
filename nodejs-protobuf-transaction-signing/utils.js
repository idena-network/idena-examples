/** Check if a string is prefixed by 0x */
function isHexPrefixed(str) {
  return str.slice(0, 2) === '0x';
}
/** Removes 0x from a given String */
function stripHexPrefix(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return isHexPrefixed(str) ? str.slice(2) : str;
}
/** Transform an integer into its hexadecimal value */
function intToHex(integer) {
  if (integer < 0) {
    throw new Error('Invalid integer as argument, must be unsigned!');
  }
  var hex = integer.toString(16);
  return hex.length % 2 ? '0' + hex : hex;
}
/** Pad a string to be even */
function padToEven(a) {
  return a.length % 2 ? '0' + a : a;
}
/** Transform an integer into a Buffer */
function intToBuffer(integer) {
  var hex = intToHex(integer);
  return Buffer.from(hex, 'hex');
}
/** Transform anything into a Buffer */
function toBuffer(v) {
  if (!Buffer.isBuffer(v)) {
    if (typeof v === 'string') {
      if (isHexPrefixed(v)) {
        return Buffer.from(padToEven(stripHexPrefix(v)), 'hex');
      } else {
        return Buffer.from(v);
      }
    } else if (typeof v === 'number') {
      if (!v) {
        return Buffer.from([]);
      } else {
        return intToBuffer(v);
      }
    } else if (v === null || v === undefined) {
      return Buffer.from([]);
    } else if (v instanceof Uint8Array) {
      return Buffer.from(v);
    } else {
      throw new Error('invalid type');
    }
  }
  return v;
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

module.exports = {
  toBuffer,
  hexToUint8Array,
};
