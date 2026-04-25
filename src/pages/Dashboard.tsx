import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WalletButton } from '@/components/WalletButton'
import { Button } from '@/components/ui/Button'
import { AIChatWidget } from '@/components/AIChatWidget'
import { PoolCard } from '@/components/PoolCard'
import { Pool } from '@/lib/types'
import { COLLATERAL_BPS } from '@/lib/constants'
import { Plus, Trophy, TrendingUp, Wallet } from 'lucide-react'

// Mock user data
const mockMyPools: Pool[] = [
  {
    id: 0,
    name: 'Arisan RT05 Tanah Abang',
    iuranAmount: BigInt('1000000000000000000'),
    maxParticipants: 6,
    collateralBps: COLLATERAL_BPS,
    participants: [
      { wallet: '0x1234567890123456789012345678901234567890', collateralDeposited: BigInt('1250000000000000000'), yieldAccrued: BigInt('5208333333333333'), hasWon: true, paidThisPeriod: false, joinPeriod: 1 },
      { wallet: '0x2345678901234567890123456789012345678901', collateralDeposited: BigInt('1250000000000000000'), yieldAccrued: BigInt('5208333333333333'), hasWon: false, paidThisPeriod: true, joinPeriod: 1 },
      { wallet: '0x3456789012345678901234567890123456789012', collateralDeposited: BigInt('1250000000000000000'), yieldAccrued: BigInt('0'), hasWon: false, paidThisPeriod: true, joinPeriod: 1 },
      { wallet: '0x4567890123456789012345678901234567890123', collateralDeposited: BigInt('1250000000000000000'), yieldAccrued: BigInt('0'), hasWon: false, paidThisPeriod: false, joinPeriod: 1 },
    ],
    currentPeriod: 2,
    totalPeriods: 6,
    isActive: true,
    owner: '0x1234567890123456789012345678901234567890',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    lastDrawAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    accumulatedYield: BigInt('20833333333333333'),
  },
]

// Mock user stats
const userStats = {
  totalCollateral: 1.25, // MON
  yieldAccrued: 0.0052, // MON
  totalWon: 1,
  poolsJoined: 2,
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'joined' | 'yield'>('joined')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Armon" className="w-10 h-10 rounded-xl object-contain" />
            <span className="text-xl font-bold gradient-text">Armon</span>
          </Link>
          <WalletButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-secondary" />
              <span className="text-xs text-slate-400">Total Collateral</span>
            </div>
            <p className="text-xl font-bold text-white font-mono">{userStats.totalCollateral} MON</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs text-slate-400">Yield Accrued</span>
            </div>
            <p className="text-xl font-bold text-primary font-mono">{userStats.yieldAccrued} MON</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-xs text-slate-400">Total Menang</span>
            </div>
            <p className="text-xl font-bold text-accent font-mono">{userStats.totalWon}x</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-400">Pool Diikuti</span>
            </div>
            <p className="text-xl font-bold text-white font-mono">{userStats.poolsJoined}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('joined')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'joined'
                ? 'bg-primary text-white'
                : 'bg-surface text-slate-400 hover:text-white'
            }`}
          >
            Pool Saya
          </button>
          <button
            onClick={() => setActiveTab('yield')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'yield'
                ? 'bg-primary text-white'
                : 'bg-surface text-slate-400 hover:text-white'
            }`}
          >
            AI Yield Optimizer
          </button>
        </div>

        {/* Content */}
        {activeTab === 'joined' ? (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Pool yang Saya Ikuti</h2>
              <Link to="/create">
                <Button variant="accent" size="sm">
                  <Plus className="w-4 h-4" />
                  Buat Pool
                </Button>
              </Link>
            </div>

            {mockMyPools.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockMyPools.map(pool => (
                  <PoolCard key={pool.id} pool={pool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-surface rounded-xl">
                <p className="text-slate-400 mb-4">Belum ikut pool apapun</p>
                <Link to="/">
                  <Button>Browse Pool</Button>
                </Link>
              </div>
            )}

            {/* Transaction History */}
            <div className="mt-8 bg-surface rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold mb-4">Riwayat Transaksi</h2>
              <div className="space-y-3">
                <TransactionRow
                  type="win"
                  description="Menang Arisan RT05"
                  amount="+4 MON"
                  date="25 Mar 2026"
                />
                <TransactionRow
                  type="deposit"
                  description="Deposit Collateral"
                  amount="-1.25 MON"
                  date="20 Mar 2026"
                />
                <TransactionRow
                  type="yield"
                  description="Yield dari MonadFi (12.5% APY)"
                  amount="+0.0052 MON"
                  date="1 Apr 2026"
                />
                <TransactionRow
                  type="deposit"
                  description="Bayar Iuran Bulanan"
                  amount="-1 MON"
                  date="5 Mar 2026"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl">
            <div className="bg-surface rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Yield Optimizer</h3>
                  <p className="text-xs text-slate-400">Kelola collateral untuk yield terbaik</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Optimasi yield untuk collateral Anda di berbagai protocol DeFi ekosistem Monad.
              </p>
              <Link to="/yield-optimizer">
                <Button variant="secondary" className="w-full" leftIcon={<TrendingUp className="w-4 h-4" />}>
                  Buka AI Yield Optimizer
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <AIChatWidget />
    </div>
  )
}

function TransactionRow({
  type,
  description,
  amount,
  date,
}: {
  type: 'win' | 'deposit' | 'yield'
  description: string
  amount: string
  date: string
}) {
  const colors = {
    win: 'text-accent',
    deposit: 'text-slate-300',
    yield: 'text-secondary',
  }

  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          type === 'win' ? 'bg-accent/20' :
          type === 'yield' ? 'bg-secondary/20' :
          'bg-slate-700'
        }`}>
          {type === 'win' && <Trophy className="w-5 h-5 text-accent" />}
          {type === 'yield' && <TrendingUp className="w-5 h-5 text-secondary" />}
          {type === 'deposit' && <Wallet className="w-5 h-5 text-slate-400" />}
        </div>
        <div>
          <p className="text-sm font-medium">{description}</p>
          <p className="text-xs text-slate-500">{date}</p>
        </div>
      </div>
      <span className={`font-mono font-medium ${colors[type]}`}>{amount}</span>
    </div>
  )
}
