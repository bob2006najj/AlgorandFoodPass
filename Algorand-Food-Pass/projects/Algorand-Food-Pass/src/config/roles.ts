export const DEMO_SUPER_WALLET =
  'OE44RO4QS3A7HCLMJZZDV5TJ3T5Z6LOZSY3XYNDN3ZV7FC4GEZFJLOI45Y'

export type Role = 'public' | 'admin' | 'merchant' | 'beneficiary'

export function isDemoSuperWallet(addr?: string | null) {
  if (!addr) return false
  return addr.trim().toUpperCase() === DEMO_SUPER_WALLET
}
