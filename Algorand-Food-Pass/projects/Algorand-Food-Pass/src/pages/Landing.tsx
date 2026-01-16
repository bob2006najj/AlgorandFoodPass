import { ArrowRight, ShieldCheck, HandHeart, QrCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWallet } from '@txnlab/use-wallet-react'
import Button from '../ui/Button'
import { Card, CardContent } from '../ui/Card'

export default function Landing() {
  const { activeAddress } = useWallet()

  return (
    <div className="space-y-8">
      <section className="landing-anim rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm sm:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              FoodPass NFTs for transparent humanitarian aid
            </h1>
            <p className="text-slate-600">
              Mint non-transferable-like passes, redeem meals with merchants, and publish transparent statistics —
              all on Algorand TestNet.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/docs">
                <Button variant="ghost">
                  How it works <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link to={activeAddress ? '/mint' : '/docs'}>
                <Button>
                  Start (Admin demo) <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {activeAddress && (
              <div className="text-xs text-slate-500">
                Connected wallet is ready to mint on TestNet.
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" /> Auditable
                </div>
                <p className="text-sm text-slate-600">Every mint and redemption is verifiable on-chain.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <HandHeart className="h-5 w-5 text-amber-500" /> Social good
                </div>
                <p className="text-sm text-slate-600">Designed to support families with dignity and clarity.</p>
              </CardContent>
            </Card>
            <Card className="sm:col-span-2">
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <QrCode className="h-5 w-5 text-slate-700" /> QR redemption flow
                </div>
                <p className="text-sm text-slate-600">
                  Beneficiary shows QR, merchant redeems value (contract integration next step).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
