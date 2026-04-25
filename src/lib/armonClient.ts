import { createPublicClient, createWalletClient, http, custom, parseEther, formatEther } from 'viem'
import { monadTestnet } from 'viem/chains'
import { ARMON_ADDRESS } from './contracts'
import { ARMON_ABI } from './abi'

// ============================================================================
// Client Setup
// ============================================================================

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})

export function getWalletClient(walletClient: any) {
  return createWalletClient({
    account: walletClient.account,
    chain: monadTestnet,
    transport: custom(walletClient.transport),
  })
}

// ============================================================================
// Helpers
// ============================================================================

export function formatMON(wei: bigint | undefined | string): string {
  if (!wei) return '0'
  const num = typeof wei === 'string' ? parseFloat(wei) : Number(wei)
  return (num / 1e18).toFixed(4)
}

export function parseMON(mon: string): bigint {
  const num = parseFloat(mon)
  return BigInt(Math.round(num * 1e18))
}

// ============================================================================
// Read Functions
// ============================================================================

export async function getPool(poolId: number) {
  return await publicClient.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getPool',
    args: [BigInt(poolId)],
  })
}

export async function getActivePools(): Promise<bigint[]> {
  return await publicClient.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getActivePools',
  }) as bigint[]
}

export async function getPoolCount(): Promise<bigint> {
  return await publicClient.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getPoolCount',
  }) as unknown as bigint
}

export async function getParticipants(poolId: number) {
  return await publicClient.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getParticipants',
    args: [BigInt(poolId)],
  })
}

export async function getWinners(poolId: number): Promise<`0x${string}`[]> {
  return await publicClient.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getWinners',
    args: [BigInt(poolId)],
  }) as `0x${string}`[]
}

export async function getCollateralRequired(poolId: number): Promise<bigint> {
  return await publicClient.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getCollateralRequired',
    args: [BigInt(poolId)],
  }) as unknown as bigint
}

export async function isParticipant(poolId: number, address: `0x${string}`): Promise<boolean> {
  return await publicClient.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'isParticipant',
    args: [BigInt(poolId), address],
  }) as boolean
}

// ============================================================================
// Write Functions
// ============================================================================

export async function createPool(
  walletClient: any,
  name: string,
  iuranAmount: bigint,
  maxParticipants: number,
  totalPeriods: number
): Promise<`0x${string}`> {
  return await walletClient.writeContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'createPool',
    args: [name, iuranAmount, BigInt(maxParticipants), BigInt(totalPeriods)],
  })
}

export async function joinPool(
  walletClient: any,
  poolId: number,
  value: bigint
): Promise<`0x${string}`> {
  return await walletClient.writeContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'joinPool',
    args: [BigInt(poolId)],
    value: value,
  })
}

export async function payIuran(
  walletClient: any,
  poolId: number,
  value: bigint
): Promise<`0x${string}`> {
  return await walletClient.writeContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'payIuran',
    args: [BigInt(poolId)],
    value: value,
  })
}

export async function drawWinner(
  walletClient: any,
  poolId: number
): Promise<`0x${string}`> {
  return await walletClient.writeContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'drawWinner',
    args: [BigInt(poolId)],
  })
}

export async function voteWinner(
  walletClient: any,
  poolId: number,
  candidate: `0x${string}`
): Promise<`0x${string}`> {
  return await walletClient.writeContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'voteWinner',
    args: [BigInt(poolId), candidate],
  })
}

export async function claimPrize(
  walletClient: any,
  poolId: number
): Promise<`0x${string}`> {
  return await walletClient.writeContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'claimPrize',
    args: [BigInt(poolId)],
  })
}

export async function withdrawCollateral(
  walletClient: any,
  poolId: number
): Promise<`0x${string}`> {
  return await walletClient.writeContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'withdrawCollateral',
    args: [BigInt(poolId)],
  })
}

// ============================================================================
// Transaction Helper
// ============================================================================

export async function waitForTransaction(hash: `0x${string}`) {
  return await publicClient.waitForTransactionReceipt({ hash })
}