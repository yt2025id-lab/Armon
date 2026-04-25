// Smart Contract Types - matches Armon.sol
export interface PoolInfo {
  name: string
  iuranAmount: bigint
  maxParticipants: number
  collateralBps: number
  currentPeriod: number
  totalPeriods: number
  isActive: boolean
  owner: string
  createdAt: bigint
  lastDrawAt: bigint
  accumulatedYield: bigint
  participantCount: number
}

export interface Participant {
  wallet: string
  collateralDeposited: bigint
  yieldAccrued: bigint
  hasWon: boolean
  paidThisPeriod: boolean
  joinPeriod: number
}

// Frontend Pool type (with participants array for UI)
export interface Pool extends PoolInfo {
  id: number
  participants?: Participant[]
}

// Contract ABI function types
export type ArmonReadFunctions =
  | 'getPool'
  | 'getPoolCount'
  | 'getActivePools'
  | 'isParticipant'
  | 'getParticipant'
  | 'getCollateralRequired'
  | 'getWinners'
  | 'getParticipants'

export type ArmonWriteFunctions =
  | 'createPool'
  | 'joinPool'
  | 'payIuran'
  | 'drawWinner'
  | 'voteWinner'
  | 'claimPrize'
  | 'withdrawCollateral'
  | 'closePool'