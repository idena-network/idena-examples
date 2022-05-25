import {
  CallContractAttachment,
  ContractArgumentFormat,
  DeployContractAttachment,
  EmbeddedContractType,
  floatStringToDna,
  IdenaProvider,
  privateKeyToAddress,
  TransactionType,
} from 'idena-sdk-js'

import {useData} from './layout'

export function useMultisig() {
  const {url, apiKey, privateKey} = useData()

  let coinbase = '0x'
  try {
    coinbase = privateKeyToAddress(privateKey)
    // eslint-disable-next-line no-empty
  } catch {}

  const provider = IdenaProvider.create(url, apiKey)

  const add = async function (contract, address) {
    const callAttachment = new CallContractAttachment({
      method: 'add',
    })

    callAttachment.setArgs([
      {
        format: ContractArgumentFormat.Hex,
        index: 0,
        value: address,
      },
    ])

    const tx = await provider.Blockchain.buildTx({
      from: coinbase,
      type: TransactionType.CallContractTx,
      to: contract,
      payload: callAttachment.toBytes(),
    })

    tx.sign(privateKey)

    const estimateResult = await provider.Blockchain.estimateTx(tx)

    tx.maxFee = floatStringToDna(estimateResult.receipt.gasCost).add(
      floatStringToDna(estimateResult.receipt.txFee)
    )

    tx.sign(privateKey)

    return provider.Blockchain.sendTx(tx)
  }

  const send = async function (contract, destination, amount) {
    const callAttachment = new CallContractAttachment({
      method: 'send',
    })

    callAttachment.setArgs([
      {
        format: ContractArgumentFormat.Hex,
        index: 0,
        value: destination,
      },
      {
        format: ContractArgumentFormat.Dna,
        index: 1,
        value: amount,
      },
    ])

    const tx = await provider.Blockchain.buildTx({
      from: coinbase,
      type: TransactionType.CallContractTx,
      to: contract,
      payload: callAttachment.toBytes(),
    })

    tx.sign(privateKey)

    const estimateResult = await provider.Blockchain.estimateTx(tx)

    tx.maxFee = floatStringToDna(estimateResult.receipt.gasCost).add(
      floatStringToDna(estimateResult.receipt.txFee)
    )

    tx.sign(privateKey)

    return provider.Blockchain.sendTx(tx)
  }

  const push = async function (contract, destination, amount) {
    const callAttachment = new CallContractAttachment({
      method: 'push',
    })

    callAttachment.setArgs([
      {
        format: ContractArgumentFormat.Hex,
        index: 0,
        value: destination,
      },
      {
        format: ContractArgumentFormat.Dna,
        index: 1,
        value: amount,
      },
    ])

    const tx = await provider.Blockchain.buildTx({
      from: coinbase,
      type: TransactionType.CallContractTx,
      to: contract,
      payload: callAttachment.toBytes(),
    })

    tx.sign(privateKey)

    const estimateResult = await provider.Blockchain.estimateTx(tx)

    tx.maxFee = floatStringToDna(estimateResult.receipt.gasCost).add(
      floatStringToDna(estimateResult.receipt.txFee)
    )

    tx.sign(privateKey)

    return provider.Blockchain.sendTx(tx)
  }

  const deploy = async function (m, n, amount) {
    const deployAttachment = new DeployContractAttachment({
      codeHash: EmbeddedContractType.MultisigContract,
    })

    // multisig 2 of 3
    const args = [
      {format: ContractArgumentFormat.Byte, index: 0, value: n},
      {format: ContractArgumentFormat.Byte, index: 1, value: m},
    ]

    deployAttachment.setArgs(args)

    // build deploy tx through node (epoch, nonce will by filled automatically by node)
    const tx = await provider.Blockchain.buildTx({
      from: coinbase,
      type: TransactionType.DeployContractTx,
      amount,
      payload: deployAttachment.toBytes(),
    })

    // sign transaction
    tx.sign(privateKey)

    // need estimate to get receipt, contract hash and estimation fees
    const estimateResult = await provider.Blockchain.estimateTx(tx)

    tx.maxFee = floatStringToDna(estimateResult.receipt.gasCost).add(
      floatStringToDna(estimateResult.receipt.txFee)
    )

    tx.sign(privateKey)

    // deploy contract
    const txHash = await provider.Blockchain.sendTx(tx)

    return {contractHash: estimateResult.receipt.contract, txHash}
  }

  const readOwner = async function (contract) {
    return provider.Contract.readData(
      contract,
      'owner',
      ContractArgumentFormat.Hex
    )
  }

  const readVoteAddrs = async function (contract) {
    return provider.Contract.iterateMap(
      contract, // contract adderss
      'addr', // map name
      ContractArgumentFormat.Hex, // map key response format
      ContractArgumentFormat.Hex // map value response format
    )
  }

  const readVoteAmounts = async function (contract) {
    return provider.Contract.iterateMap(
      contract, // contract adderss
      'amount', // map name
      ContractArgumentFormat.Hex, // map key response format
      ContractArgumentFormat.Dna // map value response format
    )
  }

  const getTx = async function (hash) {
    return provider.Blockchain.receipt(hash)
  }

  return [
    {readOwner, readVoteAddrs, readVoteAmounts, getTx},
    {add, send, push, deploy},
  ]
}
