// Armon Contract Configuration
export const ARMON_ADDRESS = '0x7655E71507e8D114d774A236963418959084C8F2' as const

export const MONAD_CHAIN = {
  id: 10159, // 0x279f in hex
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: 'https://testnet-rpc.monad.xyz',
  },
  blockExplorers: {
    default: { name: 'MonadExplorer', url: 'https://testnet.monad.xyz' },
  },
} as const

export const COLLATERAL_BPS = 12500 // 125%
export const MIN_PARTICIPANTS = 3
export const MAX_PARTICIPANTS = 50
export const BASE_YIELD_BPS = 500 // 5% APY
