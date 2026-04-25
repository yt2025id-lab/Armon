// Contract Constants - matches Armon.sol
export const COLLATERAL_BPS = 12500 // 125% in basis points
export const MIN_PARTICIPANTS = 3
export const MAX_PARTICIPANTS = 50
export const BASE_YIELD_BPS = 500 // 5% APY basis points

// Contract addresses - update after deploy
export const ARMON_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' as const

// ABI function signatures for reference
export const ARMON_ABI = [
  // Pool Creation
  'function createPool(string _name, uint256 _iuranAmount, uint256 _maxParticipants, uint256 _totalPeriods) external returns (uint256 poolId)',
  'function getPoolCount() external view returns (uint256)',
  'function getActivePools() external view returns (uint256[] memory)',
  'function getPool(uint256 _poolId) external view returns (PoolInfo memory)',

  // Joining & Iuran
  'function joinPool(uint256 _poolId) external payable',
  'function payIuran(uint256 _poolId) external payable',
  'function getCollateralRequired(uint256 _poolId) external view returns (uint256)',

  // Winners & Voting
  'function drawWinner(uint256 _poolId) external',
  'function voteWinner(uint256 _poolId, address _candidate) external',
  'function getWinners(uint256 _poolId) external view returns (address[] memory)',
  'function claimPrize(uint256 _poolId) external',

  // Participant queries
  'function isParticipant(uint256 _poolId, address _wallet) external view returns (bool)',
  'function getParticipant(uint256 _poolId, address _wallet) external view returns (Participant memory)',
  'function getParticipants(uint256 _poolId) external view returns (Participant[] memory)',

  // Withdrawal
  'function withdrawCollateral(uint256 _poolId) external',
  'function closePool(uint256 _poolId) external',

  // Events (for indexing)
  'event PoolCreated(uint256 indexed poolId, address indexed owner, string name, uint256 iuranAmount)',
  'event JoinedPool(uint256 indexed poolId, address indexed participant, uint256 collateralAmount)',
  'event IuranPaid(uint256 indexed poolId, address indexed participant, uint256 amount, uint256 period)',
  'event WinnerDrawn(uint256 indexed poolId, address indexed winner, uint256 prizeAmount, uint256 period)',
  'event WinnerVoted(uint256 indexed poolId, address indexed winner, uint256 voteCount, uint256 period)',
  'event PrizeClaimed(uint256 indexed poolId, address indexed winner, uint256 amount)',
  'event CollateralWithdrawn(uint256 indexed poolId, address indexed participant, uint256 amount)',
] as const

// PoolInfo struct (for ABI encoding)
export const POOLINFO_ABI = [
  'struct PoolInfo { string name; uint256 iuranAmount; uint256 maxParticipants; uint256 collateralBps; uint256 currentPeriod; uint256 totalPeriods; bool isActive; address owner; uint256 createdAt; uint256 lastDrawAt; uint256 accumulatedYield; uint256 participantCount; }'
] as const

// Participant struct (for ABI encoding)
export const PARTICIPANT_ABI = [
  'struct Participant { address wallet; uint256 collateralDeposited; uint256 yieldAccrued; bool hasWon; bool paidThisPeriod; uint256 joinPeriod; }'
] as const