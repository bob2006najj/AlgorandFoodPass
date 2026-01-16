import { useEffect, useMemo, useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Badge from '../ui/Badge'
import { QRCodeCanvas } from 'qrcode.react'
import toast from 'react-hot-toast'

import { getAlgodClient } from '../lib/algod'
import { useRole } from '../hooks/useRole'
import { getAlgodConfig } from '../config/network'

type AssetRow = {
  assetId: number
  amount: number
  name?: string
  unitName?: string
  url?: string
}

export default function MyPass() {
  const role = useRole()
  const blocked = role !== 'beneficiary'
  const { activeAddress } = useWallet()

  const [assets, setAssets] = useState<AssetRow[]>([])
  const [loading, setLoading] = useState(false)

  const cfg = useMemo(() => getAlgodConfig(), [])
  const explorerAsset = (assetId: number) => `${cfg.explorerBase}/asset/${assetId}`

  const loadAssets = async (): Promise<void> => {
    if (!activeAddress) return

    try {
      setLoading(true)
      const algod = getAlgodClient()
      const info = await algod.accountInformation(activeAddress).do()

      // ✅ keep the real type, just map it
      const holdings = info.assets ?? []

      const rows: AssetRow[] = []
      for (const h of holdings.slice(0, 50)) {
        // assetId is bigint in your typings
        const assetId = Number((h as any).assetId)
        const amount = Number((h as any).amount)

        const asset = await algod.getAssetByID(assetId).do()
        const p: any = asset.params

        rows.push({
          assetId,
          amount,
          name: p?.name,
          unitName: p?.unitName,
          url: p?.url,
        })
      }

      const foodPasses = rows.filter((r) => {
        const n = (r.name ?? '').toLowerCase()
        const u = (r.unitName ?? '').toLowerCase()
        return u === 'foodpass' || n.startsWith('foodpass')
      })

      setAssets(foodPasses)
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to load assets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssets()
    const handler = () => loadAssets()
    window.addEventListener('foodpass-assets-changed', handler)
    return () => window.removeEventListener('foodpass-assets-changed', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAddress])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">My FoodPass</h1>
        <Badge variant={blocked ? 'warn' : 'success'}>{blocked ? 'Role required: Beneficiary' : 'Beneficiary'}</Badge>
      </div>

      {!activeAddress ? (
        <Card>
          <CardContent className="text-sm text-slate-600">Connect your wallet first to view your FoodPass.</CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">QR for redemption</h2>
              <p className="text-sm text-slate-600">Merchant will scan this QR (contract redemption next step).</p>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <QRCodeCanvas value={activeAddress} size={180} />
              </div>

              <div className="text-sm text-slate-600">
                <div className="font-medium text-slate-900">Your address</div>
                <div className="break-all font-mono">{activeAddress}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Your FoodPass NFTs</h2>
              <p className="text-sm text-slate-600">These are ASA assets in your wallet (TestNet).</p>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">{loading ? 'Loading…' : `Found: ${assets.length}`}</div>
                <button onClick={loadAssets} className="text-sm underline text-emerald-700">
                  Refresh
                </button>
              </div>

              {assets.length === 0 && !loading ? (
                <div className="text-sm text-slate-600">
                  No FoodPass found yet. Go to <b>Admin → Mint Pass</b> and mint one.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {assets.map((a) => (
                    <div key={a.assetId} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-sm font-semibold text-slate-900">{a.name ?? 'FoodPass'}</div>
                      <div className="mt-1 text-xs text-slate-500">Asset ID: {a.assetId}</div>
                      <div className="mt-1 text-xs text-slate-500">Amount: {a.amount}</div>
                      <a className="mt-2 inline-block text-sm underline text-emerald-700" href={explorerAsset(a.assetId)} target="_blank" rel="noreferrer">
                        View on Explorer
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
