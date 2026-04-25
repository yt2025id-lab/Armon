import { Link } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { PoolCard } from '@/components/PoolCard'
import { AIChatWidget } from '@/components/AIChatWidget'
import { useActivePools } from '@/hooks/useArmon'
import { Plus, Users, TrendingUp, Shield, ArrowRight, Wallet } from 'lucide-react'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: activePoolIds, isLoading } = useActivePools()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-800 sticky top-0 bg-background/80 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <span className="text-xl font-bold gradient-text">Armon</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            {isConnected ? (
              <Button variant="secondary" size="sm" onClick={() => disconnect()}>
                <Wallet className="w-4 h-4" />
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Button>
            ) : (
              <div className="flex gap-2">
                {connectors.map((connector) => (
                  <Button
                    key={connector.uid}
                    variant="primary"
                    size="sm"
                    onClick={() => connect({ connector })}
                    disabled={isPending}
                  >
                    <Wallet className="w-4 h-4" />
                    {isPending ? 'Connecting...' : `Connect ${connector.name}`}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-sm text-primary font-medium">Live on Monad Testnet</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Arisan On-Chain</span>
            <br />
            <span className="text-white">Trustless Execution</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Community savings pool dengan collateral 125% untuk keamanan.
            Dapatkan yield dari collateral sambil participates dalam arisan tradisional Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button size="lg" className="w-full sm:w-auto">
                <Plus className="w-5 h-5" />
                Buat Pool Baru
              </Button>
            </Link>
            <Link to="#pools">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Browse Pool
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 bg-surface/50">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Cara Kerja Armon</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Buat Pool</h3>
              <p className="text-slate-400 text-sm">
                Tentukan nama, jumlah iuran, dan maksimal peserta.
                Collateral 125% dari iuran ditambahkan oleh setiap peserta.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Bayar Iuran</h3>
              <p className="text-slate-400 text-sm">
                Bayar iuran bulanan tanggal 1-10.
                Collateral kamu accruing yield setiap bulan.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Dapat Hadiah</h3>
              <p className="text-slate-400 text-sm">
                Undian random atau voting memilih pemenang.
                Pemenang dapat total iuran semua peserta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Pools */}
      <section id="pools" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Pool Aktif</h2>
            <Link to="/create">
              <Button variant="accent" size="sm">
                <Plus className="w-4 h-4" />
                Buat Pool Baru
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-pulse text-slate-400">Loading pools...</div>
            </div>
          ) : activePoolIds && activePoolIds.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePoolIds.map((poolId) => (
                <PoolCard key={poolId} poolId={Number(poolId)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface rounded-xl border border-slate-700">
              <p className="text-slate-400 mb-4">Belum ada pool aktif</p>
              <p className="text-sm text-slate-500 mb-4">Jadilah yang pertama membuat pool arisan!</p>
              <Link to="/create">
                <Button>Buat Pool Pertama</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="container mx-auto text-center text-slate-500 text-sm">
          <p>Built for Monad Blitz Jogja 2026</p>
          <p className="mt-1">Contract: 0x7655E71507e8D114d774A236963418959084C8F2</p>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  )
}
