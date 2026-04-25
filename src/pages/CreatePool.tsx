import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useConnect } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { AIChatWidget } from '@/components/AIChatWidget'
import { useCreatePoolWrite } from '@/hooks/useArmon'
import { ArrowLeft, Info, Wallet, AlertCircle, CheckCircle } from 'lucide-react'

export default function CreatePool() {
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { write, isLoading, isSuccess, error } = useCreatePoolWrite()

  const [poolName, setPoolName] = useState('')
  const [iuranAmount, setIuranAmount] = useState('1')
  const [maxParticipants, setMaxParticipants] = useState(4)
  const [totalPeriods, setTotalPeriods] = useState(6)

  const collateralRequired = parseFloat(iuranAmount) * 1.25
  const prizePerWinner = parseFloat(iuranAmount) * maxParticipants

  const handleCreatePool = async () => {
    if (!poolName) return
    await write(poolName, iuranAmount, maxParticipants, totalPeriods)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 bg-surface rounded-xl border border-slate-700 max-w-md">
          <Wallet className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Connect Wallet</h2>
          <p className="text-slate-400 mb-6">Kamu perlu connect wallet dulu untuk membuat pool.</p>
          <div className="space-y-2">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                variant="primary"
                className="w-full"
                onClick={() => connect({ connector })}
                disabled={isPending}
              >
                {isPending ? 'Connecting...' : `Connect ${connector.name}`}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-surface rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <span className="text-lg font-semibold text-white">Buat Pool Baru</span>
          </div>
          <div className="text-sm text-slate-400 font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-surface rounded-xl p-6 border border-slate-700">
          {/* Pool Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nama Pool
            </label>
            <input
              type="text"
              value={poolName}
              onChange={(e) => setPoolName(e.target.value)}
              placeholder="Contoh: Arisan RT05 Tanah Abang"
              className="w-full px-4 py-3 bg-background border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Iuran Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Iuran Bulanan (MON)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={iuranAmount}
                onChange={(e) => setIuranAmount(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-slate-600 rounded-lg text-white font-mono focus:outline-none focus:border-primary"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                MON
              </span>
            </div>
          </div>

          {/* Max Participants */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Maksimal Peserta (3-50)
            </label>
            <select
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              {[3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50].map(n => (
                <option key={n} value={n}>{n} peserta</option>
              ))}
            </select>
          </div>

          {/* Total Periods */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Total Periode (Bulan)
            </label>
            <select
              value={totalPeriods}
              onChange={(e) => setTotalPeriods(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                <option key={n} value={n}>{n} bulan</option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="bg-background rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Preview Pool</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Collateral per peserta</p>
                <p className="text-lg font-bold text-secondary font-mono">
                  {collateralRequired.toFixed(4)} MON
                </p>
              </div>
              <div>
                <p className="text-slate-400">Hadiah per winner</p>
                <p className="text-lg font-bold text-accent font-mono">
                  {prizePerWinner.toFixed(4)} MON
                </p>
              </div>
              <div>
                <p className="text-slate-400">Durasi</p>
                <p className="text-lg font-bold text-white">
                  {totalPeriods} bulan
                </p>
              </div>
              <div>
                <p className="text-slate-400">Total Pool Value</p>
                <p className="text-lg font-bold text-primary font-mono">
                  {(prizePerWinner * totalPeriods).toFixed(4)} MON
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="mb-2">
                  <strong className="text-white">Collateral 125%</strong> - Setiap peserta deposit collateral sejumlah 125% dari iuran bulanan.
                </p>
                <p>
                  Collateral dikembalikan beserta yield setelah arisan selesai atau setelah peserta mendapat giliran.
                </p>
              </div>
            </div>
          </div>

          {/* Deploy Button */}
          <Button
            onClick={handleCreatePool}
            disabled={!poolName || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Creating...' : isSuccess ? 'Pool Created!' : 'Create Pool'}
          </Button>

          {isSuccess && (
            <div className="mt-4 p-4 bg-secondary/20 border border-secondary/30 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span className="text-secondary font-medium">Pool berhasil dibuat!</span>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Error: {error}</span>
            </div>
          )}
        </div>
      </div>

      <AIChatWidget />
    </div>
  )
}
