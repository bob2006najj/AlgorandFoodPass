import { useMemo } from 'react'
import { useWallet, WalletId, Wallet } from '@txnlab/use-wallet-react'
import { LogOut, Wallet as WalletIcon } from 'lucide-react'
import toast from 'react-hot-toast'

import Button from '../ui/Button'
import { shortAddr } from '../lib/format'

export default function WalletButton() {
  const { wallets, activeAddress } = useWallet()

  const wcWallet = useMemo(() => {
    return wallets?.find((w: Wallet) => w.id === WalletId.WALLETCONNECT)
  }, [wallets])

  const activeWallet = useMemo(() => {
    return wallets?.find((w: Wallet) => w.isActive)
  }, [wallets])

  const connect = async () => {
    try {
      if (!wcWallet) {
        toast.error('WalletConnect not available (check App.tsx walletManager config)')
        return
      }
      await wcWallet.connect() // ✅ shows QR, Pera scans it
      toast.success('Wallet connected')
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to connect')
    }
  }

  const disconnect = async () => {
    try {
      if (activeWallet) {
        await activeWallet.disconnect()
        toast.success('Disconnected')
        return
      }

      // cleanup if provider gets stuck
      localStorage.removeItem('@txnlab/use-wallet:v3')
      window.location.reload()
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to disconnect')
    }
  }

  if (activeAddress) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:block rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-700">
          {shortAddr(activeAddress)}
        </div>
        <Button variant="secondary" onClick={disconnect} aria-label="Disconnect wallet">
          <LogOut className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    )
  }

  return (
    <Button variant="primary" onClick={connect} aria-label="Connect Pera Wallet">
      <WalletIcon className="h-4 w-4" />
      <span className="ml-2">Connect Pera</span>
    </Button>
  )
}
