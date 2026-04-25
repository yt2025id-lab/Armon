export interface YieldProtocol {
  protocol: string
  name: string
  apy: number
  tvl: string
  risk: 'low' | 'medium' | 'high'
  type: string
  description: string
  features: string[]
}

export const MOCK_YIELD_DATA: YieldProtocol[] = [
  {
    protocol: 'monad-staking',
    name: 'MonadStaking',
    apy: 5.2,
    tvl: '$125M',
    risk: 'low',
    type: 'Staking',
    description: 'Native staking Monad dengan yield stabil. Paling aman untuk collateral arisan.',
    features: ['Auto-compound', 'Lock period optional', 'Insured by protocol'],
  },
  {
    protocol: 'lendfi',
    name: 'LendFi',
    apy: 7.5,
    tvl: '$89M',
    risk: 'medium',
    type: 'Lending',
    description: 'Lending protocol dengan bunga kompetitif. Diversifikasi portofolio kamu.',
    features: ['Variable rate', 'No lock', 'Flash loan available'],
  },
  {
    protocol: 'yieldvault',
    name: 'YieldVault',
    apy: 10.8,
    tvl: '$156M',
    risk: 'medium',
    type: 'Vault',
    description: 'Auto-compounding vault yang otomatis switch ke yield tertinggi.',
    features: ['Auto-rebalance', 'Smart routing', 'APY atualizado'],
  },
  {
    protocol: 'stableswap',
    name: 'StableSwap',
    apy: 6.2,
    tvl: '$234M',
    risk: 'low',
    type: 'DEX LP',
    description: 'Stablecoin LP dengan impermanent loss minimal. Cocok untuk konservatif.',
    features: ['Low IL', 'Instant withdraw', 'Multi-pool'],
  },
  {
    protocol: 'leveraged-fi',
    name: 'LeverageFi',
    apy: 18.5,
    tvl: '$45M',
    risk: 'high',
    type: 'Leverage',
    description: 'Leveraged position untuk return maksimal. High risk high reward.',
    features: ['10x leverage', 'Auto-deleverage', ' liquidation protection'],
  },
  {
    protocol: 'gammafi',
    name: 'GammaFi',
    apy: 12.3,
    tvl: '$67M',
    risk: 'medium',
    type: 'Structured',
    description: 'Structured products dengan downside protection. Bagus untuk jangka menengah.',
    features: ['Capital protection', 'Yield enhancement', 'Expiry tracking'],
  },
]

export function getTopProtocols(n: number = 3): YieldProtocol[] {
  return [...MOCK_YIELD_DATA]
    .sort((a, b) => b.apy - a.apy)
    .slice(0, n)
}

export function getProtocolByRisk(risk: 'low' | 'medium' | 'high'): YieldProtocol[] {
  return MOCK_YIELD_DATA.filter(p => p.risk === risk)
}

export function calculateProjectedYield(
  amount: number,
  apy: number,
  periods: number = 12
): { total: number; yield: number } {
  const total = amount * Math.pow(1 + apy / 100 / 12, periods)
  const yield_ = total - amount
  return { total, yield: yield_ }
}