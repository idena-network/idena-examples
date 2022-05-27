import {
  CallContractAttachment,
  ContractArgumentFormat,
  DeployContractAttachment,
  EmbeddedContractType,
  calculateGasCost,
  IdenaProvider,
  TransactionType,
} from 'idena-sdk-js'
import {useRouter} from 'next/router'

import {useData} from './layout'

export function useMultisig() {
  const {url, apiKey, sender} = useData()

  const router = useRouter()

  const sendTx = (tx) => {
    const dnaUrl = new URL(
      `dna/raw?tx=${tx.toHex()}&callback_format=html&callback_url=${
        process.env.NEXT_PUBLIC_CALLBACK_URL
      }`,
      process.env.NEXT_PUBLIC_IDENA_APP
    )

    router.push(dnaUrl)
  }

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
      from: sender,
      type: TransactionType.CallContractTx,
      to: contract,
      payload: callAttachment.toBytes(),
    })

    const feePerGas = await provider.Blockchain.feePerGas()
    const addGas = 2000

    // calculate total TX cost
    tx.maxFee = calculateGasCost(feePerGas, tx.gas + addGas)

    sendTx(tx)
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
      from: sender,
      type: TransactionType.CallContractTx,
      to: contract,
      payload: callAttachment.toBytes(),
    })

    const feePerGas = await provider.Blockchain.feePerGas()
    const sendGas = 2000

    // calculate total TX cost
    tx.maxFee = calculateGasCost(feePerGas, tx.gas + sendGas)

    sendTx(tx)
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
      from: sender,
      type: TransactionType.CallContractTx,
      to: contract,
      payload: callAttachment.toBytes(),
    })

    const feePerGas = await provider.Blockchain.feePerGas()
    const pushGas = 2500

    // calculate total TX cost
    tx.maxFee = calculateGasCost(feePerGas, tx.gas + pushGas)

    sendTx(tx)
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
      from: sender,
      type: TransactionType.DeployContractTx,
      amount,
      payload: deployAttachment.toBytes(),
    })

    const feePerGas = await provider.Blockchain.feePerGas()
    const deployGas = 1300

    // calculate total TX cost
    tx.maxFee = calculateGasCost(feePerGas, tx.gas + deployGas)

    // sign transaction
    // tx.sign(privateKey)

    // deploy contract
    // return provider.Blockchain.sendTx(tx)

    sendTx(tx)
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
