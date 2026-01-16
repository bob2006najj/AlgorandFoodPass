import { useEffect, useState } from 'react'
import type { Role } from '../config/roles'
import { getRole } from '../lib/roleStore'

export function useRole() {
  const [role, setRole] = useState<Role>(getRole())

  useEffect(() => {
    const handler = () => setRole(getRole())
    window.addEventListener('foodpass-role-changed', handler)
    return () => window.removeEventListener('foodpass-role-changed', handler)
  }, [])

  return role
}
