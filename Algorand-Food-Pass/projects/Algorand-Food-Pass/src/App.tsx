import { WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Footer from './components/Footer'
import Navbar from './components/Navbar'

import Dashboard from './pages/Dashboard'
import Docs from './pages/Docs'
import Landing from './pages/Landing'
import Merchants from './pages/Merchants'
import MintPass from './pages/MintPass'
import MyPass from './pages/MyPass'
import NotFound from './pages/NotFound'
import Redeem from './pages/Redeem'
import Transparency from './pages/Transparency'

const WC_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? ''
if (!WC_PROJECT_ID) {
  throw new Error('Missing VITE_WALLETCONNECT_PROJECT_ID in .env')
}

const walletManager = new WalletManager({
  wallets: [
    {
      id: WalletId.WALLETCONNECT,
      options: {
        // WalletConnect v2
        projectId: WC_PROJECT_ID,

        // Metadata shown in wallet
        metadata: {
          name: 'FoodPass NFT',
          description: 'Humanitarian FoodPass on Algorand TestNet',
          url: 'http://localhost:5174',
          icons: ['https://walletconnect.com/walletconnect-logo.png'],
        },

        // Modal options required by your typings
        enableExplorer: true,
        explorerRecommendedWalletIds: [],
        privacyPolicyUrl: 'https://example.com/privacy',
        termsOfServiceUrl: 'https://example.com/terms',
        themeMode: 'light',

        // ✅ REQUIRED (your error)
        themeVariables: {
          // keep empty strings or simple values; TS only needs the object
          '--wcm-z-index': '9999',
        },
      },
    },
  ],
})

export default function App() {
  return (
    <WalletProvider manager={walletManager}>
      <BrowserRouter>
        <div className="min-h-dvh bg-app flex flex-col">
          <Navbar />

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/transparency" element={<Transparency />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mint" element={<MintPass />} />
              <Route path="/merchants" element={<Merchants />} />

              <Route path="/redeem" element={<Redeem />} />
              <Route path="/mypass" element={<MyPass />} />

              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </WalletProvider>
  )
}
