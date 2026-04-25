import { http, createConfig } from 'wagmi'
import { monadTestnet } from 'viem/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

// Create custom chain with proper RPC for balance queries
const monadChain = {
  ...monadTestnet,
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.monad.xyz'],
    },
    public: {
      http: ['https://rpc.testnet.monad.xyz'],
    },
  },
}

export const wagmiConfig = createConfig({
  chains: [monadChain],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Armon' }),
    walletConnect({
      projectId: 'armon-walletconnect',
      metadata: {
        name: 'Armon',
        description: 'Decentralized Arisan on Monad',
        url: window.location.origin,
        icons: [`${window.location.origin}/logo.png`],
      },
    }),
  ],
  transports: {
    [monadChain.id]: http('https://rpc.testnet.monad.xyz'),
  },
})