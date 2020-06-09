const Transaction = require('./transaction');

function example() {
  const key =
    'b7d0e2068ea5b4ee6f89d91643824d7e68c7ffa975cac7caae651f7e54ffc164';

  const tx = new Transaction(
    1, // nonce
    2, // epoch
    3, // type
    '0x6EdCf8978c6A9282C9cc7BeAd8E874592345Fe4E', //to
    10 * 10 ** 18, //amount (10 DNA)
    20 * 10 ** 18, // max fee (20 DNA)
    0, //tips
    Buffer.from([1, 2, 3]) //payload
  );

  const hex = tx.sign(key).toHex();

  console.log(hex);
}

example();
