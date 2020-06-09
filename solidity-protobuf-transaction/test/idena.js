const IdenaTransaction = artifacts.require('IdenaTransaction');

contract('IdenaTransaction', (accounts) => {
  it('should parse internal tx data', async () => {
    const idenaInstance = await IdenaTransaction.deployed();

    //  tx hex: 0x08882710641802
    //  &models.ProtoTransaction_Data{Nonce: 5000, Epoch: 100, Type: 2}

    const res = await idenaInstance.parseTxData.call('0x08882710641802');
    const { 0: nonce, 1: epoch, 2: txType } = res;

    assert.equal(nonce.valueOf(), 5000, '5000 should be tx nonce');
    assert.equal(epoch.valueOf(), 100, '5000 should be tx nonce');
    assert.equal(txType.valueOf(), 2, '5000 should be tx nonce');
  });

  it('should create full tx', async () => {
    const idenaInstance = await IdenaTransaction.deployed();

    const res = await idenaInstance.createTxData.call(1, 2, 3);

    assert.equal(
      res.valueOf(),
      '0x0a1008011002180322002a0032003a00420012001800'
    );
  });

  it('should parse full tx', async () => {
    const idenaInstance = await IdenaTransaction.deployed();

    // to := common.HexToAddress("0x6EdCf8978c6A9282C9cc7BeAd8E874592345Fe4E")
    // tx := &Transaction{
    //   AccountNonce: 256,
    //   Epoch:        13,
    //   Type:         2,
    //   To:           &to,
    //   Amount:       big.NewInt(100),
    //   MaxFee:       big.NewInt(300),
    //   Tips:         big.NewInt(222),
    //   Payload:      []byte{0x1, 0x2, 0x3},
    //   Signature:    []byte{0x4, 0x5, 0x6, 0x7},
    //   UseRlp:       true,
    // }
    // hex: 0x0a2c088002100d180222146edcf8978c6a9282c9cc7bead8e874592345fe4e2a01643202012c3a01de42030102031204040506071801

    const res = await idenaInstance.parseTx.call(
      '0x0a2c088002100d180222146edcf8978c6a9282c9cc7bead8e874592345fe4e2a01643202012c3a01de42030102031204040506071801'
    );
    const {
      0: to,
      1: amount,
      2: maxFee,
      3: tips,
      4: payload,
      5: signature,
      6: useRlp,
    } = res;

    assert.equal(
      to.valueOf(),
      '0x6edcf8978c6a9282c9cc7bead8e874592345fe4e',
      'To should be 0x6edcf8978c6a9282c9cc7bead8e874592345fe4e'
    );

    assert.equal(
      amount.valueOf(),
      '0x64',
      'amount should be big.NewInt(100) [0x64]'
    );

    assert.equal(
      maxFee.valueOf(),
      '0x012c',
      'maxFee should be big.NewInt(300) [0x012c]'
    );

    assert.equal(
      tips.valueOf(),
      '0xde',
      'tips should be big.NewInt(222) [0xde]'
    );

    assert.equal(payload.valueOf(), '0x010203', 'Payload should be 0x010203');

    assert.equal(
      signature.valueOf(),
      '0x04050607',
      'Signature should be 0x04050607'
    );

    assert.equal(useRlp.valueOf(), true, 'UseRlp should be true');
  });

  it('should check signature', async () => {
    const idenaInstance = await IdenaTransaction.deployed();

    const key =
      'b7d0e2068ea5b4ee6f89d91643824d7e68c7ffa975cac7caae651f7e54ffc164';

    const sender = '0x6CCd7aF3db5aDD6D30F48E3636b31248D632fAcb';
    const invalidSender = '0x040FF6c2ADf19D50cE05e6Ad0AD96363a1440a4f';

    const signedTx =
      '0x0a2c088002100d180222146edcf8978c6a9282c9cc7bead8e874592345fe4e2a01643202012c3a01de420301020312413a9db54bf7d70eca6db74a14a623b3201a6c12da88e892f6b9746bac1b0e7a7d7b0da05a4c77e4b85653a9e60d1b5363620254fcceae052373feb55f56141ee401';

    const res = await idenaInstance.checkSignature.call(sender, signedTx);
    assert.equal(res.valueOf(), true);

    const resInvalid = await idenaInstance.checkSignature.call(
      invalidSender,
      signedTx
    );
    assert.equal(resInvalid.valueOf(), false);
  });
});
