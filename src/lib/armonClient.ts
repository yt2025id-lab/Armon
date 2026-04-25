import { useState, useEffect, useCallback } from 'react'
import { createPublicClient, createWalletClient, http, custom, formatEther, parseEther } from 'viem'
import { mainnet } from 'wagmi/chains'
import { ARMON_ABI } from '@/lib/abi'
import { ARMON_ADDRESS, MONAD_CHAIN } from '@/lib/contracts'

// Create clients
export function getPublicClient() {
  return createPublicClient({
    chain: MONAD_CHAIN as any,
    transport: http(),
  })
}

export function getWalletClient(walletClient: any) {
  return createWalletClient({
    account: walletClient.account,
    chain: MONAD_CHAIN as any,
    transport: custom(walletClient),
  })
}

// Helper functions
export function formatMON(wei: bigint | undefined | string): string {
  if (!wei) return '0'
  const num = typeof wei === 'string' ? parseFloat(wei) : Number(wei)
  return (num / 1e18).toFixed(4)
}

export function parseMON(mon: string): bigint {
  const num = parseFloat(mon)
  return BigInt(Math.round(num * 1e18))
}

// ============ READ FUNCTIONS ============

export async function getPoolCount(): Promise<number> {
  const client = getPublicClient()
  const count = await client.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getPoolCount',
  })
  return Number(count)
}

export async function getActivePools(): Promise<bigint[]> {
  const client = getPublicClient()
  const pools = await client.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getActivePools',
  })
  return pools as bigint[]
}

export async function getPool(poolId: number) {
  const client = getPublicClient()
  const pool = await client.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getPool',
    args: [BigInt(poolId)],
  })
  return pool
}

export async function getParticipants(poolId: number) {
  const client = getPublicClient()
  const participants = await client.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getParticipants',
    args: [BigInt(poolId)],
  })
  return participants
}

export async function getWinners(poolId: number) {
  const client = getPublicClient()
  const winners = await client.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getWinners',
    args: [BigInt(poolId)],
  })
  return winners as `0x${string}`[]
}

export async function getCollateralRequired(poolId: number): Promise<bigint> {
  const client = getPublicClient()
  const collateral = await client.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'getCollateralRequired',
    args: [BigInt(poolId)],
  })
  return collateral as bigint
}

export async function isParticipant(poolId: number, address: `0x${string}`): Promise<boolean> {
  const client = getPublicClient()
  const result = await client.readContract({
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'isParticipant',
    args: [BigInt(poolId), address],
  })
  return result as boolean
}

// ============ WRITE FUNCTIONS ============

export async function createPool(
  walletClient: any,
  name: string,
  iuranAmount: bigint,
  maxParticipants: number,
  totalPeriods: number
) {
  const client = getWalletClient(walletClient)
  const hash = await client.writeContract({
    account: walletClient.account,
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'createPool',
    args: [name, iuranAmount, BigInt(maxParticipants), BigInt(totalPeriods)],
  })
  return hash
}

export async function joinPool(walletClient: any, poolId: number, value: bigint) {
  const client = getWalletClient(walletClient)
  const hash = await client.writeContract({
    account: walletClient.account,
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'joinPool',
    args: [BigInt(poolId)],
    value: value,
  })
  return hash
}

export async function payIuran(walletClient: any, poolId: number, value: bigint) {
  const client = getWalletClient(walletClient)
  const hash = await client.writeContract({
    account: walletClient.account,
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'payIuran',
    args: [BigInt(poolId)],
    value: value,
  })
  return hash
}

export async function drawWinner(walletClient: any, poolId: number) {
  const client = getWalletClient(walletClient)
  const hash = await client.writeContract({
    account: walletClient.account,
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'drawWinner',
    args: [BigInt(poolId)],
  })
  return hash
}

export async function voteWinner(walletClient: any, poolId: number, candidate: `0x${string}`) {
  const client = getWalletClient(walletClient)
  const hash = await client.writeContract({
    account: walletClient.account,
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'voteWinner',
    args: [BigInt(poolId), candidate],
  })
  return hash
}

export async function claimPrize(walletClient: any, poolId: number) {
  const client = getWalletClient(walletClient)
  const hash = await client.writeContract({
    account: walletClient.account,
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'claimPrize',
    args: [BigInt(poolId)],
  })
  return hash
}

export async function withdrawCollateral(walletClient: any, poolId: number) {
  const client = getWalletClient(walletClient)
  const hash = await client.writeContract({
    account: walletClient.account,
    address: ARMON_ADDRESS,
    abi: ARMON_ABI,
    functionName: 'withdrawCollateral',
    args: [BigInt(poolId)],
  })
  return hash
}

// Wait for transaction
export async function waitForTransaction(hash: `0x${string}`) {
  const client = getPublicClient()
  return client.waitForTransactionReceipt({ hash })
}
