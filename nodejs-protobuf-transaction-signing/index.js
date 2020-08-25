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

function exampleDecode() {
  const key =
    'b7d0e2068ea5b4ee6f89d91643824d7e68c7ffa975cac7caae651f7e54ffc164';
  const tx = new Transaction().fromHex(
    '0x0a2d08051034221483b8a2f9bd1be7f1fb496ec91eb0c6983cd387252a088aae08931e5818003207191a716b8feb38124133546567205237d34b31cf1190df38b3a7a284d5a4eea709fcbba8f7561047382da64b358f62b48fda385244bc9b2c1b8459a9497fcf7158c3336d4ea00133c501'
  );

  console.log(tx.sign(key).toHex());
}
