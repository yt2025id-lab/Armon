// Contract Constants - matches Armon.sol
export const COLLATERAL_BPS = 12500 // 125% in basis points
export const MIN_PARTICIPANTS = 3
export const MAX_PARTICIPANTS = 50
export const BASE_YIELD_BPS = 500 // 5% APY basis points

// Pool limits
export const MIN_IURAN_AMOUNT = 1 // Minimum 1 MON
export const MAX_PERIODS = 12 // Maximum 12 months
export const MIN_PERIODS = 1 // Minimum 1 month

// Time periods (in seconds)
export const IURAN_PAYMENT_WINDOW = 10 * 24 * 60 * 60 // 10 days to pay iuran
export const DRAW_PERIOD_DAY = 25 // Draw winner on 25th of month