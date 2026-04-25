import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { useMemo } from 'react'
import { ARMON_ABI, ARMON_CONTRACT_ADDRESS } from '@/lib/constants'
import type { Pool, PoolInfo, Participant } from '@/lib/types'
import { getPrizeAmount } from '@/lib/utils'

// ============================================================================
// Read Operations
// ============================================================================

export function usePoolCount() {
  return useReadContract({
    address: ARMON_CONTRACT_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getPoolCount',
  })
}

export function usePool(poolId: number) {
  return useReadContract({
    address: ARMON_CONTRACT_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getPool',
    args: [BigInt(poolId)],
  })
}

export function useActivePools() {
  return useReadContract({
    address: ARMON_CONTRACT_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getActivePools',
  })
}

export function useCollateralRequired(poolId: number) {
  return useReadContract({
    address: ARMON_CONTRACT_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getCollateralRequired',
    args: [BigInt(poolId)],
  })
}

export function useIsParticipant(poolId: number, address?: string) {
  return useReadContract({
    address: ARMON_CONTRACT_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'isParticipant',
    args: [BigInt(poolId), address as `0x${string}`],
    query: { enabled: !!address },
  })
}

export function useMyParticipant(poolId: number) {
  const { address } = useAccount()
  return useReadContract({
    address: ARMON_CONTRACT_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getParticipant',
    args: [BigInt(poolId), address as `0x${string}`],
    query: { enabled: !!address },
  })
}

export function useParticipants(poolId: number) {
  return useReadContract({
    address: ARMON_CONTRACT_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getParticipants',
    args: [BigInt(poolId)],
  })
}

export function useWinners(poolId: number) {
  return useReadContract({
    address: ARMON_CONTRACT_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getWinners',
    args: [BigInt(poolId)],
  })
}

// ============================================================================
// Write Operations
// ============================================================================

export function useCreatePool() {
  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const createPool = (name: string, iuranAmount: bigint, maxParticipants: number, totalPeriods: number) => {
    writeContract({
      address: ARMON_CONTRACT_ADDRESS,
      abi: ARMON_ABI,
      functionName: 'createPool',
      args: [name, iuranAmount, BigInt(maxParticipants), BigInt(totalPeriods)],
    })
  }

  return { createPool, txHash, isPending, error }
}

export function useJoinPool(poolId: number) {
  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const joinPool = (collateralAmount: bigint) => {
    writeContract({
      address: ARMON_CONTRACT_ADDRESS,
      abi: ARMON_ABI,
      functionName: 'joinPool',
      args: [BigInt(poolId)],
      value: collateralAmount,
    })
  }

  return { joinPool, txHash, isPending, error }
}

export function usePayIuran(poolId: number) {
  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const payIuran = (iuranAmount: bigint) => {
    writeContract({
      address: ARMON_CONTRACT_ADDRESS,
      abi: ARMON_ABI,
      functionName: 'payIuran',
      args: [BigInt(poolId)],
      value: iuranAmount,
    })
  }

  return { payIuran, txHash, isPending, error }
}

export function useDrawWinner(poolId: number) {
  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const drawWinner = () => {
    writeContract({
      address: ARMON_CONTRACT_ADDRESS,
      abi: ARMON_ABI,
      functionName: 'drawWinner',
      args: [BigInt(poolId)],
    })
  }

  return { drawWinner, txHash, isPending, error }
}

export function useVoteWinner(poolId: number) {
  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const voteWinner = (candidate: `0x${string}`) => {
    writeContract({
      address: ARMON_CONTRACT_ADDRESS,
      abi: ARMON_ABI,
      functionName: 'voteWinner',
      args: [BigInt(poolId), candidate],
    })
  }

  return { voteWinner, txHash, isPending, error }
}

export function useClaimPrize(poolId: number) {
  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const claimPrize = () => {
    writeContract({
      address: ARMON_CONTRACT_ADDRESS,
      abi: ARMON_ABI,
      functionName: 'claimPrize',
      args: [BigInt(poolId)],
    })
  }

  return { claimPrize, txHash, isPending, error }
}

export function useWithdrawCollateral(poolId: number) {
  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const withdrawCollateral = () => {
    writeContract({
      address: ARMON_CONTRACT_ADDRESS,
      abi: ARMON_ABI,
      functionName: 'withdrawCollateral',
      args: [BigInt(poolId)],
    })
  }

  return { withdrawCollateral, txHash, isPending, error }
}

export function useClosePool(poolId: number) {
  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const closePool = () => {
    writeContract({
      address: ARMON_CONTRACT_ADDRESS,
      abi: ARMON_ABI,
      functionName: 'closePool',
      args: [BigInt(poolId)],
    })
  }

  return { closePool, txHash, isPending, error }
}

// ============================================================================
// Combined Hooks
// ============================================================================

export function usePoolWithParticipants(poolId: number) {
  const { data: pool, isLoading: poolLoading, error: poolError } = usePool(poolId)
  const { data: participants, isLoading: participantsLoading } = useParticipants(poolId)
  const { data: winners } = useWinners(poolId)

  return useMemo(() => {
    if (!pool) return null

    const poolInfo: Pool = {
      id: poolId,
      name: pool[0],
      iuranAmount: pool[1],
      maxParticipants: Number(pool[2]),
      collateralBps: Number(pool[3]),
      currentPeriod: Number(pool[4]),
      totalPeriods: Number(pool[5]),
      isActive: pool[6],
      owner: pool[7],
      createdAt: pool[8],
      lastDrawAt: pool[9],
      accumulatedYield: pool[10],
      participantCount: Number(pool[11]),
    }

    const participantsList: Participant[] = (participants || []).map((p: readonly [string, bigint, bigint, boolean, boolean, number]) => ({
      wallet: p[0],
      collateralDeposited: p[1],
      yieldAccrued: p[2],
      hasWon: p[3],
      paidThisPeriod: p[4],
      joinPeriod: p[5],
    }))

    return {
      pool: poolInfo,
      participants: participantsList,
      winners: winners || [],
      prizeAmount: getPrizeAmount(poolInfo.iuranAmount, poolInfo.participantCount),
      isLoading: poolLoading || participantsLoading,
      error: poolError,
    }
  }, [pool, participants, winners, poolId, poolLoading, poolError, participantsLoading])
}

export function useAllPools() {
  const { data: poolCount, isLoading: countLoading } = usePoolCount()
  const { data: activePoolIds } = useActivePools()

  return useMemo(() => {
    if (!poolCount || countLoading) return { pools: [], isLoading: true }

    const allPools: Pool[] = []
    for (let i = 0; i < Number(poolCount); i++) {
      allPools.push({
        id: i,
        name: '',
        iuranAmount: 0n,
        maxParticipants: 0,
        collateralBps: 12500,
        currentPeriod: 0,
        totalPeriods: 0,
        isActive: (activePoolIds || []).includes(i),
        owner: '0x',
        createdAt: 0n,
        lastDrawAt: 0n,
        accumulatedYield: 0n,
        participantCount: 0,
      })
    }

    return { pools: allPools, isLoading: false }
  }, [poolCount, activePoolIds, countLoading])
}