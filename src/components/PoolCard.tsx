import { Link } from 'react-router-dom'
import { cn, truncateAddress } from '@/lib/utils'
import { useArmonPool, useArmonParticipants } from '@/hooks/useArmon'
import { User, Clock, ChevronRight } from 'lucide-react'

interface PoolCardProps {
  poolId: number
  className?: string
}

function formatMON(wei: bigint | undefined): string {
  if (!wei) return '0'
  return (Number(wei) / 1e18).toFixed(4)
}

export function PoolCard({ poolId, className }: PoolCardProps) {
  const { pool, loading: poolLoading } = useArmonPool(poolId)
  const { participants } = useArmonParticipants(poolId)

  if (poolLoading || !pool) {
    return (
      <div className="bg-surface rounded-xl p-4 border border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
      </div>
    )
  }

  const participantCount = Number(pool.participantCount)
  const isFull = participantCount >= Number(pool.maxParticipants)
  const prizeAmount = (Number(pool.iuranAmount) / 1e18) * participantCount

  return (
    <Link
      to={`/pool/${poolId}`}
      className={cn(
        'block bg-surface rounded-xl p-5 border border-slate-700',
        'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10',
        'transition-all duration-200 card-hover',
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-white">{pool.name}</h3>
          <p className="text-sm text-slate-400">Pool #{poolId}</p>
        </div>
        <StatusBadge isActive={pool.isActive} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-slate-400 text-xs mb-1">Iuran Bulanan</p>
          <p className="text-lg font-bold text-secondary font-mono">
            {formatMON(pool.iuranAmount)} MON
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Hadiah</p>
          <p className="text-lg font-bold text-accent font-mono">
            {prizeAmount.toFixed(4)} MON
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Peserta</p>
          <p className="text-white font-medium flex items-center gap-1">
            <User className="w-4 h-4" />
            {participantCount}/{Number(pool.maxParticipants)}
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Periode</p>
          <p className="text-white font-medium flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {Number(pool.currentPeriod)}/{Number(pool.totalPeriods)}
          </p>
        </div>
      </div>

      {/* Participant Avatars */}
      {participants && participants.length > 0 && (
        <div className="flex -space-x-2 mb-3">
          {participants.slice(0, 5).map((p, i) => (
            <div
              key={i}
              className={cn(
                'w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center text-xs font-medium',
                p.hasWon ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
              )}
              title={truncateAddress(p.wallet)}
            >
              {truncateAddress(p.wallet).slice(0, 2).toUpperCase()}
            </div>
          ))}
          {participantCount > 5 && (
            <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-surface flex items-center justify-center text-xs text-slate-300">
              +{participantCount - 5}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Collateral: 125% dari iuran
        </div>
        <div className="flex items-center text-primary text-sm font-medium">
          Detail <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {isFull && (
        <div className="mt-3 px-3 py-1.5 bg-accent/20 rounded-lg text-xs text-accent text-center">
          Pool penuh - maksimal peserta reached
        </div>
      )}
    </Link>
  )
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        'px-2.5 py-1 rounded-full text-xs font-medium',
        isActive
          ? 'bg-secondary/20 text-secondary'
          : 'bg-slate-600/20 text-slate-400'
      )}
    >
      {isActive ? 'Aktif' : 'Selesai'}
    </span>
  )
}
