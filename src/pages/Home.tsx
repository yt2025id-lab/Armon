import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { WalletButton } from '@/components/WalletButton'
import { Button } from '@/components/ui/Button'
import { usePoolWithParticipants, useActivePools } from '@/hooks/useArmonContract'
import { formatEther, getPoolStatus, truncateAddress } from '@/lib/utils'
import { COLLATERAL_BPS } from '@/lib/constants'
import {
  Plus,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  Trophy,
  Wallet,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react'

// Mock pools for demo when contract not deployed
const mockPools = [
  {
    id: 0,
    name: 'Arisan RT05 Tanah Abang',
    iuranAmount: '5.0',
    maxParticipants: 6,
    currentPeriod: 2,
    totalPeriods: 6,
    isActive: true,
    participants: 4,
    prizeAmount: '20.0',
    status: 'active' as const,
  },
  {
    id: 1,
    name: 'Arisan Kantor区块',
    iuranAmount: '1.0',
    maxParticipants: 4,
    currentPeriod: 1,
    totalPeriods: 4,
    isActive: true,
    participants: 3,
    prizeAmount: '3.0',
    status: 'pending' as const,
  },
  {
    id: 2,
    name: 'Arisan Mabar Sejahtera',
    iuranAmount: '2.5',
    maxParticipants: 5,
    currentPeriod: 4,
    totalPeriods: 5,
    isActive: true,
    participants: 5,
    prizeAmount: '12.5',
    status: 'drawing' as const,
  },
]

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <span className="text-xl font-bold gradient-text">Armon</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hidden sm:flex">Dashboard</Button>
            </Link>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />

        <div className="container mx-auto text-center max-w-4xl relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Decentralized Arisan on Monad</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Arisan On-Chain</span>
            <br />
            <span className="text-white">Trustless & Secure</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Community savings pool dengan collateral 125%. Dapatkan yield dari collateral
            sambil participates dalam arisan tradisional Indonesia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button size="lg" className="w-full sm:w-auto px-8">
                <Plus className="w-5 h-5" />
                Buat Pool Baru
              </Button>
            </Link>
            <a href="#pools">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                Lihat Pool Aktif
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">125%</p>
              <p className="text-slate-400 text-sm mt-1">Collateral Security</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">5%</p>
              <p className="text-slate-400 text-sm mt-1">APY Yield</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">50</p>
              <p className="text-slate-400 text-sm mt-1">Max Participants</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cara Kerja Armon</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Sistem arisan modern yang dijalankan oleh smart contract, tidak ada intermediary.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <StepCard
              number={1}
              icon={<Wallet className="w-6 h-6" />}
              title="Buat Pool"
              description="Tentukan nama, jumlah iuran, dan maksimal peserta."
              color="primary"
            />
            <StepCard
              number={2}
              icon={<Users className="w-6 h-6" />}
              title="Deposit Collateral"
              description="Deposit 125% dari iuran sebagai jaminan keamanan."
              color="secondary"
            />
            <StepCard
              number={3}
              icon={<TrendingUp className="w-6 h-6" />}
              title="Bayar Iuran"
              description="Bayar iuran bulanan dan accrue yield 5% APY."
              color="accent"
            />
            <StepCard
              number={4}
              icon={<Trophy className="w-6 h-6" />}
              title="Dapat Hadiah"
              description="Undian atau voting untuk memilih pemenang."
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* Active Pools */}
      <section id="pools" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold">Pool Aktif</h2>
              <p className="text-slate-400 text-sm mt-1">Bergabung dengan pool arisan yang tersedia</p>
            </div>
            <Link to="/create">
              <Button variant="accent" size="sm">
                <Plus className="w-4 h-4" />
                Buat Pool Baru
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPools.map((pool) => (
              <PoolCardDemo key={pool.id} pool={pool} />
            ))}
          </div>

          {!isConnected && (
            <div className="mt-8 p-6 bg-surface/50 rounded-xl border border-dashed border-slate-700 text-center">
              <p className="text-slate-400 mb-4">Connect wallet untuk membuat pool atau bergabung</p>
              <WalletButton />
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-surface/50 to-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="100% Trustless"
              description="Semua rules dijalankan oleh smart contract. Tidak ada intermediary yang bisa manipulasi hasil."
              color="primary"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="AI Yield Optimization"
              description="Collateral kamu secara otomatis di-deposit ke protocol DeFi dengan yield tertinggi."
              color="secondary"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Community Driven"
              description="Pilih pemenang melalui voting atau random draw. Semuanya transparan di blockchain."
              color="accent"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <span className="font-bold gradient-text">Armon</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-500 text-sm">Built for Monad Blitz Jogja 2026</p>
              <p className="text-slate-600 text-xs mt-1">Decentralized Arisan Protocol</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Components
function StepCard({
  number,
  icon,
  title,
  description,
  color
}: {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  const colors = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  }

  return (
    <div className="relative p-6 bg-surface rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group">
      <div className={`inline-flex p-3 rounded-xl ${colors[color as keyof typeof colors]} mb-4`}>
        {icon}
      </div>
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  const colors = {
    primary: 'from-primary/20 to-primary/5',
    secondary: 'from-secondary/20 to-secondary/5',
    accent: 'from-accent/20 to-accent/5',
  }

  return (
    <div className={`p-8 rounded-2xl bg-gradient-to-br ${colors[color as keyof typeof colors]} border border-slate-800 hover:scale-[1.02] transition-transform`}>
      <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-6 text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}

function PoolCardDemo({ pool }: { pool: typeof mockPools[0] }) {
  const statusColors = {
    active: 'bg-secondary/20 text-secondary border-secondary/30',
    pending: 'bg-accent/20 text-accent border-accent/30',
    drawing: 'bg-primary/20 text-primary border-primary/30',
    completed: 'bg-slate-700/50 text-slate-400 border-slate-700',
  }

  return (
    <Link
      to={`/pool/${pool.id}`}
      className="group block bg-surface rounded-2xl p-6 border border-slate-800 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">
          {pool.name}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[pool.status]}`}>
          {pool.status === 'active' && 'Aktif'}
          {pool.status === 'pending' && 'Menunggu'}
          {pool.status === 'drawing' && 'Undian'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-slate-400 text-xs mb-1">Iuran Bulanan</p>
          <p className="text-lg font-bold text-secondary font-mono">{pool.iuranAmount} MON</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Hadiah</p>
          <p className="text-lg font-bold text-accent font-mono">{pool.prizeAmount} MON</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Peserta</p>
          <p className="text-white font-medium">{pool.participants}/{pool.maxParticipants}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Periode</p>
          <p className="text-white font-medium">{pool.currentPeriod}/{pool.totalPeriods}</p>
        </div>
      </div>

      {/* Participant avatars */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {[...Array(Math.min(pool.participants, 5))].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-primary/20 border-2 border-surface flex items-center justify-center text-xs text-primary font-medium"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          {pool.participants > 5 && (
            <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-surface flex items-center justify-center text-xs text-slate-300">
              +{pool.participants - 5}
            </div>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
            style={{ width: `${(pool.participants / pool.maxParticipants) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1 text-right">{pool.participants} dari {pool.maxParticipants} peserta</p>
      </div>
    </Link>
  )
}