import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function truncateAddress(address: string): string {
  if (!address) return ''
  if (address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatEther(value: bigint): string {
  const eth = Number(value) / 1e18
  return eth.toFixed(4)
}

export function formatEtherCompact(value: bigint): string {
  const eth = Number(value) / 1e18
  if (eth >= 1000) return `${(eth / 1000).toFixed(1)}K`
  if (eth >= 1) return eth.toFixed(2)
  return eth.toFixed(4)
}

export function formatTimestamp(timestamp: bigint | number): string {
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function formatRelativeTime(timestamp: bigint | number): string {
  const now = Date.now()
  const past = Number(timestamp) * 1000
  const diff = now - past

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

export function parseEther(value: string): bigint {
  return BigInt(Math.floor(parseFloat(value) * 1e18))
}

export function formatAddressList(addresses: readonly string[]): string[] {
  return addresses.map(truncateAddress)
}

export function getPoolStatus(pool: {
  isActive: boolean
  participants?: Array<{ paidThisPeriod: boolean; hasWon: boolean }>
}): 'active' | 'pending' | 'completed' | 'drawing' {
  if (!pool.isActive) return 'completed'
  const participants = pool.participants || []
  const allPaid = participants.length > 0 && participants.every(p => p.paidThisPeriod)
  if (allPaid) return 'drawing'
  if (participants.some(p => p.paidThisPeriod)) return 'pending'
  return 'active'
}

export function getCollateralAmount(iuranAmount: bigint, collateralBps: number): bigint {
  return (iuranAmount * BigInt(collateralBps)) / 10000n
}

export function getPrizeAmount(iuranAmount: bigint, participantCount: number): bigint {
  return iuranAmount * BigInt(participantCount)
}