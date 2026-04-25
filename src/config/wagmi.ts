import { http, createConfig } from 'wagmi'
import { monadTestnet } from 'viem/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'

// Monad Testnet configuration
const MONAD_TESTNET = {
  id: 10159,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.monad.xyz'],
    },
    public: {
      http: ['https://rpc.testnet.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://explorer.testnet.monad.xyz',
    },
  },
} as const

export const wagmiConfig = createConfig({
  chains: [MONAD_TESTNET],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Armon' }),
  ],
  transports: {
    [MONAD_TESTNET.id]: http('https://rpc.testnet.monad.xyz'),
  },
})