import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { truncateAddress } from '@/lib/utils'
import { Wallet, LogOut } from 'lucide-react'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isPending) {
    return (
      <Button variant="primary" disabled size="sm">
        <span className="animate-pulse">Connecting...</span>
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <Button variant="ghost" onClick={() => disconnect()} size="sm">
        <Wallet className="w-4 h-4" />
        <span className="font-mono text-sm">{truncateAddress(address)}</span>
        <LogOut className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <div className="relative group">
      <Button variant="primary" size="sm">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
      {connectors.length > 0 && (
        <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50">
          <div className="bg-surface border border-slate-700 rounded-xl p-2 shadow-xl min-w-[180px]">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-slate-700/50 text-sm transition-colors text-white"
              >
                Connect {connector.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}