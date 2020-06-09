const RuntimeLib = artifacts.require('_pb');
const ProtoTxLib = artifacts.require('pb_ProtoTransaction');
const ProtoTxDataLib = artifacts.require('pb_ProtoTransaction_Data');
const IdenaTransaction = artifacts.require('IdenaTransaction');

module.exports = function (deployer) {
  deployer.deploy(RuntimeLib);
  deployer.link(RuntimeLib, ProtoTxLib);
  deployer.link(RuntimeLib, ProtoTxDataLib);
  deployer.deploy(ProtoTxLib);
  deployer.deploy(ProtoTxDataLib);
  deployer.link(ProtoTxLib, IdenaTransaction);
  deployer.link(ProtoTxDataLib, IdenaTransaction);
  deployer.deploy(IdenaTransaction);
};
