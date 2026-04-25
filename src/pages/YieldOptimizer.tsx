import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { WalletButton } from '@/components/WalletButton'
import {
  MONAD_YIELD_PROTOCOLS,
  getTopProtocols,
  getProtocolsByRisk,
  getSafeProtocols,
  calculateProtocolYield,
  compareProtocols,
  type YieldProtocol,
} from '@/lib/yieldData'
import { formatMON } from '@/lib/armonClient'
import {
  TrendingUp,
  Shield,
  AlertTriangle,
  ArrowLeft,
  Wallet,
  Sparkles,
  BarChart3,
  ChevronRight,
  RefreshCw,
  Info,
  CheckCircle,
  ExternalLink,
  Target,
  Percent,
} from 'lucide-react'

export default function YieldOptimizerPage() {
  const { isConnected } = useAccount()
  const [collateralAmount, setCollateralAmount] = useState('10')
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'apy' | 'tvl' | 'risk'>('apy')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState<YieldProtocol | null>(null)

  const amount = parseFloat(collateralAmount) || 0

  // Filter protocols
  const filteredProtocols = useMemo(() => {
    let filtered = [...MONAD_YIELD_PROTOCOLS]

    // Filter by risk
    if (riskFilter !== 'all') {
      filtered = filtered.filter(p => p.risk === riskFilter)
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === typeFilter)
    }

    // Sort
    if (sortBy === 'apy') {
      filtered.sort((a, b) => b.apy - a.apy)
    } else if (sortBy === 'tvl') {
      filtered.sort((a, b) => parseFloat(b.tvl.replace('$', '').replace('M', '')) -
                         parseFloat(a.tvl.replace('$', '').replace('M', '')))
    }

    return filtered
  }, [riskFilter, typeFilter, sortBy])

  // Top recommendations
  const topLowRisk = useMemo(() => getSafeProtocols().slice(0, 3), [])
  const topOverall = useMemo(() => getTopProtocols(5), [])

  // Selected protocol comparison
  const selectedComparison = useMemo(() => {
    if (!selectedProtocol) return null
    return compareProtocols(amount, [selectedProtocol, ...getTopProtocols(3)])[0]
  }, [amount, selectedProtocol])

  // Analyze button
  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      // Auto-select best protocol
      setSelectedProtocol(filteredProtocols[0])
    }, 1500)
  }

  // Get unique types
  const protocolTypes = useMemo(() => {
    return ['all', ...new Set(MONAD_YIELD_PROTOCOLS.map(p => p.type))]
  }, [])

  // Risk color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-secondary/20 text-secondary border-secondary/30'
      case 'medium': return 'bg-accent/20 text-accent border-accent/30'
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-700 text-slate-400'
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low': return 'Rendah'
      case 'medium': return 'Sedang'
      case 'high': return 'Tinggi'
      default: return risk
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-surface rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">AI Yield Optimizer</h1>
                <p className="text-sm text-slate-400">Ekosistem Monad</p>
              </div>
            </div>
          </div>
          <WalletButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-secondary/20 via-primary/10 to-accent/20 rounded-2xl p-8 mb-8 border border-slate-800">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-secondary" />
              <span className="text-sm text-secondary font-medium">AI-Powered Optimization</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Maksimalkan Yield dari Collateral Anda
            </h2>
            <p className="text-slate-400 mb-6">
              AI secara otomatis menganalisis protocol DeFi di ekosistem Monad dan merekomendasikan
              yield tertinggi berdasarkan risk preference Anda.
            </p>

            {/* Collateral Input */}
            <div className="bg-surface/50 rounded-xl p-4">
              <label className="block text-sm text-slate-400 mb-2">
                Jumlah Collateral untuk Dihitung Yield
              </label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-slate-600 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-primary"
                    placeholder="10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    MON
                  </span>
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || amount <= 0}
                  leftIcon={isAnalyzing ? undefined : <Sparkles className="w-5 h-5" />}
                  size="lg"
                >
                  {isAnalyzing ? 'Menganalisis...' : 'Analisis AI'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {amount > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Best APY"
              value={`${topOverall[0]?.apy}%`}
              subtext={topOverall[0]?.name}
              icon={<TrendingUp className="w-5 h-5" />}
              color="secondary"
            />
            <StatCard
              label="Yield Bulanan"
              value={`${(amount * topOverall[0].apy / 100 / 12).toFixed(4)} MON`}
              subtext={`@ ${topOverall[0].apy}% APY`}
              icon={<Percent className="w-5 h-5" />}
              color="primary"
            />
            <StatCard
              label="Yield Tahunan"
              value={`${(amount * topOverall[0].apy / 100).toFixed(4)} MON`}
              subtext="Estimasi 1 tahun"
              icon={<BarChart3 className="w-5 h-5" />}
              color="accent"
            />
            <StatCard
              label="Protocol Tersedia"
              value={`${MONAD_YIELD_PROTOCOLS.length}`}
              subtext="Yield opportunity"
              icon={<CheckCircle className="w-5 h-5" />}
              color="primary"
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Filters & List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-surface rounded-2xl p-6 border border-slate-800">
              <h3 className="font-semibold text-white mb-4">Filter Protocol</h3>

              {/* Risk Filter */}
              <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-2">Tingkat Risiko</label>
                <div className="flex gap-2">
                  {(['all', 'low', 'medium', 'high'] as const).map(risk => (
                    <button
                      key={risk}
                      onClick={() => setRiskFilter(risk)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        riskFilter === risk
                          ? risk === 'low' ? 'bg-secondary text-white'
                          : risk === 'medium' ? 'bg-accent text-white'
                          : risk === 'high' ? 'bg-red-500 text-white'
                          : 'bg-primary text-white'
                          : 'bg-background text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {risk === 'all' ? 'Semua' : getRiskLabel(risk)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-2">Jenis Protocol</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  {protocolTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'Semua Jenis' : type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Urutkan</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'apy' | 'tvl' | 'risk')}
                  className="w-full px-4 py-2 bg-background border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  <option value="apy">APY Tertinggi</option>
                  <option value="tvl">TVL Terbesar</option>
                  <option value="risk">Risiko Terendah</option>
                </select>
              </div>
            </div>

            {/* Protocol List */}
            <div className="bg-surface rounded-2xl p-6 border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">
                  Protocol Yield ({filteredProtocols.length})
                </h3>
              </div>

              <div className="space-y-3">
                {filteredProtocols.map((protocol) => (
                  <ProtocolCard
                    key={protocol.protocol}
                    protocol={protocol}
                    amount={amount}
                    isSelected={selectedProtocol?.protocol === protocol.protocol}
                    onSelect={() => setSelectedProtocol(protocol)}
                    riskColor={getRiskColor(protocol.risk)}
                    riskLabel={getRiskLabel(protocol.risk)}
                  />
                ))}
              </div>

              {filteredProtocols.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  Tidak ada protocol yang sesuai filter
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Selected Protocol Detail */}
            {selectedProtocol ? (
              <div className="bg-surface rounded-2xl p-6 border border-slate-800 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Detail Protocol</h3>
                    <p className="text-xs text-slate-400">Yield projection</p>
                  </div>
                </div>

                {/* Protocol Header */}
                <div className="bg-background rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-white">{selectedProtocol.name}</h4>
                      <p className="text-sm text-slate-400">{selectedProtocol.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(selectedProtocol.risk)}`}>
                      {getRiskLabel(selectedProtocol.risk)}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-secondary font-mono">
                    {selectedProtocol.apy}%
                    <span className="text-sm text-slate-400 font-normal ml-2">APY</span>
                  </div>
                </div>

                {/* Yield Projections */}
                {amount > 0 && (
                  <div className="bg-background rounded-xl p-4 mb-4">
                    <h5 className="text-sm text-slate-400 mb-3">Estimasi Yield untuk {amount} MON</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Per Bulan</span>
                        <span className="text-white font-mono">
                          {(amount * selectedProtocol.apy / 100 / 12).toFixed(4)} MON
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Per 3 Bulan</span>
                        <span className="text-white font-mono">
                          {(amount * Math.pow(1 + selectedProtocol.apy / 100 / 12, 3) - amount).toFixed(4)} MON
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Per 6 Bulan</span>
                        <span className="text-secondary font-mono">
                          {(amount * Math.pow(1 + selectedProtocol.apy / 100 / 12, 6) - amount).toFixed(4)} MON
                        </span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-slate-700 pt-2">
                        <span className="text-slate-300 font-medium">Per Tahun</span>
                        <span className="text-accent font-bold font-mono">
                          {(amount * selectedProtocol.apy / 100).toFixed(4)} MON
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Protocol Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">TVL</span>
                    <span className="text-white font-mono">{selectedProtocol.tvl}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">APY Range</span>
                    <span className="text-white font-mono">{selectedProtocol.apyRange}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Min. Deposit</span>
                    <span className="text-white font-mono">{selectedProtocol.minDeposit}</span>
                  </div>
                  {selectedProtocol.lockPeriod && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Lock Period</span>
                      <span className="text-white">{selectedProtocol.lockPeriod}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h5 className="text-sm text-slate-400 mb-2">Fitur</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedProtocol.features.map((feature, i) => (
                      <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4">{selectedProtocol.description}</p>

                {/* Actions */}
                <div className="space-y-2">
                  <Button className="w-full" variant="primary">
                    Park Collateral di {selectedProtocol.name}
                  </Button>
                  {selectedProtocol.website && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      rightIcon={<ExternalLink className="w-4 h-4" />}
                      onClick={() => window.open(selectedProtocol.website, '_blank')}
                    >
                      Kunjungi Website
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-surface rounded-2xl p-6 border border-slate-800 sticky top-24">
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">Pilih Protocol</h3>
                  <p className="text-sm text-slate-400">
                    Pilih protocol di sebelah kiri untuk melihat detail dan yield projection
                  </p>
                </div>
              </div>
            )}

            {/* Top Low Risk Recommendations */}
            {topLowRisk.length > 0 && (
              <div className="bg-surface rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold text-white">Rekomendasi Aman</h3>
                </div>
                <div className="space-y-3">
                  {topLowRisk.map((protocol) => (
                    <div
                      key={protocol.protocol}
                      className="bg-background rounded-lg p-3 border border-slate-700 hover:border-secondary/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedProtocol(protocol)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white text-sm">{protocol.name}</p>
                          <p className="text-xs text-slate-500">{protocol.type}</p>
                        </div>
                        <span className="text-secondary font-bold">{protocol.apy}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-white mb-1">AI Yield Optimizer</p>
                  <p>
                    AI secara otomatis memonitor dan menganalisis yield dari berbagai protocol.
                    Rekomendasi didasarkan pada APY, risk level, dan TVL.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({
  label,
  value,
  subtext,
  icon,
  color
}: {
  label: string
  value: string
  subtext: string
  icon: React.ReactNode
  color: string
}) {
  const colorClasses = {
    secondary: 'bg-secondary/20 text-secondary',
    primary: 'bg-primary/20 text-primary',
    accent: 'bg-accent/20 text-accent',
  }

  return (
    <div className="bg-surface rounded-xl p-4 border border-slate-800">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white font-mono">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-xs text-slate-500">{subtext}</p>
    </div>
  )
}

// Protocol Card Component
function ProtocolCard({
  protocol,
  amount,
  isSelected,
  onSelect,
  riskColor,
  riskLabel,
}: {
  protocol: YieldProtocol
  amount: number
  isSelected: boolean
  onSelect: () => void
  riskColor: string
  riskLabel: string
}) {
  const monthlyYield = amount > 0 ? (amount * protocol.apy / 100 / 12).toFixed(4) : '-'

  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border transition-all text-left ${
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-slate-700 bg-background hover:border-slate-600'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            protocol.risk === 'low' ? 'bg-secondary/20 text-secondary' :
            protocol.risk === 'medium' ? 'bg-accent/20 text-accent' :
            'bg-red-500/20 text-red-400'
          }`}>
            {protocol.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-white">{protocol.name}</h4>
            <p className="text-xs text-slate-400">{protocol.type}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-secondary font-mono">{protocol.apy}%</p>
          <span className={`px-2 py-0.5 rounded-full text-xs border ${riskColor}`}>
            {riskLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-surface/50 rounded-lg p-2 text-center">
          <p className="text-slate-500">TVL</p>
          <p className="text-white font-medium">{protocol.tvl}</p>
        </div>
        <div className="bg-surface/50 rounded-lg p-2 text-center">
          <p className="text-slate-500">Min.</p>
          <p className="text-white font-medium">{protocol.minDeposit}</p>
        </div>
        <div className="bg-surface/50 rounded-lg p-2 text-center">
          <p className="text-slate-500">Yield/Bulan</p>
          <p className="text-secondary font-medium">{monthlyYield}</p>
        </div>
      </div>
    </button>
  )
}