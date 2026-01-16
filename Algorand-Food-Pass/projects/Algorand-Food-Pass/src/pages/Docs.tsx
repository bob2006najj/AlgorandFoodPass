import { Card, CardContent, CardHeader } from '../ui/Card'

export default function Docs() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Docs / How it works</h1>
          <p className="text-sm text-slate-600">
            FoodPass MVP on Algorand TestNet (Pera Wallet).
          </p>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-slate-600">
          <div>
            <div className="font-medium text-slate-900">Roles</div>
            <ul className="list-disc pl-5">
              <li>Public: transparency (read-only)</li>
              <li>Admin: mint FoodPass NFTs</li>
              <li>Beneficiary: view FoodPass + QR</li>
              <li>Merchant: redeem flow (contract next)</li>
            </ul>
          </div>

          <div>
            <div className="font-medium text-slate-900">TestNet only</div>
            <p>
              This app is locked to Algorand TestNet for safety.
            </p>
          </div>

          <div>
            <div className="font-medium text-slate-900">Minting</div>
            <p>
              Admin mints an ASA NFT (total=1). You can see it in Pera under Assets/NFTs.
            </p>
          </div>

          <div>
            <div className="font-medium text-slate-900">Next step</div>
            <p>
              We will add a smart contract to track remaining meals/value, merchant whitelist, redemption history, and expiry.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
