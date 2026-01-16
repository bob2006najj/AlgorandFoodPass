import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'
import { useWallet } from '@txnlab/use-wallet-react'

import NetworkBadge from './NetworkBadge'
import WalletButton from './WalletButton'
import RoleSwitcher from './RoleSwitcher'

import type { Role } from '../config/roles'
import { getAllowedRoles } from './RoleSwitcher'
import { getRole } from '../lib/roleStore'

/* ---------- NAV DEFINITIONS ---------- */
type NavItem = { to: string; label: string; roles?: Role[] }

const always: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/transparency', label: 'Transparency' },
  { to: '/docs', label: 'Docs' },
]

const adminOnly: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', roles: ['admin'] },
  { to: '/mint', label: 'Mint Pass', roles: ['admin'] },
  { to: '/merchants', label: 'Merchants', roles: ['admin'] },
]

const merchantOnly: NavItem[] = [{ to: '/redeem', label: 'Redeem', roles: ['merchant'] }]

const beneficiaryOnly: NavItem[] = [{ to: '/mypass', label: 'My FoodPass', roles: ['beneficiary'] }]

function NavItemLink({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'rounded-xl px-3 py-2 text-sm font-medium transition',
          isActive ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
        )
      }
    >
      {label}
    </NavLink>
  )
}

export default function Navbar() {
  const location = useLocation()
  const { activeAddress } = useWallet()

  const [menuOpen, setMenuOpen] = useState(false)

  // ✅ keep role state in Navbar (and refresh when role changes)
  const [role, setRoleState] = useState<Role>(() => getRole())

  useEffect(() => {
    const handler = () => setRoleState(getRole())
    window.addEventListener('foodpass-role-changed', handler)
    return () => window.removeEventListener('foodpass-role-changed', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const allowedRoles = useMemo(() => getAllowedRoles(activeAddress), [activeAddress])

  const allNav = useMemo(() => {
    const roleNav: NavItem[] = [
      ...always,
      ...adminOnly,
      ...merchantOnly,
      ...beneficiaryOnly,
    ]

    return roleNav.filter((item) => {
      if (!item.roles) return true
      return item.roles.includes(role)
    })
  }, [role])

  // if current role is not allowed for this wallet, hide role-based links (public view)
  const effectiveNav = useMemo(() => {
    if (!allowedRoles.includes(role)) {
      return always
    }
    return allNav
  }, [allowedRoles, role, allNav])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-600 text-white font-bold">FP</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">FoodPass</div>
            <div className="text-xs text-slate-500">Algorand TestNet</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {effectiveNav.map((n) => (
            <NavItemLink key={n.to} to={n.to} label={n.label} />
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <NetworkBadge />
          <div className="hidden sm:block">
            <RoleSwitcher />
          </div>
          <WalletButton />

          {/* Mobile menu button */}
          <button
            className="md:hidden grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white"
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3">
            <div className="mb-3">
              <RoleSwitcher />
            </div>
            <div className="flex flex-col gap-1">
              {effectiveNav.map((n) => (
                <NavItemLink key={n.to} to={n.to} label={n.label} onClick={() => setMenuOpen(false)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
