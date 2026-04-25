import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useConnect, useBalance, useSwitchChain } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { monadTestnet } from 'viem/chains'
import { Button } from '@/components/ui/Button'
import { useCreatePoolWrite, ERROR_MESSAGES } from '@/hooks/useArmon'
import { parseMON, formatMON } from '@/lib/armonClient'
import { ArrowLeft, Info, Wallet, AlertCircle, CheckCircle, Coins, Users, Calendar, RefreshCw } from 'lucide-react'

// Create direct viem client for balance queries
const viemClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz'),
})

// Add to MetaMask
const MONAD_PARAMS = {
  chainId: '0x279F', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: { name: 'Testnet MON', symbol: 'MON', decimals: 18 },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
}

export default function CreatePool() {
  const navigate = useNavigate()
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { switchChain } = useSwitchChain()
  const { write, isLoading, isSuccess, error } = useCreatePoolWrite()

  // Direct wagmi balance query
  const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = useBalance({
    address,
  })

  // Direct balance fetch via viem as backup
  const [directBalance, setDirectBalance] = useState<string | null>(null)
  const [directBalanceLoading, setDirectBalanceLoading] = useState(false)

  const fetchDirectBalance = useCallback(async () => {
    if (!address) return
    try {
      setDirectBalanceLoading(true)
      const balanceWei = await viemClient.getBalance({ address })
      setDirectBalance(balanceWei.toString())
      console.log('[Viem Direct Balance]', balanceWei.toString())
    } catch (err) {
      console.error('[Viem Balance Error]', err)
    } finally {
      setDirectBalanceLoading(false)
    }
  }, [address])

  // Fetch direct balance on mount and when address changes
  useEffect(() => {
    if (address) {
      fetchDirectBalance()
    }
  }, [address, fetchDirectBalance])

  // Debug: log balance changes
  useEffect(() => {
    console.log('[Balance Debug]', {
      address,
      chainId: monadTestnet.id,
      chain: chain?.id,
      balance: balance?.value?.toString(),
      formatted: balance?.formatted,
      symbol: balance?.symbol,
      decimals: balance?.decimals,
      isLoading: balanceLoading,
      directBalance,
    })
  }, [balance, balanceLoading, address, chain, directBalance])

  // Check if connected to wrong chain
  const isWrongChain = isConnected && chain && chain.id !== monadTestnet.id

  // Add Monad to MetaMask
  const addMonadNetwork = async () => {
    if (!window.ethereum) return
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [MONAD_PARAMS],
      })
    } catch (err) {
      console.error('Failed to add Monad network', err)
    }
  }

  // Switch to Monad chain
  const handleSwitchChain = async () => {
    if (!window.ethereum) return
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x279F' }],
      })
    } catch (err: any) {
      if (err.code === 4902) {
        await addMonadNetwork()
      }
    }
  }

  // Use directBalance if available, otherwise use wagmi balance
  const displayBalance = () => {
    if (directBalance !== null) {
      return formatMON(BigInt(directBalance))
    }
    if (balance) {
      return formatMON(balance.value)
    }
    return '0'
  }

  const isAnyLoading = balanceLoading || directBalanceLoading

  const [poolName, setPoolName] = useState('')
  const [iuranAmount, setIuranAmount] = useState('1')
  const [maxParticipants, setMaxParticipants] = useState(4)
  const [totalPeriods, setTotalPeriods] = useState(6)
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false)

  // Total nilai pool = iuran × jumlah peserta (itu yang menjadi hadiah)
  const totalPoolValue = parseFloat(iuranAmount) * maxParticipants
  // Collateral per peserta = 125% × total nilai pool
  const collateralPerPeserta = totalPoolValue * 1.25
  // Hadiah per pemenang = total nilai pool (semua iuran dikumpulkan)
  const prizePerWinner = totalPoolValue

  // Check balance sufficiency - collateral = 125% dari total pool value
  const checkBalanceSufficiency = () => {
    const bal = directBalance !== null ? BigInt(directBalance) : (balance?.value ?? 0n)
    if (bal === 0n && !directBalance && !balance) return false
    const requiredCollateral = parseMON(collateralPerPeserta.toString())
    return bal >= requiredCollateral
  }

  // Show insufficient balance warning
  useEffect(() => {
    if (isConnected && (directBalance !== null || balance)) {
      const bal = directBalance !== null ? BigInt(directBalance) : balance?.value ?? 0n
      if (bal > 0n || (balanceLoading && directBalance !== null)) {
        setShowInsufficientBalance(!checkBalanceSufficiency())
      }
    }
  }, [balance, balanceLoading, directBalance, iuranAmount, isConnected])

  const handleCreatePool = async () => {
    if (!poolName) return

    // Final check before submitting
    if (!checkBalanceSufficiency()) {
      setShowInsufficientBalance(true)
      return
    }

    await write(poolName, iuranAmount, maxParticipants, totalPeriods)
  }

  // ============ WALLET NOT CONNECTED STATE ============
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center p-8 bg-surface rounded-2xl border border-slate-700 max-w-md w-full">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Hubungkan Wallet</h2>
          <p className="text-slate-400 mb-6">
            Anda perlu menghubungkan wallet terlebih dahulu untuk membuat pool arisan.
          </p>
          <div className="space-y-3">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                variant="primary"
                className="w-full"
                onClick={() => connect({ connector })}
                disabled={isPending}
                leftIcon={<Wallet className="w-4 h-4" />}
              >
                {isPending ? 'Menghubungkan...' : `Hubungkan ${connector.name}`}
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
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-surface rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-white">Buat Pool Arisan</h1>
              <p className="text-sm text-slate-400">Pool Baru</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isWrongChain && (
              <button
                onClick={handleSwitchChain}
                className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors"
              >
                Switch to Monad
              </button>
            )}
            <div className="text-right">
              <p className="text-xs text-slate-400">Saldo</p>
              <p className={`text-sm font-mono ${isWrongChain ? 'text-slate-600' : 'text-secondary'}`}>
                {isAnyLoading ? '...' : displayBalance()} MON
              </p>
            </div>
            <div className="px-3 py-1.5 bg-surface rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-surface rounded-2xl p-6 border border-slate-700">
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
              className="w-full px-4 py-3 bg-background border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
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
                className="w-full px-4 py-3 bg-background border border-slate-600 rounded-xl text-white font-mono focus:outline-none focus:border-primary transition-colors pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                MON
              </span>
            </div>
          </div>

          {/* Max Participants */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Maksimal Peserta
            </label>
            <div className="relative">
              <select
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-background border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                {[3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50].map(n => (
                  <option key={n} value={n}>{n} peserta</option>
                ))}
              </select>
              <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Total Periods */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Total Periode
            </label>
            <div className="relative">
              <select
                value={totalPeriods}
                onChange={(e) => setTotalPeriods(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-background border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                  <option key={n} value={n}>{n} bulan</option>
                ))}
              </select>
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-background rounded-xl p-5 mb-6 border border-slate-700/50">
            <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Preview Pool
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Collateral per Peserta</p>
                <p className="text-lg font-bold text-secondary font-mono">
                  {collateralPerPeserta.toFixed(4)} MON
                </p>
              </div>
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Hadiah per Pemenang</p>
                <p className="text-lg font-bold text-accent font-mono">
                  {prizePerWinner.toFixed(4)} MON
                </p>
              </div>
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Durasi</p>
                <p className="text-lg font-bold text-white font-mono">
                  {totalPeriods} Bulan
                </p>
              </div>
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Total Nilai Pool</p>
                <p className="text-lg font-bold text-primary font-mono">
                  {(prizePerWinner * totalPeriods).toFixed(4)} MON
                </p>
              </div>
            </div>
          </div>

          {/* Saldo Tidak Cukup Warning */}
          {showInsufficientBalance && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">Saldo Tidak Cukup</p>
                <p className="text-red-300/70 text-sm mt-1">
                  Collateral yang diperlukan: <span className="font-mono font-bold">{collateralPerPeserta.toFixed(4)} MON</span>
                  <br />
                  Saldo Anda: <span className="font-mono font-bold">{displayBalance()} MON</span>
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  <strong className="text-white">Collateral 125%</strong> — Setiap peserta harus deposit collateral sejumlah 125% dari iuran bulanan sebagai jaminan.
                </p>
                <p>
                  Collateral akan dikembalikan beserta yield setelah arisan selesai atau setelah peserta mendapat giliran menang.
                </p>
              </div>
            </div>
          </div>

          {/* Tombol Buat Pool */}
          <Button
            onClick={handleCreatePool}
            disabled={!poolName || isLoading || showInsufficientBalance}
            className="w-full"
            size="lg"
            leftIcon={isLoading ? undefined : <Coins className="w-5 h-5" />}
          >
            {isLoading ? 'Membuat Pool...' : isSuccess ? 'Pool Berhasil Dibuat!' : 'Buat Pool'}
          </Button>

          {/* Success Message */}
          {isSuccess && (
            <div className="mt-4 p-4 bg-secondary/20 border border-secondary/30 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
              <div>
                <p className="text-secondary font-medium">Pool Berhasil Dibuat!</p>
                <p className="text-secondary/70 text-sm">Pool arisan baru telah berhasil dibuat di blockchain.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">Terjadi Kesalahan</p>
                <p className="text-red-300/70 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}