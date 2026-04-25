export const ARMON_ABI = [
  // Constants
  {
    "type": "function",
    "name": "COLLATERAL_BPS",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MIN_PARTICIPANTS",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_PARTICIPANTS",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "BASE_YIELD_BPS",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },

  // Write Functions
  {
    "type": "function",
    "name": "createPool",
    "inputs": [
      { "name": "_name", "type": "string" },
      { "name": "_iuranAmount", "type": "uint256" },
      { "name": "_maxParticipants", "type": "uint256" },
      { "name": "_totalPeriods", "type": "uint256" }
    ],
    "outputs": [{ "name": "poolId", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "joinPool",
    "inputs": [{ "name": "_poolId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "payIuran",
    "inputs": [{ "name": "_poolId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "drawWinner",
    "inputs": [{ "name": "_poolId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "voteWinner",
    "inputs": [
      { "name": "_poolId", "type": "uint256" },
      { "name": "_candidate", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimPrize",
    "inputs": [{ "name": "_poolId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawCollateral",
    "inputs": [{ "name": "_poolId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "closePool",
    "inputs": [{ "name": "_poolId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },

  // Read Functions
  {
    "type": "function",
    "name": "getPool",
    "inputs": [{ "name": "_poolId", "type": "uint256" }],
    "outputs": [{
      "type": "tuple",
      "components": [
        { "name": "name", "type": "string" },
        { "name": "iuranAmount", "type": "uint256" },
        { "name": "maxParticipants", "type": "uint256" },
        { "name": "collateralBps", "type": "uint256" },
        { "name": "currentPeriod", "type": "uint256" },
        { "name": "totalPeriods", "type": "uint256" },
        { "name": "isActive", "type": "bool" },
        { "name": "owner", "type": "address" },
        { "name": "createdAt", "type": "uint256" },
        { "name": "lastDrawAt", "type": "uint256" },
        { "name": "accumulatedYield", "type": "uint256" },
        { "name": "participantCount", "type": "uint256" }
      ]
    }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPoolCount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActivePools",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isParticipant",
    "inputs": [
      { "name": "_poolId", "type": "uint256" },
      { "name": "_wallet", "type": "address" }
    ],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getParticipant",
    "inputs": [
      { "name": "_poolId", "type": "uint256" },
      { "name": "_wallet", "type": "address" }
    ],
    "outputs": [{
      "type": "tuple",
      "components": [
        { "name": "wallet", "type": "address" },
        { "name": "collateralDeposited", "type": "uint256" },
        { "name": "yieldAccrued", "type": "uint256" },
        { "name": "hasWon", "type": "bool" },
        { "name": "paidThisPeriod", "type": "bool" },
        { "name": "joinPeriod", "type": "uint256" }
      ]
    }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCollateralRequired",
    "inputs": [{ "name": "_poolId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getWinners",
    "inputs": [{ "name": "_poolId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "address[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getParticipants",
    "inputs": [{ "name": "_poolId", "type": "uint256" }],
    "outputs": [{
      "type": "tuple[]",
      "components": [
        { "name": "wallet", "type": "address" },
        { "name": "collateralDeposited", "type": "uint256" },
        { "name": "yieldAccrued", "type": "uint256" },
        { "name": "hasWon", "type": "bool" },
        { "name": "paidThisPeriod", "type": "bool" },
        { "name": "joinPeriod", "type": "uint256" }
      ]
    }],
    "stateMutability": "view"
  },

  // Events
  {
    "type": "event",
    "name": "PoolCreated",
    "inputs": [
      { "name": "poolId", "type": "uint256", "indexed": true },
      { "name": "owner", "type": "address", "indexed": true },
      { "name": "name", "type": "string" },
      { "name": "iuranAmount", "type": "uint256" }
    ]
  },
  {
    "type": "event",
    "name": "JoinedPool",
    "inputs": [
      { "name": "poolId", "type": "uint256", "indexed": true },
      { "name": "participant", "type": "address", "indexed": true },
      { "name": "collateralAmount", "type": "uint256" }
    ]
  },
  {
    "type": "event",
    "name": "IuranPaid",
    "inputs": [
      { "name": "poolId", "type": "uint256", "indexed": true },
      { "name": "participant", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256" },
      { "name": "period", "type": "uint256" }
    ]
  },
  {
    "type": "event",
    "name": "WinnerDrawn",
    "inputs": [
      { "name": "poolId", "type": "uint256", "indexed": true },
      { "name": "winner", "type": "address", "indexed": true },
      { "name": "prizeAmount", "type": "uint256" },
      { "name": "period", "type": "uint256" }
    ]
  },
  {
    "type": "event",
    "name": "WinnerVoted",
    "inputs": [
      { "name": "poolId", "type": "uint256", "indexed": true },
      { "name": "winner", "type": "address", "indexed": true },
      { "name": "voteCount", "type": "uint256" },
      { "name": "period", "type": "uint256" }
    ]
  },
  {
    "type": "event",
    "name": "PrizeClaimed",
    "inputs": [
      { "name": "poolId", "type": "uint256", "indexed": true },
      { "name": "winner", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256" }
    ]
  },
  {
    "type": "event",
    "name": "CollateralWithdrawn",
    "inputs": [
      { "name": "poolId", "type": "uint256", "indexed": true },
      { "name": "participant", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256" }
    ]
  }
] as const
