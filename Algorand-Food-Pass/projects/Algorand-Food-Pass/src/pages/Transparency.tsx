import { Card, CardContent, CardHeader } from '../ui/Card'
import Badge from '../ui/Badge'

export default function Transparency() {
  // For MVP we show UI placeholders; next step will read from contract/global state.
  const stats = [
    { label: 'Total minted', value: 0 },
    { label: 'Active passes', value: 0 },
    { label: 'Expired passes', value: 0 },
    { label: 'Total redeemed', value: 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Transparency</h1>
        <Badge variant="success">Read-only</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent>
              <div className="text-xs text-slate-500">{s.label}</div>
              <div className="mt-1 text-2xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">What you’ll see here next</h2>
          <p className="text-sm text-slate-600">
            Contract-backed numbers: issued, redeemed, remaining, redemptions over time.
          </p>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          This MVP ships real minting first. Then we wire the smart contract stats.
        </CardContent>
      </Card>
    </div>
  )
}
