import { useState, useEffect, useCallback } from 'react'
import { useAccount, useWalletClient, useBalance } from 'wagmi'
import {
  getPool,
  getActivePools as getActivePoolsFromChain,
  getParticipants,
  getWinners,
  getCollateralRequired,
  isParticipant,
  createPool,
  joinPool,
  payIuran,
  drawWinner,
  voteWinner,
  claimPrize,
  withdrawCollateral,
  waitForTransaction,
  formatMON,
  parseMON,
} from '@/lib/armonClient'

// ============ ERROR MESSAGES (Indonesian) ============
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Wallet belum terhubung. Silakan hubungkan wallet terlebih dahulu.',
  INSUFFICIENT_BALANCE: 'Saldo tidak cukup untuk melakukan transaksi ini.',
  TRANSACTION_FAILED: 'Transaksi gagal. Silakan coba lagi.',
  POOL_NOT_FOUND: 'Pool tidak ditemukan.',
  USER_REJECTED: 'Transaksi dibatalkan oleh pengguna.',
  NETWORK_ERROR: 'Kesalahan jaringan. Silakan coba lagi.',
}

// ============ CUSTOM HOOKS ============

export function useArmonPool(poolId: number) {
  const [pool, setPool] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPool = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getPool(poolId)
      setPool(data)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [poolId])

  useEffect(() => {
    fetchPool()
  }, [fetchPool])

  return { pool, loading, error, refetch: fetchPool }
}

export function useArmonParticipants(poolId: number) {
  const [participants, setParticipants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getParticipants(poolId)
      setParticipants(data)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [poolId])

  useEffect(() => {
    fetchParticipants()
  }, [fetchParticipants])

  return { participants, loading, error, refetch: fetchParticipants }
}

export function useArmonWinners(poolId: number) {
  const [winners, setWinners] = useState<`0x${string}`[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWinners(poolId)
      .then(setWinners)
      .finally(() => setLoading(false))
  }, [poolId])

  return { winners, loading }
}

export function useActivePools() {
  const [activePoolIds, setActivePoolIds] = useState<bigint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPools = useCallback(async () => {
    try {
      setLoading(true)
      const pools = await getActivePoolsFromChain()
      setActivePoolIds(pools)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPools()
  }, [fetchPools])

  return { data: activePoolIds, loading, error, refetch: fetchPools }
}

// ============ WRITE HOOKS ============

export function useCreatePoolWrite() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)

  const write = useCallback(async (
    name: string,
    iuranAmount: string,
    maxParticipants: number,
    totalPeriods: number
  ) => {
    if (!walletClient || !address) {
      setError(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const hash = await createPool(
        walletClient,
        name,
        parseMON(iuranAmount),
        maxParticipants,
        totalPeriods
      )
      setTxHash(hash)

      await waitForTransaction(hash)
      setIsSuccess(true)
      return hash
    } catch (e: any) {
      // Handle user rejection
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        setError(ERROR_MESSAGES.USER_REJECTED)
      } else {
        setError(e.message || ERROR_MESSAGES.TRANSACTION_FAILED)
      }
    } finally {
      setIsLoading(false)
    }
  }, [walletClient, address])

  return { write, isLoading, isSuccess, error, txHash }
}

export function useJoinPoolWrite(poolId: number, collateralValue: string) {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { data: balance } = useBalance({ address })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canJoinPool = useCallback(() => {
    if (!balance) return false
    const required = parseMON(collateralValue)
    return balance.value >= required
  }, [balance, collateralValue])

  const write = useCallback(async () => {
    if (!walletClient || !address) {
      setError(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    if (!canJoinPool()) {
      setError(ERROR_MESSAGES.INSUFFICIENT_BALANCE)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const hash = await joinPool(
        walletClient,
        poolId,
        parseMON(collateralValue)
      )

      await waitForTransaction(hash)
      setIsSuccess(true)
      return hash
    } catch (e: any) {
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        setError(ERROR_MESSAGES.USER_REJECTED)
      } else {
        setError(e.message || ERROR_MESSAGES.TRANSACTION_FAILED)
      }
    } finally {
      setIsLoading(false)
    }
  }, [walletClient, address, poolId, collateralValue, canJoinPool])

  return { write, isLoading, isSuccess, error, canJoinPool, balance }
}

export function usePayIuranWrite(poolId: number, iuranValue: string) {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { data: balance } = useBalance({ address })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canPayIuran = useCallback(() => {
    if (!balance) return false
    const required = parseMON(iuranValue)
    return balance.value >= required
  }, [balance, iuranValue])

  const write = useCallback(async () => {
    if (!walletClient || !address) {
      setError(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    if (!canPayIuran()) {
      setError(ERROR_MESSAGES.INSUFFICIENT_BALANCE)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const hash = await payIuran(
        walletClient,
        poolId,
        parseMON(iuranValue)
      )

      await waitForTransaction(hash)
      setIsSuccess(true)
      return hash
    } catch (e: any) {
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        setError(ERROR_MESSAGES.USER_REJECTED)
      } else {
        setError(e.message || ERROR_MESSAGES.TRANSACTION_FAILED)
      }
    } finally {
      setIsLoading(false)
    }
  }, [walletClient, address, poolId, iuranValue, canPayIuran])

  return { write, isLoading, isSuccess, error, canPayIuran, balance }
}

export function useDrawWinnerWrite(poolId: number) {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const write = useCallback(async () => {
    if (!walletClient || !address) {
      setError(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const hash = await drawWinner(walletClient, poolId)
      await waitForTransaction(hash)
      setIsSuccess(true)
      return hash
    } catch (e: any) {
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        setError(ERROR_MESSAGES.USER_REJECTED)
      } else {
        setError(e.message || ERROR_MESSAGES.TRANSACTION_FAILED)
      }
    } finally {
      setIsLoading(false)
    }
  }, [walletClient, address, poolId])

  return { write, isLoading, isSuccess, error }
}

export function useVoteWinnerWrite(poolId: number, candidate: `0x${string}`) {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const write = useCallback(async () => {
    if (!walletClient || !address) {
      setError(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const hash = await voteWinner(walletClient, poolId, candidate)
      await waitForTransaction(hash)
      setIsSuccess(true)
      return hash
    } catch (e: any) {
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        setError(ERROR_MESSAGES.USER_REJECTED)
      } else {
        setError(e.message || ERROR_MESSAGES.TRANSACTION_FAILED)
      }
    } finally {
      setIsLoading(false)
    }
  }, [walletClient, address, poolId, candidate])

  return { write, isLoading, isSuccess, error }
}

export function useClaimPrizeWrite(poolId: number) {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const write = useCallback(async () => {
    if (!walletClient || !address) {
      setError(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const hash = await claimPrize(walletClient, poolId)
      await waitForTransaction(hash)
      setIsSuccess(true)
      return hash
    } catch (e: any) {
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        setError(ERROR_MESSAGES.USER_REJECTED)
      } else {
        setError(e.message || ERROR_MESSAGES.TRANSACTION_FAILED)
      }
    } finally {
      setIsLoading(false)
    }
  }, [walletClient, address, poolId])

  return { write, isLoading, isSuccess, error }
}

export function useWithdrawCollateralWrite(poolId: number) {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const write = useCallback(async () => {
    if (!walletClient || !address) {
      setError(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const hash = await withdrawCollateral(walletClient, poolId)
      await waitForTransaction(hash)
      setIsSuccess(true)
      return hash
    } catch (e: any) {
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        setError(ERROR_MESSAGES.USER_REJECTED)
      } else {
        setError(e.message || ERROR_MESSAGES.TRANSACTION_FAILED)
      }
    } finally {
      setIsLoading(false)
    }
  }, [walletClient, address, poolId])

  return { write, isLoading, isSuccess, error }
}

// Re-export helpers
export { formatMON, parseMON }