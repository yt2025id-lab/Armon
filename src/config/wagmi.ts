import { http, createConfig } from 'wagmi'
import { monadTestnet } from 'viem/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

// Use viem's monadTestnet with correct RPC
export const wagmiConfig = createConfig({
  chains: [monadTestnet],
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
    [monadTestnet.id]: http(),
  },
})