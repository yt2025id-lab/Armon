import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { usePoolWithParticipants } from '@/hooks/useArmonContract'
import { useIsParticipant, useParticipants, useWinners } from '@/hooks/useArmonContract'
import { ARMON_ADDRESS } from '@/lib/contracts'
import { formatMON, parseMON } from '@/lib/armonClient'
import { cn, truncateAddress } from '@/lib/utils'
import { ArrowLeft, Clock, Trophy, Wallet, CheckCircle, Users, AlertCircle, RefreshCw, Globe } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { t } from '@/lib/i18n'

export default function PoolDetail() {
  const { id } = useParams()
  const poolId = parseInt(id || '0', 10)
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { lang, setLang } = useLanguage()

  // Get pool data
  const { data: poolData, isLoading: poolLoading, error: poolError } = usePoolWithParticipants(poolId)
  const { data: participantsData } = useParticipants(poolId)
  const { data: winners } = useWinners(poolId)

  const [isJoining, setIsJoining] = useState(false)

  // Validate pool ID
  if (!id || isNaN(poolId) || poolId < 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">{t('pool_invalid_id', lang)}</h2>
          <p className="text-slate-400 mb-6">{t('pool_invalid_id_desc', lang)}</p>
          <Button onClick={() => navigate('/')}>{t('back_to_home', lang)}</Button>
        </div>
      </div>
    )
  }

  // Loading state
  if (poolLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">{t('loading_pool', lang)}</p>
        </div>
      </div>
    )
  }

  // Error state - show mock data for demo or error message
  const handleRetry = () => {
    window.location.reload()
  }

  // Show demo pool for demo purposes when contract not available
  const showDemoPool = poolError || !poolData

  // Demo data
  const demoPool = {
    name: id === '0' ? 'Arisan RT05 Tanah Abang' : `Pool #${poolId}`,
    iuranAmount: parseMON('1'),
    maxParticipants: 6,
    participantCount: 4,
    currentPeriod: 2,
    totalPeriods: 6,
    isActive: true,
    accumulatedYield: parseMON('0.25'),
  }

  const demoParticipants = [
    { wallet: '0x1234567890123456789012345678901234567890', collateralDeposited: parseMON('1.25'), yieldAccrued: parseMON('0.05'), hasWon: true, paidThisPeriod: false, joinPeriod: 1 },
    { wallet: '0x2345678901234567890123456789012345678901', collateralDeposited: parseMON('1.25'), yieldAccrued: parseMON('0.05'), hasWon: false, paidThisPeriod: true, joinPeriod: 1 },
    { wallet: '0x3456789012345678901234567890123456789012', collateralDeposited: parseMON('1.25'), yieldAccrued: parseMON('0'), hasWon: false, paidThisPeriod: true, joinPeriod: 1 },
    { wallet: '0x4567890123456789012345678901234567890123', collateralDeposited: parseMON('1.25'), yieldAccrued: parseMON('0'), hasWon: false, paidThisPeriod: false, joinPeriod: 1 },
  ]

  const pool = poolData?.pool || demoPool
  const participants = poolData?.participants || demoParticipants
  const winnersList = poolData?.winners || []

  const collateralRequired = (Number(pool.iuranAmount) / 1e18) * 1.25
  const prizeAmount = (Number(pool.iuranAmount) / 1e18) * Number(pool.participantCount)
  const currentPeriod = Number(pool.currentPeriod)
  const totalPeriods = Number(pool.totalPeriods)
  const participantCount = Number(pool.participantCount)
  const isFull = participantCount >= Number(pool.maxParticipants)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-surface rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="font-semibold text-white">{pool.name}</h1>
              <p className="text-sm text-slate-400">
                {t('pool_id', lang)} #{poolId}
                {showDemoPool && <span className="ml-2 text-xs text-accent">({t('demo_mode', lang)})</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg border border-slate-700 hover:border-primary/50 transition-colors"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium">{lang === 'id' ? 'EN' : 'ID'}</span>
            </button>
            <div className="text-sm text-slate-400 font-mono">
              {address ? truncateAddress(address) : t('not_connected', lang)}
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {showDemoPool && (
        <div className="bg-accent/10 border-b border-accent/20 py-3 px-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-accent">
              <AlertCircle className="w-4 h-4" />
              <span>{t('demo_mode_notice', lang)}</span>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 text-sm text-accent hover:underline"
            >
              <RefreshCw className="w-4 h-4" />
              {t('retry', lang)}
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pool Info Card */}
            <div className="bg-surface rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold mb-4">{t('pool_info', lang)}</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">{t('monthly_fee', lang)}</p>
                  <p className="text-xl font-bold text-secondary font-mono">
                    {formatMON(pool.iuranAmount)} MON
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">{t('period', lang)}</p>
                  <p className="text-xl font-bold text-white">
                    {currentPeriod}/{totalPeriods}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">{t('participants', lang)}</p>
                  <p className="text-xl font-bold text-white flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {participantCount}/{Number(pool.maxParticipants)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">{t('pool_progress', lang)}</span>
                  <span className="text-white">{Math.round((currentPeriod / totalPeriods) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${(currentPeriod / totalPeriods) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-surface rounded-xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{t('participants', lang)}</h2>
                <span className="text-sm text-slate-400">
                  {participantCount} {t('of', lang)} {Number(pool.maxParticipants)}
                </span>
              </div>
              {participants && participants.length > 0 ? (
                <div className="grid gap-3">
                  {participants.map((p: any, i: number) => (
                    <ParticipantRow
                      key={i}
                      participant={p}
                      isWinner={winnersList.includes(p.wallet)}
                      isCurrentUser={address?.toLowerCase() === p.wallet.toLowerCase()}
                      lang={lang}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">{t('no_participants', lang)}</p>
              )}
            </div>

            {/* Winners */}
            {winnersList.length > 0 && (
              <div className="bg-surface rounded-xl p-6 border border-slate-700">
                <h2 className="text-lg font-semibold mb-4">{t('winners', lang)}</h2>
                <div className="space-y-2">
                  {winnersList.map((winner: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                      <Trophy className="w-5 h-5 text-accent" />
                      <span className="font-mono text-sm">{truncateAddress(winner)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Card */}
            {!isFull && (
              <div className="bg-surface rounded-xl p-6 border border-slate-700 sticky top-24">
                <h3 className="font-semibold mb-4">{t('join_pool', lang)}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{t('collateral', lang)}</span>
                    <span className="text-white font-mono">{collateralRequired.toFixed(4)} MON</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{t('yield_apy', lang)}</span>
                    <span className="text-secondary font-mono">+{(collateralRequired * 0.05).toFixed(4)} MON/{t('year', lang)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 flex justify-between text-sm">
                    <span className="text-slate-400">{t('total_deposit', lang)}</span>
                    <span className="text-primary font-bold font-mono">{collateralRequired.toFixed(4)} MON</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!isConnected || isJoining}
                  onClick={() => setIsJoining(true)}
                  leftIcon={<Wallet className="w-5 h-5" />}
                >
                  {isJoining ? t('joining', lang) : t('join_pool', lang)}
                </Button>
                <p className="text-xs text-slate-500 mt-3 text-center">
                  {t('collateral_note', lang)}
                </p>
              </div>
            )}

            {isFull && (
              <div className="bg-surface rounded-xl p-6 border border-slate-700">
                <div className="text-center">
                  <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400">{t('pool_full', lang)}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-surface rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-4">{t('progress', lang)}</h3>
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
                          {t('period', lang)} {period}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isCompleted ? t('completed', lang) : isCurrent ? t('in_progress', lang) : t('not_started', lang)}
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
    </div>
  )
}

function ParticipantRow({
  participant,
  isWinner,
  isCurrentUser,
  lang
}: {
  participant: any
  isWinner: boolean
  isCurrentUser: boolean
  lang: 'id' | 'en'
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
          {participant.wallet ? participant.wallet.slice(2, 4).toUpperCase() : '??'}
        </div>
        <div>
          <p className="font-mono text-sm">{truncateAddress(participant.wallet)}</p>
          {isCurrentUser && (
            <p className="text-xs text-primary">{t('you', lang)}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isWinner && (
          <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full font-medium">
            {t('winner', lang)}!
          </span>
        )}
        {participant.paidThisPeriod && !isWinner && (
          <CheckCircle className="w-5 h-5 text-secondary" />
        )}
      </div>
    </div>
  )
}