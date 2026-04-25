import { http, createConfig, mainnet } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { ARMON_ADDRESS, MONAD_CHAIN } from '@/lib/contracts'

export const config = createConfig({
  chains: [MONAD_CHAIN as any],
  connectors: [
    injected(),
  ],
  transports: {
    [MONAD_CHAIN.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
