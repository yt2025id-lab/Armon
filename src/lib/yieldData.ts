export interface YieldProtocol {
  protocol: string
  name: string
  apy: number
  tvl: string
  risk: 'low' | 'medium' | 'high'
  type: 'Staking' | 'Lending' | 'Vault' | 'DEX LP' | 'Leverage' | 'Yield Aggregator' | 'Structured'
  description: string
  features: string[]
  website?: string
  apyRange: string
  minDeposit: string
  lockPeriod?: string
}

// Monad Ecosystem Yield Protocols (Mock Data - Update with real data)
export const MONAD_YIELD_PROTOCOLS: YieldProtocol[] = [
  {
    protocol: 'monad-staking',
    name: 'Monad Stake',
    apy: 5.5,
    tvl: '$245M',
    risk: 'low',
    type: 'Staking',
    description: 'Native staking Monad dengan yield stabil 5-6% APY. Paling aman untuk collateral arisan.',
    features: ['Auto-compound', 'Unbonding 14 hari', 'Tanpa lock wajib', 'Insured by protocol'],
    website: 'https://monad.xyz/staking',
    apyRange: '5-6%',
    minDeposit: '0.1 MON',
  },
  {
    protocol: 'tethys-finance',
    name: 'Tethys Finance',
    apy: 8.2,
    tvl: '$189M',
    risk: 'low',
    type: 'Lending',
    description: 'Lending protocol terbesar di Monad dengan bunga kompetitif dan TVL tinggi.',
    features: ['Variable rate', 'Tanpa lock', 'Flash loan', 'Cross-margin'],
    website: 'https://tethys.finance',
    apyRange: '6-10%',
    minDeposit: '1 MON',
  },
  {
    protocol: 'beetswap',
    name: 'BeetSwap DEX',
    apy: 6.8,
    tvl: '$312M',
    risk: 'low',
    type: 'DEX LP',
    description: 'DEX dengan LP pool untuk stablecoin dan native token. Impermanent loss minimal.',
    features: ['Stable LP', 'Low IL', 'Instant withdraw', 'Multi-pool'],
    website: 'https://beetswap.io',
    apyRange: '5-8%',
    minDeposit: '0.5 MON',
  },
  {
    protocol: 'kriya-vault',
    name: 'Kriya Vault',
    apy: 12.5,
    tvl: '$156M',
    risk: 'medium',
    type: 'Vault',
    description: 'Auto-compounding vault yang otomatis switch ke yield tertinggi. Strategi multi-protocol.',
    features: ['Auto-rebalance', 'Smart routing', 'APY atualizado harian', 'Report mingguan'],
    website: 'https://kriya.finance/vault',
    apyRange: '10-15%',
    minDeposit: '5 MON',
    lockPeriod: 'Flexible',
  },
  {
    protocol: 'flux-lending',
    name: 'Flux Lending',
    apy: 9.5,
    tvl: '$98M',
    risk: 'medium',
    type: 'Lending',
    description: 'Lending protocol dengan collateral多样化. Dukung berbagai token sebagai collateral.',
    features: ['Multi-collateral', 'Variable rate', 'Flash loan available', 'Governance token'],
    website: 'https://flux.money',
    apyRange: '8-12%',
    minDeposit: '2 MON',
  },
  {
    protocol: 'nabla-vault',
    name: 'Nabla Vault',
    apy: 15.2,
    tvl: '$67M',
    risk: 'medium',
    type: 'Yield Aggregator',
    description: 'Yield aggregator dengan strategi optimized. Otomatis deploy ke protocol terbaik.',
    features: ['Multi-strategy', 'APY optimization', 'Auto-compound', 'Insurance pool'],
    website: 'https://nabla.money',
    apyRange: '12-18%',
    minDeposit: '10 MON',
  },
  {
    protocol: 'd再来 protocol',
    name: 'DOLFIN',
    apy: 18.5,
    tvl: '$45M',
    risk: 'high',
    type: 'Leverage',
    description: 'Leveraged yield farming dengan posisi up to 10x. High risk high reward untuk trader aktif.',
    features: ['10x leverage', 'Auto-deleverage', 'Liquidation protection', 'Trading competition'],
    website: 'https://dolfin.xyz',
    apyRange: '15-25%',
    minDeposit: '50 MON',
    lockPeriod: 'Flexible',
  },
  {
    protocol: 'gamma-strategy',
    name: 'Gamma Strategy',
    apy: 11.8,
    tvl: '$78M',
    risk: 'medium',
    type: 'Structured',
    description: 'Structured products dengan downside protection. Bagus untuk jangka menengah.',
    features: ['Capital protection', 'Yield enhancement', 'Expiry tracking', 'Auto-roll'],
    website: 'https://gamma.money',
    apyRange: '10-14%',
    minDeposit: '25 MON',
    lockPeriod: '30-90 hari',
  },
  {
    protocol: 'drift-protocol',
    name: 'Drift Protocol',
    apy: 7.2,
    tvl: '$234M',
    risk: 'low',
    type: 'DEX LP',
    description: 'Perpetual DEX dengan deep liquidity. LP pool dengan fee tinggi.',
    features: ['Perp LP', 'Maker fee', 'Low slippage', 'Integration swap'],
    website: 'https://drift.money',
    apyRange: '6-9%',
    minDeposit: '1 MON',
  },
  {
    protocol: 'kluster-finance',
    name: 'Kluster Finance',
    apy: 14.3,
    tvl: '$89M',
    risk: 'medium',
    type: 'Yield Aggregator',
    description: 'AI-powered yield optimizer yang анализирует market dan auto-rebalance portfolio.',
    features: ['AI optimization', 'Real-time monitoring', 'Risk management', 'Auto-compound'],
    website: 'https://kluster.finance',
    apyRange: '12-16%',
    minDeposit: '15 MON',
  },
]

// Filter protocols by risk level
export function getProtocolsByRisk(risk: 'low' | 'medium' | 'high'): YieldProtocol[] {
  return MONAD_YIELD_PROTOCOLS.filter(p => p.risk === risk)
}

// Get top N protocols by APY
export function getTopProtocols(n: number = 5): YieldProtocol[] {
  return [...MONAD_YIELD_PROTOCOLS].sort((a, b) => b.apy - a.apy).slice(0, n)
}

// Get safest protocols (low risk)
export function getSafeProtocols(): YieldProtocol[] {
  return MONAD_YIELD_PROTOCOLS.filter(p => p.risk === 'low')
}

// Get highest APY protocols
export function getHighYieldProtocols(minApy: number = 10): YieldProtocol[] {
  return MONAD_YIELD_PROTOCOLS.filter(p => p.apy >= minApy)
}

// Calculate projected yield for amount
export function calculateProjectedYield(
  amount: number,
  apy: number,
  months: number = 12
): { total: number; yieldAmount: number; monthlyYield: number } {
  const monthlyRate = apy / 100 / 12
  const total = amount * Math.pow(1 + monthlyRate, months)
  const yieldAmount = total - amount
  const monthlyYield = (total - amount) / months

  return { total, yieldAmount, monthlyYield }
}

// Calculate yield for specific protocol
export function calculateProtocolYield(
  amount: number,
  protocol: YieldProtocol
): { yearly: number; monthly: number; per6Months: number; per3Months: number } {
  const yearly = amount * (protocol.apy / 100)
  const monthly = yearly / 12
  const per6Months = amount * Math.pow(1 + protocol.apy / 100 / 12, 6) - amount
  const per3Months = amount * Math.pow(1 + protocol.apy / 100 / 12, 3) - amount

  return { yearly, monthly, per6Months, per3Months }
}

// Compare multiple protocols for same amount
export function compareProtocols(
  amount: number,
  protocols: YieldProtocol[]
): Array<{ protocol: YieldProtocol; yearlyYield: number; monthlyYield: number }> {
  return protocols.map(p => ({
    protocol: p,
    yearlyYield: amount * (p.apy / 100),
    monthlyYield: amount * (p.apy / 100) / 12,
  })).sort((a, b) => b.yearlyYield - a.yearlyYield)
}

// Get protocol by name
export function getProtocolByName(name: string): YieldProtocol | undefined {
  return MONAD_YIELD_PROTOCOLS.find(p => p.name.toLowerCase() === name.toLowerCase())
}

// Get protocol by ID
export function getProtocolById(id: string): YieldProtocol | undefined {
  return MONAD_YIELD_PROTOCOLS.find(p => p.protocol === id)
}