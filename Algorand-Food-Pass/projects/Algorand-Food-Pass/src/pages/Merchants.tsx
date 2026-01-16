import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'

import { getRole } from '../lib/roleStore'

type Merchant = { addr: string; name?: string }

const LS_KEY = 'foodpass.merchants'

function loadMerchants(): Merchant[] {
  const raw = localStorage.getItem(LS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Merchant[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveMerchants(list: Merchant[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list))
}

export default function Merchants() {
  const role = getRole()
  const blocked = role !== 'admin'

  const [list, setList] = useState<Merchant[]>(() => loadMerchants())
  const [addr, setAddr] = useState('')
  const [name, setName] = useState('')

  const isValidAddr = useMemo(() => {
    const a = addr.trim()
    // quick validate (length + allowed chars). Full validation can be added later.
    return a.length >= 40 && a.length <= 64
  }, [addr])

  const onAdd = async (): Promise<void> => {
    if (blocked) {
      toast.error('Role required: Admin')
      return
    }

    const a = addr.trim()
    if (!a) {
      toast.error('Enter merchant address')
      return
    }
    if (!isValidAddr) {
      toast.error('Invalid Algorand address')
      return
    }

    if (list.some((m) => m.addr === a)) {
      toast.error('Merchant already exists')
      return
    }

    const next: Merchant[] = [{ addr: a, name: name.trim() || undefined }, ...list]
    setList(next)
    saveMerchants(next)

    setAddr('')
    setName('')
    toast.success('Merchant added (local MVP). Next step: whitelist on smart contract.')
  }

  const onRemove = (a: string): void => {
    if (blocked) {
      toast.error('Role required: Admin')
      return
    }
    const next = list.filter((m) => m.addr !== a)
    setList(next)
    saveMerchants(next)
    toast.success('Merchant removed')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Merchants</h1>
        <Badge variant={blocked ? 'warn' : 'success'}>{blocked ? 'Role required: Admin' : 'Admin'}</Badge>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Add merchant</h2>
          <p className="text-sm text-slate-600">
            MVP uses local storage. Next step: on-chain whitelist controlled by the admin smart contract.
          </p>
        </CardHeader>

        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-500">Merchant address</label>
            <Input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Algorand address…" />
          </div>

          <div>
            <label className="text-xs text-slate-500">Name (optional)</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Store name…" />
          </div>

          <div className="sm:col-span-3 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Status:{' '}
              <span className={isValidAddr ? 'text-emerald-700' : 'text-amber-700'}>
                {addr.trim().length === 0 ? 'waiting' : isValidAddr ? 'looks valid' : 'invalid'}
              </span>
            </div>
            <Button onClick={onAdd}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Merchant list</h2>
        </CardHeader>

        <CardContent className="space-y-3">
          {list.length === 0 ? (
            <div className="text-sm text-slate-600">No merchants yet.</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((m) => (
                <div key={m.addr} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">{m.name ?? 'Merchant'}</div>
                  <div className="mt-1 break-all font-mono text-xs text-slate-600">{m.addr}</div>
                  <div className="mt-3 flex justify-end">
                    <button className="text-sm underline text-rose-700" onClick={() => onRemove(m.addr)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
