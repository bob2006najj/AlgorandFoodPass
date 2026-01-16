import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useWallet } from '@txnlab/use-wallet-react'

import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'

import { getRole } from '../lib/roleStore'

type Redemption = {
  id: string
  date: string
  merchant: string
  beneficiary: string
  amount: number
  note?: string
}

const LS_KEY = 'foodpass.redemptions'

function loadRedemptions(): Redemption[] {
  const raw = localStorage.getItem(LS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Redemption[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveRedemptions(list: Redemption[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list))
}

export default function Redeem() {
  const role = getRole()
  const blocked = role !== 'merchant'
  const { activeAddress } = useWallet()

  const [beneficiary, setBeneficiary] = useState('')
  const [amount, setAmount] = useState<number>(1)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidAddr = useMemo(() => {
    const a = beneficiary.trim()
    return a.length >= 40 && a.length <= 64
  }, [beneficiary])

  const onRedeem = async (): Promise<void> => {
    if (!activeAddress) {
      toast.error('Connect wallet first')
      return
    }
    if (blocked) {
      toast.error('Role required: Merchant')
      return
    }
    if (!beneficiary.trim()) {
      toast.error('Enter beneficiary address (from QR)')
      return
    }
    if (!isValidAddr) {
      toast.error('Invalid beneficiary address')
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Amount must be > 0')
      return
    }

    try {
      setLoading(true)

      // ✅ MVP: local record only (Next: smart contract atomic redemption)
      const now = new Date()
      const r: Redemption = {
        id: crypto.randomUUID(),
        date: now.toISOString(),
        merchant: activeAddress,
        beneficiary: beneficiary.trim(),
        amount,
        note: note.trim() || undefined,
      }

      const current = loadRedemptions()
      const next = [r, ...current].slice(0, 100)
      saveRedemptions(next)

      setBeneficiary('')
      setAmount(1)
      setNote('')

      toast.success('Redeem recorded (local MVP). Next step: on-chain redemption.')
    } catch (e: any) {
      toast.error(e?.message ?? 'Redeem failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Redeem</h1>
        <Badge variant={blocked ? 'warn' : 'success'}>{blocked ? 'Role required: Merchant' : 'Merchant'}</Badge>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Redeem a FoodPass</h2>
          <p className="text-sm text-slate-600">
            Scan the beneficiary QR (wallet address) and redeem meals/value.
          </p>
        </CardHeader>

        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-500">Beneficiary address (from QR)</label>
            <Input value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder="Paste address…" />
          </div>

          <div>
            <label className="text-xs text-slate-500">Amount</label>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">Note (optional)</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Meal pack / receipt…" />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Status:{' '}
              <span className={beneficiary.trim().length === 0 ? 'text-slate-500' : isValidAddr ? 'text-emerald-700' : 'text-amber-700'}>
                {beneficiary.trim().length === 0 ? 'waiting' : isValidAddr ? 'looks valid' : 'invalid'}
              </span>
            </div>

            <Button onClick={onRedeem} disabled={loading}>
              {loading ? 'Processing…' : 'Redeem'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Recent redemptions</h2>
          <p className="text-sm text-slate-600">Local MVP log (will become on-chain history).</p>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-slate-700">
          {loadRedemptions().slice(0, 10).map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium">Amount: {r.amount}</div>
                <div className="text-xs text-slate-500">{new Date(r.date).toLocaleString()}</div>
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Beneficiary: <span className="font-mono break-all">{r.beneficiary}</span>
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Merchant: <span className="font-mono break-all">{r.merchant}</span>
              </div>
              {r.note && <div className="mt-1 text-xs text-slate-600">Note: {r.note}</div>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
