// Armon Contract Configuration
export const ARMON_ADDRESS = '0x0F14fc3bfAc3726172aCd08Fe4bFb79B633E76ff' as const

export const MONAD_CHAIN = {
  id: 10143, // 0x279f in hex
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
    default: { name: 'MonadExplorer', url: 'https://testnet.monadvision.com' },
  },
} as const

export const COLLATERAL_BPS = 12500 // 125%
export const MIN_PARTICIPANTS = 3
export const MAX_PARTICIPANTS = 50
export const BASE_YIELD_BPS = 500 // 5% APY
