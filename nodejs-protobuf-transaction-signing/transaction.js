const {
  toBuffer,
  hexToUint8Array,
  bufferToInt,
  toHexString,
} = require('./utils');
const messages = require('./proto/models_pb');
const sha3 = require('js-sha3');
const secp256k1 = require('secp256k1');

class Transaction {
  constructor(nonce, epoch, type, to, amount, maxFee, tips, payload) {
    this.nonce = nonce || 0;
    this.epoch = epoch || 0;
    this.type = type || 0;
    this.to = to;
    this.amount = amount || 0;
    this.maxFee = maxFee || 0;
    this.tips = tips || 0;
    this.payload = payload;
    this.signature = null;
  }

  fromHex(hex) {
    return this.fromBytes(hexToUint8Array(hex));
  }

  fromBytes(bytes) {
    const protoTx = messages.ProtoTransaction.deserializeBinary(bytes);

    const protoTxData = protoTx.getData();
    this.nonce = protoTxData.getNonce();
    this.epoch = protoTxData.getEpoch();
    this.type = protoTxData.getType();
    this.to = toHexString(protoTxData.getTo(), true);
    this.amount = bufferToInt(protoTxData.getAmount());
    this.maxFee = bufferToInt(protoTxData.getMaxfee());
    this.tips = bufferToInt(protoTxData.getTips());
    this.payload = protoTxData.getPayload();

    this.signature = protoTx.getSignature();

    return this;
  }

  sign(key) {
    const hash = sha3.keccak_256.array(
      this._createProtoTxData().serializeBinary()
    );

    const { signature, recid } = secp256k1.ecdsaSign(
      new Uint8Array(hash),
      hexToUint8Array(key)
    );

    this.signature = Buffer.from([...signature, recid]);

    return this;
  }

  toBytes() {
    const transaction = new messages.ProtoTransaction();
    transaction.setData(this._createProtoTxData());
    if (this.signature) {
      transaction.setSignature(toBuffer(this.signature));
    }
    return Buffer.from(transaction.serializeBinary());
  }

  toHex() {
    return this.toBytes().toString('hex');
  }

  _createProtoTxData() {
    const data = new messages.ProtoTransaction.Data();
    data.setNonce(this.nonce).setEpoch(this.epoch).setType(this.type);

    if (this.to) {
      data.setTo(toBuffer(this.to));
    }

    if (this.amount) {
      data.setAmount(toBuffer(this.amount));
    }
    if (this.maxFee) {
      data.setMaxfee(toBuffer(this.maxFee));
    }
    if (this.tips) {
      data.setTips(toBuffer(this.tips));
    }
    if (this.payload) {
      data.setPayload(toBuffer(this.payload));
    }

    return data;
  }
}

module.exports = Transaction;
