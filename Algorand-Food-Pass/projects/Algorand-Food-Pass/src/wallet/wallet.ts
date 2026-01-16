import algosdk from 'algosdk'
import { getAlgodClient } from '../lib/algod'

export async function getSuggestedParams() {
  const algod = getAlgodClient()
  return await algod.getTransactionParams().do()
}

export async function sendSignedTransactions(blobs: Uint8Array[]) {
  const algod = getAlgodClient()
  const response = await algod.sendRawTransaction(blobs).do()
  return response.txid
}

export function encodeTxns(txns: algosdk.Transaction[]) {
  return txns.map((t) => ({
    txn: t,
    signers: [], // let wallet sign for current account
  }))
}
