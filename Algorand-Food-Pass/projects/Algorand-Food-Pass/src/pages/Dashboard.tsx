import { Card, CardContent, CardHeader } from '../ui/Card'
import Badge from '../ui/Badge'
import { getRole } from '../lib/roleStore'

export default function Dashboard() {
  const role = getRole()
  const blocked = role !== 'admin'

  const kpis = [
    { label: 'Total minted', value: 0 },
    { label: 'Active passes', value: 0 },
    { label: 'Expired passes', value: 0 },
    { label: 'Issued meals/value', value: 0 },
    { label: 'Redeemed', value: 0 },
    { label: 'Remaining', value: 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
        <Badge variant={blocked ? 'warn' : 'success'}>{blocked ? 'Role required: Admin' : 'Admin'}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent>
              <div className="text-xs text-slate-500">{k.label}</div>
              <div className="mt-1 text-2xl font-semibold">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Tables & Charts</h2>
          <p className="text-sm text-slate-600">
            These become real once we connect smart contract state (campaigns, passes, redemptions).
          </p>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          MVP focus: wallet + real NFT minting. Next: contract-backed dashboard.
        </CardContent>
      </Card>
    </div>
  )
}
