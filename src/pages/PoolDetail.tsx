import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { AIChatWidget } from '@/components/AIChatWidget'
import { useArmonPool, useArmonParticipants, useArmonWinners, useJoinPoolWrite, usePayIuranWrite, formatMON } from '@/hooks/useArmon'
import { isParticipant } from '@/lib/armonClient'
import { ArrowLeft, Clock, Trophy, Wallet, CheckCircle, Users, AlertCircle } from 'lucide-react'
import { cn, truncateAddress } from '@/lib/utils'

export default function PoolDetail() {
  const { id } = useParams()
  const poolId = parseInt(id || '0')
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { pool, loading, error } = useArmonPool(poolId)
  const { participants } = useArmonParticipants(poolId)
  const { winners } = useArmonWinners(poolId)
  const { write: joinPool, isLoading: isJoining, isSuccess: joinSuccess } = useJoinPoolWrite(poolId, '1.25')
  const { write: payIuran, isLoading: isPaying } = usePayIuranWrite(poolId, pool ? (Number(pool.iuranAmount) / 1e18).toString() : '1')

  const [isUserParticipant, setIsUserParticipant] = useState(false)

  useEffect(() => {
    if (address && poolId) {
      isParticipant(poolId, address).then(setIsUserParticipant)
    }
  }, [address, poolId])

  if (!poolId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-slate-400">Invalid pool ID</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading pool...</div>
      </div>
    )
  }

  if (error || !pool) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-400">Gagal memuat pool</p>
          <p className="text-sm text-slate-500">{error || 'Pool tidak ditemukan'}</p>
        </div>
      </div>
    )
  }

  const collateralRequired = (Number(pool.iuranAmount) / 1e18) * 1.25
  const prizeAmount = (Number(pool.iuranAmount) / 1e18) * Number(pool.participantCount)
  const currentPeriod = Number(pool.currentPeriod)
  const totalPeriods = Number(pool.totalPeriods)
  const participantCount = Number(pool.participantCount)
  const isFull = participantCount >= Number(pool.maxParticipants)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-surface rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="font-semibold text-white">{pool.name}</h1>
              <p className="text-sm text-slate-400">Pool #{poolId}</p>
            </div>
          </div>
          <div className="text-sm text-slate-400 font-mono">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pool Info Card */}
            <div className="bg-surface rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold mb-4">Informasi Pool</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Iuran Bulanan</p>
                  <p className="text-xl font-bold text-secondary font-mono">
                    {formatMON(pool.iuranAmount)} MON
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Periode</p>
                  <p className="text-xl font-bold text-white">
                    {currentPeriod}/{totalPeriods}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Peserta</p>
                  <p className="text-xl font-bold text-white flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {participantCount}/{Number(pool.maxParticipants)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Hadiah</p>
                  <p className="text-xl font-bold text-accent font-mono">
                    {prizeAmount.toFixed(4)} MON
                  </p>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-surface rounded-xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Peserta</h2>
                <span className="text-sm text-slate-400">
                  {participantCount} of {Number(pool.maxParticipants)}
                </span>
              </div>
              {participants && participants.length > 0 ? (
                <div className="grid gap-3">
                  {participants.map((p: any, i: number) => (
                    <ParticipantRow
                      key={i}
                      participant={p}
                      isWinner={winners.includes(p.wallet)}
                      isCurrentUser={address?.toLowerCase() === p.wallet.toLowerCase()}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">Belum ada peserta</p>
              )}
            </div>

            {/* Winners */}
            {winners.length > 0 && (
              <div className="bg-surface rounded-xl p-6 border border-slate-700">
                <h2 className="text-lg font-semibold mb-4">Pemenang</h2>
                <div className="space-y-2">
                  {winners.map((winner, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                      <Trophy className="w-5 h-5 text-accent" />
                      <span className="font-mono text-sm">{truncateAddress(winner)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons (for participants) */}
            {isUserParticipant && (
              <div className="bg-surface rounded-xl p-6 border border-slate-700">
                <h2 className="text-lg font-semibold mb-4">Aksi</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={isPaying}
                    onClick={() => payIuran()}
                  >
                    <Wallet className="w-5 h-5" />
                    {isPaying ? 'Processing...' : 'Bayar Iuran'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled={!isConnected}
                    onClick={() => {
                      // Draw winner logic
                    }}
                  >
                    <Trophy className="w-5 h-5" />
                    Draw Winner
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Card */}
            {!isUserParticipant && !isFull && (
              <div className="bg-surface rounded-xl p-6 border border-slate-700 sticky top-6">
                <h3 className="font-semibold mb-4">Ikut Arisan</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Collateral</span>
                    <span className="text-white font-mono">{collateralRequired.toFixed(4)} MON</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Yield (5% APY)</span>
                    <span className="text-secondary font-mono">+{(collateralRequired * 0.05).toFixed(4)} MON/tahun</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 flex justify-between text-sm">
                    <span className="text-slate-400">Total Deposit</span>
                    <span className="text-accent font-bold font-mono">{collateralRequired.toFixed(4)} MON</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!isConnected || isJoining}
                  onClick={() => joinPool()}
                >
                  <Wallet className="w-5 h-5" />
                  {isJoining ? 'Joining...' : joinSuccess ? 'Joined!' : 'Join Pool'}
                </Button>
                <p className="text-xs text-slate-500 mt-3 text-center">
                  Collateral 125% dikembalikan di akhir arisan
                </p>
              </div>
            )}

            {isFull && (
              <div className="bg-surface rounded-xl p-6 border border-slate-700">
                <div className="text-center">
                  <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400">Pool sudah penuh</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-surface rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-4">Progress</h3>
              <div className="space-y-4">
                {Array.from({ length: totalPeriods }, (_, i) => i + 1).map((period) => {
                  const isCompleted = period < currentPeriod
                  const isCurrent = period === currentPeriod
                  return (
                    <div key={period} className="flex gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        isCompleted ? 'bg-secondary/20' :
                        isCurrent ? 'bg-accent/20' :
                        'bg-slate-700'
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-secondary" />
                        ) : isCurrent ? (
                          <Clock className="w-4 h-4 text-accent" />
                        ) : (
                          <span className="text-xs text-slate-400">{period}</span>
                        )}
                      </div>
                      <div>
                        <p className={cn(
                          'text-sm font-medium',
                          isCompleted || isCurrent ? 'text-white' : 'text-slate-400'
                        )}>
                          Periode {period}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isCompleted ? 'Selesai' : isCurrent ? 'Berlangsung' : 'Belum dimulai'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIChatWidget />
    </div>
  )
}

function ParticipantRow({
  participant,
  isWinner,
  isCurrentUser
}: {
  participant: any
  isWinner: boolean
  isCurrentUser: boolean
}) {
  return (
    <div className={cn(
      'flex items-center justify-between p-3 bg-background rounded-lg',
      isCurrentUser && 'ring-2 ring-primary'
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm',
          isWinner ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
        )}>
          {participant.wallet.slice(2, 4).toUpperCase()}
        </div>
        <div>
          <p className="font-mono text-sm">{truncateAddress(participant.wallet)}</p>
          {isCurrentUser && (
            <p className="text-xs text-primary">Kamu</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isWinner && (
          <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full font-medium">
            Winner!
          </span>
        )}
        {participant.paidThisPeriod && !isWinner && (
          <CheckCircle className="w-5 h-5 text-secondary" />
        )}
      </div>
    </div>
  )
}