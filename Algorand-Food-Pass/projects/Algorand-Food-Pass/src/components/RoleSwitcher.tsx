import { useMemo } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import toast from 'react-hot-toast'
import { isDemoSuperWallet, type Role } from '../config/roles'
import { getRole, setRole } from '../lib/roleStore'
import { useRole } from '../hooks/useRole'

export function getAllowedRoles(activeAddress?: string | null): Role[] {
  if (!activeAddress) return ['public']
  if (isDemoSuperWallet(activeAddress)) return ['public', 'admin', 'merchant', 'beneficiary']
  return ['public']
}

export default function RoleSwitcher() {
  const { activeAddress } = useWallet()
  const role = useRole()

  const allowed = useMemo(() => getAllowedRoles(activeAddress), [activeAddress])
  const disabled = allowed.length === 1

  const onChange = (next: Role) => {
    if (!activeAddress) {
      toast.error('Connect wallet first')
      setRole('public')
      return
    }
    if (!allowed.includes(next)) {
      toast.error('Not authorized for this role')
      setRole('public')
      return
    }
    setRole(next)
  }

  // ensure stored role is always allowed
  const safeRole = allowed.includes(role) ? role : 'public'
  if (safeRole !== role) setRole('public')

  return (
    <select
      aria-label="Select role"
      value={safeRole}
      onChange={(e) => onChange(e.target.value as Role)}
      className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
      disabled={disabled}
      title={
        !activeAddress
          ? 'Connect wallet first'
          : isDemoSuperWallet(activeAddress)
            ? 'Demo wallet: all roles enabled'
            : 'Public only'
      }
    >
      <option value="public">Role: Public</option>
      {allowed.includes('admin') && <option value="admin">Role: Admin</option>}
      {allowed.includes('merchant') && <option value="merchant">Role: Merchant</option>}
      {allowed.includes('beneficiary') && <option value="beneficiary">Role: Beneficiary</option>}
    </select>
  )
}
