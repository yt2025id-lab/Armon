import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { WalletButton } from '@/components/WalletButton'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { t } from '@/lib/i18n'
import {
  Plus,
  Users,
  TrendingUp,
  Shield,
  Wallet,
  Sparkles,
  ChevronRight,
  Globe,
  Trophy,
  ArrowUpRight,
  Move,
} from 'lucide-react'

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
  const { lang, setLang } = useLanguage()
  const [offsetY, setOffsetY] = useState(0)

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header - Fixed */}
      <header className="fixed w-full top-0 z-50 px-6 md:px-12 lg:px-15 py-4 md:py-5 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <img src="/logo.png" alt="Armon" className="w-10 h-10 rounded-xl object-contain" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f8672d] rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold text-white">ARMON</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-white/70 hover:text-white">
                {t('dashboard', lang)}
              </Button>
            </Link>
            <Link to="/yield-optimizer">
              <Button variant="accent" size="sm">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">{t('ai_yield', lang)}</span>
              </Button>
            </Link>
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 hover:border-[#f8672d]/50 transition-colors"
            >
              <Globe className="w-4 h-4 text-white/50" />
              <span className="text-sm font-medium text-white">{lang === 'id' ? 'EN' : 'ID'}</span>
            </button>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full flex flex-col gap-16 lg:gap-15 px-6 md:px-12 lg:px-15 py-10 relative min-h-screen justify-center overflow-hidden">
        {/* Background Character Image - Full width with blur */}
        <div
          className="absolute inset-0 z-[-1]"
          style={{ transform: `translateY(${offsetY * 0.3}px)` }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80)',
              filter: 'blur(8px) brightness(0.4)',
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/40 to-[#0a0a0a]" />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0 relative w-full">
          <div className="w-full lg:w-[60%] flex justify-center lg:justify-start">
            <h1 className="text-[80px] md:text-[120px] lg:text-[180px] leading-none text-white font-bold scale-y-[1.5] lg:scale-y-[2] tracking-[-0.05em] lg:tracking-[-0.1em] whitespace-nowrap mt-10 lg:mt-0">
              ARISAN
            </h1>
          </div>

          <div className="w-full md:w-[80%] lg:w-[40%] text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="text-lg md:text-2xl lg:text-3xl text-white tracking-tighter">
              {t('hero_description', lang)}
            </p>
            <WalletButton />
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-0 relative mt-10 lg:mt-0 w-full">
          <div className="w-full md:w-[80%] lg:w-[40%] flex flex-col gap-6 text-center lg:text-left">
            {/* Orange decorative lines */}
            <div className="w-full h-[80px] md:h-[120px] lg:h-[150px] object-cover rounded-xl lg:rounded-none overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-[#f8672d] via-[#ff8c42] to-[#f8672d] opacity-80" />
            </div>
            <p className="text-lg md:text-2xl lg:text-3xl text-white tracking-tighter">
              {lang === 'id'
                ? 'Jutaan orang Indonesia sudah paham arisan. Sekarang dengan yield dan smart contract.'
                : 'Millions of Indonesians understand arisan. Now with yield and smart contracts.'}
            </p>
          </div>

          <div className="w-full lg:w-[60%] flex justify-center lg:justify-end">
            <h1 className="text-[60px] md:text-[120px] lg:text-[180px] leading-none text-white lg:text-right font-black scale-y-[1.5] lg:scale-y-[2] tracking-[-0.05em] lg:tracking-[-0.1em] whitespace-nowrap">
              MONAD
            </h1>
          </div>
        </div>
      </section>

      {/* Stripe Marquee */}
      <StripeMarquee lang={lang} className="transform lg:rotate-3 translate-y-[-20%] lg:translate-x-[-5%]" />

      {/* Mission Section - Orange Background */}
      <section className="w-full min-h-screen flex md:items-center lg:items-start bg-[#f8672d] relative z-[2] overflow-visible">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#222222] border-[8px] md:border-[12px] border-[#f8672d] flex items-center justify-center">
            <ChevronRight
              className="w-8 h-8 md:w-10 md:h-10 text-[#f8672d] rotate-90"
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* Card Best Offer - positioned on the right side */}
        <CardBestOffer lang={lang} />

        <div className="pt-28 md:pt-35 pb-20 px-6 md:px-15 flex flex-col gap-6 md:gap-10 relative h-full justify-center">
          <h1 className="text-[40px] lg:text-[90px] leading-[0.85] lg:leading-none text-white font-bold scale-y-[1.2] md:scale-y-[1.5] lg:scale-y-[2.5] tracking-[-0.03em] lg:tracking-[-0.08em] origin-top-left lg:origin-center mb-8 md:mb-16 whitespace-normal lg:whitespace-nowrap">
            {lang === 'id' ? 'MASA DEPAN ARISAN' : "THE FUTURE OF ARISAN"}
          </h1>

          <p className="w-full md:w-[80%] lg:w-1/2 text-lg md:text-xl lg:text-2xl text-white tracking-tighter">
            {lang === 'id'
              ? 'Komunitas tabungan tradisional Indonesia sekarang ada di blockchain. Transparan, aman, dan menghasilkan yield.'
              : 'Traditional Indonesian community savings is now on the blockchain. Transparent, secure, and earning yield.'}
          </p>

          <Link to="/create">
            <Button className="w-fit mt-4 px-8 md:px-10 h-12 md:h-14 lg:h-15 text-white text-base md:text-lg lg:text-xl font-semibold rounded-full bg-transparent border-2 border-white hover:bg-white hover:text-black transition-colors">
              {t('create_pool_btn', lang)}
            </Button>
          </Link>
        </div>
      </section>

      {/* Stripe Marquee 2 */}
      <StripeMarquee lang={lang} className="transform lg:-rotate-3 translate-y-[-20%] lg:translate-x-[-5%]" />

      {/* How it Works */}
      <section id="pools" className="py-20 lg:py-32 px-6 md:px-12 lg:px-15">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
          <div className="w-full lg:w-1/2">
            <h2 className="text-[70px] sm:text-[80px] md:text-[100px] lg:text-[130px] leading-[0.8] text-white font-bold scale-y-[1.3] lg:scale-y-[2] tracking-[-0.05em] lg:tracking-[-0.1em] origin-top mb-4">
              {lang === 'id' ? 'CARA KERJA' : 'HOW IT'}
            </h2>
            <h2 className="text-[70px] sm:text-[80px] md:text-[100px] lg:text-[130px] leading-[0.8] text-[#f8672d] font-bold scale-y-[1.3] lg:scale-y-[2] tracking-[-0.05em] lg:tracking-[-0.1em] origin-top">
              {lang === 'id' ? 'ARMON' : 'WORKS'}
            </h2>
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 lg:gap-6">
            <StepCard
              number={1}
              icon={<Wallet className="w-6 h-6" />}
              title={t('step_1_title', lang)}
              description={t('step_1_desc', lang)}
              color="primary"
            />
            <StepCard
              number={2}
              icon={<Users className="w-6 h-6" />}
              title={t('step_2_title', lang)}
              description={t('step_2_desc', lang)}
              color="secondary"
            />
            <StepCard
              number={3}
              icon={<TrendingUp className="w-6 h-6" />}
              title={t('step_3_title', lang)}
              description={t('step_3_desc', lang)}
              color="accent"
            />
            <StepCard
              number={4}
              icon={<Trophy className="w-6 h-6" />}
              title={t('step_4_title', lang)}
              description={t('step_4_desc', lang)}
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* Active Pools */}
      <section id="pools" className="py-20 lg:py-32 px-6 md:px-12 lg:px-15 bg-[#111]">
        <div className="mb-12 text-center">
          <h2 className="text-[50px] lg:text-[90px] leading-[0.8] font-bold scale-y-[1.3] lg:scale-y-[2] tracking-[-0.05em] lg:tracking-[-0.1em] origin-top mb-6 whitespace-nowrap">
            <span className="text-white">{lang === 'id' ? 'ACTIVE' : 'ACTIVE'}</span>{' '}
            <span className="text-[#f8672d]">{lang === 'id' ? 'POOLS' : 'POOLS'}</span>
          </h2>
          <p className="text-white/50 text-lg">{t('active_pools_desc', lang)}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {mockPools.map((pool) => (
            <PoolCardDemo key={pool.id} pool={pool} />
          ))}
        </div>

        {!isConnected && (
          <div className="mt-12 text-center">
            <p className="text-white/50 text-lg mb-4">{t('connect_wallet_notice', lang)}</p>
            <WalletButton />
          </div>
        )}
      </section>

      {/* Features */}
      <section className="py-20 lg:py-32 px-6 md:px-12 lg:px-15">
        <div className="mb-12 text-center">
          <h2 className="text-[50px] lg:text-[90px] leading-[0.8] font-bold scale-y-[1.3] lg:scale-y-[2] tracking-[-0.05em] lg:tracking-[-0.1em] origin-top mb-6 whitespace-nowrap">
            <span className="text-white">{lang === 'id' ? 'KEY' : 'KEY'}</span>{' '}
            <span className="text-[#f8672d]">{lang === 'id' ? 'FEATURES' : 'FEATURES'}</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title={t('trustless_feature', lang)}
            description={t('trustless_desc', lang)}
            color="primary"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title={t('ai_optimization', lang)}
            description={t('ai_optimization_desc', lang)}
            color="secondary"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title={t('community_feature', lang)}
            description={t('community_desc', lang)}
            color="accent"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 lg:px-15 border-t border-white/5 bg-[#0a0a0a]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Armon" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-bold text-white">ARMON</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-white/40 text-sm uppercase tracking-wider">{t('built_for', lang)}</p>
            <p className="text-white/20 text-xs mt-1 uppercase tracking-wider">{t('decentralized_arisan_protocol', lang)}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Stripe Marquee Component
function StripeMarquee({ className, lang }: { className?: string; lang: 'id' | 'en' }) {
  const marqueeTexts = [
    lang === 'id' ? 'Collateral System' : 'Collateral System',
    lang === 'id' ? 'AI Yield Optimizer' : 'AI Yield Optimizer',
    lang === 'id' ? '100% On-Chain' : '100% On-Chain',
    lang === 'id' ? 'Global Scale' : 'Global Scale',
  ]

  return (
    <div
      className={`relative w-full lg:w-[110%] h-[100px] md:h-[150px] overflow-hidden flex items-center justify-center bg-transparent z-[3] ${className}`}
    >
      <div className="absolute w-full bg-[#f8672d] shadow-2xl border-y-[8px] md:border-y-[12px] border-black">
        <div className="w-full my-2 py-4 md:py-6 flex overflow-hidden">
          <div
            className="flex w-max animate-marquee"
            style={{
              animation: 'marquee 20s linear infinite',
            }}
          >
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex items-center">
                {marqueeTexts.map((text, i) => (
                  <div key={i} className="flex items-center gap-8 md:gap-10 pr-8 md:pr-10">
                    <span className="text-3xl md:text-5xl lg:text-7xl font-black scale-y-[1.8] inline-block text-[#1a1a1a] tracking-[-0.05em] origin-center whitespace-nowrap">
                      {text}
                    </span>
                    <Move
                      className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] lg:w-[80px] lg:h-[80px] transform rotate-[-45deg] text-[#1a1a1a]"
                      strokeWidth={3}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

// Card Best Offer (Floating Stats Card)
function CardBestOffer({ lang }: { lang: 'id' | 'en' }) {
  return (
    <div className="absolute w-[80%] md:w-[45%] lg:w-[400px] h-fit border-4 md:border-[6px] border-[#1a1a1a] bg-white z-[3] top-1/2 -translate-y-1/2 right-4 lg:right-8 xl:right-15 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col gap-3 md:gap-4 shadow-xl">
      <div className="absolute -top-6 -right-4 sm:-top-10 sm:-right-8 md:-top-14 md:-right-14 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-[#1a1a1a] rounded-full flex items-center justify-center z-20">
        <svg className="absolute w-full h-full animate-spin" viewBox="0 0 100 100" style={{ animationDuration: '15s' }}>
          <path
            id="textPath"
            d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
            fill="none"
          />
          <text className="text-[8px] sm:text-[9px] md:text-[10px] font-bold fill-white tracking-[0.08em]">
            <textPath href="#textPath" startOffset="0%">
              {lang === 'id' ? 'Rotation Saving - Credit Assosiation - ' : 'Rotation Saving - Credit Assosiation - '}
            </textPath>
          </text>
        </svg>

        <ArrowUpRight
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white z-10"
          strokeWidth={1.5}
        />
      </div>

      <div className="flex flex-col relative z-10 pt-2 pl-1 md:pl-2">
        <span className="text-[#f8672d] font-bold text-base md:text-lg tracking-wide uppercase">
          {lang === 'id' ? 'BEST DEALS' : 'BEST OFFER'}
        </span>

        <div className="flex items-end gap-2 md:gap-3 mt-10 md:mt-15 mb-2">
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-[0.9] font-black text-[#1a1a1a] tracking-[-0.03em]">
            {lang === 'id' ? 'Staking for Collateral' : 'Staking for Collateral'}
          </span>
        </div>
        <div className="flex items-end gap-2 md:gap-3 mb-2">
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] leading-[0.9] font-black text-[#f8672d] tracking-[-0.03em]">
            {lang === 'id' ? 'Earn up to 8% APY and more' : 'Earn up to 8% APY and more'}
          </span>
        </div>
      </div>
      <div className="w-full aspect-[4/3] bg-[#f8672d] border-4 md:border-[6px] border-[#1a1a1a] rounded-2xl md:rounded-3xl relative overflow-hidden mt-4 md:mt-6">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=450&fit=crop"
          alt="Community"
          className="w-full h-full object-cover object-top"
        />
      </div>
    </div>
  )
}

// Step Card Component
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
    primary: 'bg-[#f8672d] text-white',
    secondary: 'bg-white/10 text-white',
    accent: 'bg-white/10 text-white',
    pink: 'bg-white/10 text-white',
  }

  return (
    <div className="p-6 lg:p-8 bg-[#111] rounded-2xl border border-white/5 hover:scale-[1.02] transition-all duration-300 group">
      <div className={`inline-flex p-3 rounded-xl ${colors[color as keyof typeof colors]} mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="w-8 h-8 rounded-full bg-[#f8672d] flex items-center justify-center text-sm font-black text-white mb-4">
        {number}
      </div>
      <h3 className="text-lg font-bold text-white mb-2 uppercase">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

// Feature Card Component
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
    primary: 'from-[#f8672d]/10 to-transparent border-[#f8672d]/20',
    secondary: 'from-white/5 to-transparent border-white/10',
    accent: 'from-white/5 to-transparent border-white/10',
  }

  return (
    <div className={`p-8 rounded-2xl bg-gradient-to-br ${colors[color as keyof typeof colors]} border border-white/5 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#f8672d]/5 transition-all duration-300`}>
      <div className="w-14 h-14 rounded-2xl bg-[#111] flex items-center justify-center mb-6 text-[#f8672d]">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 uppercase">{title}</h3>
      <p className="text-white/40 leading-relaxed">{description}</p>
    </div>
  )
}

// Pool Card Demo
function PoolCardDemo({ pool }: { pool: typeof mockPools[0] }) {
  const { lang } = useLanguage()
  const statusColors = {
    active: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30',
    pending: 'bg-[#f8672d]/20 text-[#f8672d] border-[#f8672d]/30',
    drawing: 'bg-[#6366F1]/20 text-[#6366F1] border-[#6366F1]/30',
    completed: 'bg-white/10 text-white/40 border-white/20',
  }

  return (
    <Link
      to={`/pool/${pool.id}`}
      className="group block bg-[#111] rounded-2xl p-5 sm:p-6 border border-white/5 hover:border-[#f8672d]/50 hover:shadow-xl hover:shadow-[#f8672d]/10 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-white group-hover:text-[#f8672d] transition-colors line-clamp-1 uppercase">
          {pool.name}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ml-2 uppercase ${statusColors[pool.status]}`}>
          {pool.status === 'active' && t('active', lang)}
          {pool.status === 'pending' && t('pending', lang)}
          {pool.status === 'drawing' && t('drawing', lang)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-white/30 text-xs mb-1 uppercase tracking-wider">{t('monthly_fee', lang)}</p>
          <p className="text-lg font-black text-[#10B981] font-mono">{pool.iuranAmount} MON</p>
        </div>
        <div>
          <p className="text-white/30 text-xs mb-1 uppercase tracking-wider">{t('prize', lang)}</p>
          <p className="text-lg font-black text-[#f8672d] font-mono">{pool.prizeAmount} MON</p>
        </div>
        <div>
          <p className="text-white/30 text-xs mb-1 uppercase tracking-wider">{t('participants', lang)}</p>
          <p className="text-white font-semibold">{pool.participants}/{pool.maxParticipants}</p>
        </div>
        <div>
          <p className="text-white/30 text-xs mb-1 uppercase tracking-wider">{t('period', lang)}</p>
          <p className="text-white font-semibold">{pool.currentPeriod}/{pool.totalPeriods}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {[...Array(Math.min(pool.participants, 5))].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-[#f8672d]/20 border-2 border-[#111] flex items-center justify-center text-xs text-[#f8672d] font-semibold"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          {pool.participants > 5 && (
            <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#111] flex items-center justify-center text-xs text-white/60">
              +{pool.participants - 5}
            </div>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-[#f8672d] group-hover:translate-x-1 transition-all" />
      </div>

      <div className="mt-4">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#f8672d] to-[#ff8c42] rounded-full transition-all duration-500"
            style={{ width: `${(pool.participants / pool.maxParticipants) * 100}%` }}
          />
        </div>
        <p className="text-xs text-white/30 mt-2 text-right uppercase tracking-wider">{pool.participants} {t('of', lang)} {pool.maxParticipants}</p>
      </div>
    </Link>
  )
}
