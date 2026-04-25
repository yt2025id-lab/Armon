export const ARMON_ABI = [
  // Read Functions
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
    "name": "COLLATERAL_BPS",
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

  // Pool Functions
  {
    "type": "function",
    "name": "pools",
    "inputs": [{ "name": "", "type": "uint256" }],
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

  // Participant Functions
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

  // Events
  {
    "type": "event",
    "name": "PoolCreated",
    "inputs": [
      { "name": "poolId", "type": "uint256", "indexed": true },
      { "name": "owner", "type": "address", "indexed": true },
      { "name": "name", "type": "string" }
    ]
  },
  {
    "type": "event",
    "name": "JoinedPool",
    "inputs": [
      { "name": "poolId", "type": "uint256", "indexed": true },
      { "name": "participant", "type": "address", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "WinnerDrawn",
    "inputs": [
      { "name": "poolId", "type": "uint256", "indexed": true },
      { "name": "winner", "type": "address", "indexed": true }
    ]
  }
] as const