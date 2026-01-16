import { useMemo, useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import algosdk from 'algosdk'
import toast from 'react-hot-toast'

import { Card, CardContent, CardHeader } from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

import { getAlgodClient, waitForConfirmation } from '../lib/algod'
import { getAlgodConfig } from '../config/network'
import { useRole } from '../hooks/useRole'

type MintResult = { assetId: number; txId: string }

function saveMintedAssetId(assetId: number) {
  const KEY = 'foodpass.mintedAssetIds'
  const raw = localStorage.getItem(KEY)
  const ids = raw ? (JSON.parse(raw) as number[]) : []
  const next = Array.from(new Set([assetId, ...ids])).slice(0, 20)
  localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('foodpass-assets-changed'))
}

export default function MintPass() {
  const role = useRole()
  const blocked = role !== 'admin'

  const { activeAddress, signTransactions } = useWallet()

  const [issuer, setIssuer] = useState('NGO Name')
  const [campaignId, setCampaignId] = useState('demo-campaign-001')
  const [maxMeals, setMaxMeals] = useState(30)
  const [expiryDate, setExpiryDate] = useState('2026-12-31')

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MintResult | null>(null)

  const cfg = useMemo(() => getAlgodConfig(), [])
  const explorerTx = (txId: string) => `${cfg.explorerBase}/tx/${txId}`
  const explorerAsset = (assetId: number) => `${cfg.explorerBase}/asset/${assetId}`

  const doMint = async (): Promise<void> => {
    if (!activeAddress) {
      toast.error('Connect Pera wallet first')
      return
    }
    if (blocked) {
      toast.error('Switch role to Admin (top right)')
      return
    }

    try {
      setLoading(true)
      setResult(null)

      const algod = getAlgodClient()
      const sp = await algod.getTransactionParams().do()

      const metadata = {
        name: 'FoodPass NFT',
        description: 'Digital food voucher for humanitarian aid',
        issuer,
        campaignId,
        maxMeals,
        remainingMeals: maxMeals,
        expiryDate,
        redeemable: true,
      }

      const url = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`

      // ✅ sender (not from)
      const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        sender: activeAddress,
        total: 1,
        decimals: 0,
        defaultFrozen: true,
        unitName: 'FOODPASS',
        assetName: `FoodPass • ${campaignId}`,
        assetURL: url,
        manager: activeAddress,
        reserve: activeAddress,
        freeze: activeAddress,
        clawback: activeAddress,
        suggestedParams: sp,
      })

      const unsigned = algosdk.encodeUnsignedTransaction(txn)

      // ✅ hook method exists in your version
      const signedMaybe = await signTransactions([unsigned])

// ✅ filter out null signatures (wallet typings allow null)
const signed = signedMaybe.filter((b): b is Uint8Array => b !== null)

if (signed.length === 0) {
  throw new Error('No signed transaction returned from wallet')
}

const sendRes = await algod.sendRawTransaction(signed).do()
const txId = (sendRes as any).txid as string

      if (!txId) throw new Error('Transaction ID not returned by algod')

      toast.success('Mint submitted. Waiting confirmation…')
      const confirmed = await waitForConfirmation(txId)

      const assetId = Number((confirmed as any).assetIndex ?? (confirmed as any)['asset-index'])
      if (!assetId) throw new Error('Asset ID not found after confirmation')

      saveMintedAssetId(assetId)
      setResult({ assetId, txId })
      toast.success('FoodPass minted ✅ Check Pera → Assets/NFTs')
    } catch (e: any) {
      toast.error(e?.message ?? 'Mint failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Mint FoodPass NFT</h1>
        <Badge variant={blocked ? 'warn' : 'success'}>{blocked ? 'Role required: Admin' : 'Admin'}</Badge>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Metadata</h2>
          <p className="text-sm text-slate-600">Creates a real ASA NFT on Algorand TestNet (signed by Pera).</p>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-slate-500">Issuer</label>
            <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-slate-500">Campaign ID</label>
            <Input value={campaignId} onChange={(e) => setCampaignId(e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-slate-500">Max meals/value</label>
            <Input type="number" min={1} value={maxMeals} onChange={(e) => setMaxMeals(Number(e.target.value))} />
          </div>

          <div>
            <label className="text-xs text-slate-500">Expiry date</label>
            <Input value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="YYYY-MM-DD" />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              Connected: <span className="font-medium">{activeAddress ?? 'not connected'}</span>
            </div>
            <Button onClick={doMint} disabled={loading}>
              {loading ? 'Minting…' : 'Mint FoodPass NFT'}
            </Button>
          </div>

          {result && (
            <div className="sm:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
              <div className="font-semibold text-emerald-900">Mint successful ✅</div>
              <div className="mt-1 text-emerald-800">
                Asset ID: <span className="font-mono">{result.assetId}</span>
              </div>
              <div className="mt-1 text-emerald-800">
                Tx ID: <span className="font-mono">{result.txId}</span>
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a className="underline text-emerald-900" href={explorerTx(result.txId)} target="_blank" rel="noreferrer">
                  View transaction
                </a>
                <a className="underline text-emerald-900" href={explorerAsset(result.assetId)} target="_blank" rel="noreferrer">
                  View asset
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
