// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Armon - Decentralized Arisan with Collateral & Yield
/// @notice Community savings pool on Monad with 125% collateral security
contract Armon {
    // ============ Constants ============
    uint256 public constant COLLATERAL_BPS = 12500; // 125% in basis points
    uint256 public constant MIN_PARTICIPANTS = 3;
    uint256 public constant MAX_PARTICIPANTS = 50;
    uint256 public constant BASE_YIELD_BPS = 500; // 5% APY basis points (simplified)

    // ============ Errors ============
    error PoolNotFound();
    error PoolNotActive();
    error PoolFull();
    error AlreadyJoined();
    error NotParticipant();
    error AlreadyWon();
    error InsufficientCollateral();
    error NotPoolOwner();
    error PeriodNotDue();
    error AlreadyClaimed();
    error NotWinner();
    error TransferFailed();

    // ============ Types ============
    struct PoolInfo {
        string name;
        uint256 iuranAmount;
        uint256 maxParticipants;
        uint256 collateralBps;
        uint256 currentPeriod;
        uint256 totalPeriods;
        bool isActive;
        address owner;
        uint256 createdAt;
        uint256 lastDrawAt;
        uint256 accumulatedYield;
        uint256 participantCount;
    }

    struct Participant {
        address wallet;
        uint256 collateralDeposited;
        uint256 yieldAccrued;
        bool hasWon;
        bool paidThisPeriod;
        uint256 joinPeriod;
    }

    struct Vote {
        address voter;
        address candidate;
        uint256 timestamp;
    }

    // ============ State ============
    PoolInfo[] public pools;
    mapping(uint256 => mapping(uint256 => Participant)) public poolParticipants; // poolId => index => Participant
    mapping(uint256 => address[]) public poolParticipantList; // poolId => list of addresses
    mapping(uint256 => mapping(address => uint256)) public participantIndex; // poolId => wallet => index
    mapping(uint256 => mapping(address => bool)) public isParticipantMap; // poolId => wallet => bool
    mapping(uint256 => address[]) public poolWinners;
    mapping(uint256 => mapping(address => uint256)) public votes;
    mapping(uint256 => Vote[]) public poolVotes;

    // ============ Events ============
    event PoolCreated(uint256 indexed poolId, address indexed owner, string name, uint256 iuranAmount);
    event JoinedPool(uint256 indexed poolId, address indexed participant, uint256 collateralAmount);
    event IuranPaid(uint256 indexed poolId, address indexed participant, uint256 amount, uint256 period);
    event WinnerDrawn(uint256 indexed poolId, address indexed winner, uint256 prizeAmount, uint256 period);
    event WinnerVoted(uint256 indexed poolId, address indexed winner, uint256 voteCount, uint256 period);
    event PrizeClaimed(uint256 indexed poolId, address indexed winner, uint256 amount);
    event CollateralWithdrawn(uint256 indexed poolId, address indexed participant, uint256 amount);

    // ============ Modifiers ============
    modifier onlyPoolOwner(uint256 _poolId) {
        require(pools[_poolId].owner == msg.sender, "Not pool owner");
        _;
    }

    modifier onlyParticipant(uint256 _poolId) {
        require(isParticipant(_poolId, msg.sender), "Not participant");
        _;
    }

    // ============ Core Functions ============

    /// @notice Create a new arisan pool
    function createPool(
        string calldata _name,
        uint256 _iuranAmount,
        uint256 _maxParticipants,
        uint256 _totalPeriods
    ) external returns (uint256 poolId) {
        require(_maxParticipants >= MIN_PARTICIPANTS && _maxParticipants <= MAX_PARTICIPANTS, "Invalid participants");
        require(_iuranAmount > 0, "Invalid iuran amount");
        require(_totalPeriods >= 1 && _totalPeriods <= 12, "Invalid periods");

        PoolInfo memory newPool = PoolInfo({
            name: _name,
            iuranAmount: _iuranAmount,
            maxParticipants: _maxParticipants,
            collateralBps: COLLATERAL_BPS,
            currentPeriod: 1,
            totalPeriods: _totalPeriods,
            isActive: true,
            owner: msg.sender,
            createdAt: block.timestamp,
            lastDrawAt: block.timestamp,
            accumulatedYield: 0,
            participantCount: 0
        });

        pools.push(newPool);
        emit PoolCreated(pools.length - 1, msg.sender, _name, _iuranAmount);
        return pools.length - 1;
    }

    /// @notice Join an arisan pool (requires collateral deposit)
    function joinPool(uint256 _poolId) external payable {
        PoolInfo storage pool = pools[_poolId];

        require(_poolId < pools.length, "Pool not found");
        require(pool.isActive, "Pool not active");
        require(pool.participantCount < pool.maxParticipants, "Pool full");
        require(!isParticipant(_poolId, msg.sender), "Already joined");

        uint256 collateralRequired = (pool.iuranAmount * pool.collateralBps) / 10000;
        require(msg.value >= collateralRequired, "Insufficient collateral");

        // Refund excess payment
        if (msg.value > collateralRequired) {
            payable(msg.sender).transfer(msg.value - collateralRequired);
        }

        uint256 newIndex = pool.participantCount;
        poolParticipants[_poolId][newIndex] = Participant({
            wallet: msg.sender,
            collateralDeposited: collateralRequired,
            yieldAccrued: 0,
            hasWon: false,
            paidThisPeriod: false,
            joinPeriod: pool.currentPeriod
        });

        poolParticipantList[_poolId].push(msg.sender);
        participantIndex[_poolId][msg.sender] = newIndex;
        isParticipantMap[_poolId][msg.sender] = true;
        pool.participantCount++;

        emit JoinedPool(_poolId, msg.sender, collateralRequired);
    }

    /// @notice Pay monthly iuran contribution
    function payIuran(uint256 _poolId) external payable onlyParticipant(_poolId) {
        PoolInfo storage pool = pools[_poolId];

        require(pool.isActive, "Pool not active");

        uint256 pIndex = participantIndex[_poolId][msg.sender];
        require(!poolParticipants[_poolId][pIndex].paidThisPeriod, "Already paid this period");
        require(msg.value >= pool.iuranAmount, "Insufficient iuran");

        // Refund excess
        if (msg.value > pool.iuranAmount) {
            payable(msg.sender).transfer(msg.value - pool.iuranAmount);
        }

        poolParticipants[_poolId][pIndex].paidThisPeriod = true;
        emit IuranPaid(_poolId, msg.sender, pool.iuranAmount, pool.currentPeriod);

        // Accumulate yield (simplified)
        uint256 yieldAmount = (pool.iuranAmount * BASE_YIELD_BPS) / 10000;
        pool.accumulatedYield += yieldAmount;
        poolParticipants[_poolId][pIndex].yieldAccrued += yieldAmount;
    }

    /// @notice Draw random winner using pseudo-randomness (MVP version)
    function drawWinner(uint256 _poolId) external onlyPoolOwner(_poolId) {
        PoolInfo storage pool = pools[_poolId];

        require(pool.isActive, "Pool not active");
        require(pool.participantCount >= MIN_PARTICIPANTS, "Not enough participants");

        // Count eligible participants (paid and haven't won)
        uint256 paidCount = 0;
        for (uint256 i = 0; i < pool.participantCount; i++) {
            if (poolParticipants[_poolId][i].paidThisPeriod && !poolParticipants[_poolId][i].hasWon) {
                paidCount++;
            }
        }
        require(paidCount >= MIN_PARTICIPANTS, "Not all paid");

        // Get eligible participants
        address[] memory eligible = new address[](pool.participantCount);
        uint256 eligibleCount = 0;
        for (uint256 i = 0; i < pool.participantCount; i++) {
            if (poolParticipants[_poolId][i].paidThisPeriod && !poolParticipants[_poolId][i].hasWon) {
                eligible[eligibleCount++] = poolParticipants[_poolId][i].wallet;
            }
        }
        require(eligibleCount > 0, "No eligible participants");

        // Pseudo-random selection (using block data for MVP)
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            msg.sender,
            _poolId,
            pool.currentPeriod
        ))) % eligibleCount;

        address winner = eligible[randomNumber];
        uint256 winnerIndex = participantIndex[_poolId][winner];

        poolParticipants[_poolId][winnerIndex].hasWon = true;
        poolWinners[_poolId].push(winner);

        uint256 prizeAmount = pool.iuranAmount * pool.participantCount;
        pool.lastDrawAt = block.timestamp;
        pool.currentPeriod++;

        emit WinnerDrawn(_poolId, winner, prizeAmount, pool.currentPeriod - 1);

        // Reset paid status for next period
        for (uint256 i = 0; i < pool.participantCount; i++) {
            poolParticipants[_poolId][i].paidThisPeriod = false;
        }
    }

    /// @notice Manual vote for winner (alternative to random draw)
    function voteWinner(uint256 _poolId, address _candidate) external onlyParticipant(_poolId) {
        PoolInfo storage pool = pools[_poolId];

        require(pool.isActive, "Pool not active");
        require(isParticipant(_poolId, _candidate), "Candidate not a participant");

        uint256 candidateIdx = participantIndex[_poolId][_candidate];
        votes[_poolId][msg.sender] = candidateIdx + 1;

        poolVotes[_poolId].push(Vote({
            voter: msg.sender,
            candidate: _candidate,
            timestamp: block.timestamp
        }));

        // Count votes for candidate
        uint256 voteCount = 0;
        for (uint256 i = 0; i < poolVotes[_poolId].length; i++) {
            if (poolVotes[_poolId][i].candidate == _candidate) {
                voteCount++;
            }
        }

        if (voteCount > pool.participantCount / 2) {
            uint256 winnerIdx = participantIndex[_poolId][_candidate];
            poolParticipants[_poolId][winnerIdx].hasWon = true;
            poolWinners[_poolId].push(_candidate);

            uint256 prizeAmount = pool.iuranAmount * pool.participantCount;
            pool.lastDrawAt = block.timestamp;
            pool.currentPeriod++;

            emit WinnerVoted(_poolId, _candidate, voteCount, pool.currentPeriod - 1);

            // Reset paid status
            for (uint256 i = 0; i < pool.participantCount; i++) {
                poolParticipants[_poolId][i].paidThisPeriod = false;
            }
        }
    }

    /// @notice Claim prize as winner
    function claimPrize(uint256 _poolId) external onlyParticipant(_poolId) {
        uint256 pIndex = participantIndex[_poolId][msg.sender];
        require(poolParticipants[_poolId][pIndex].hasWon, "Not a winner");

        PoolInfo storage pool = pools[_poolId];
        uint256 prizeAmount = pool.iuranAmount * pool.participantCount;

        (bool success,) = payable(msg.sender).call{value: prizeAmount}("");
        require(success, "Transfer failed");

        emit PrizeClaimed(_poolId, msg.sender, prizeAmount);
    }

    /// @notice Withdraw collateral after pool completion
    function withdrawCollateral(uint256 _poolId) external onlyParticipant(_poolId) {
        uint256 pIndex = participantIndex[_poolId][msg.sender];
        PoolInfo storage pool = pools[_poolId];

        require(poolParticipants[_poolId][pIndex].hasWon || !pool.isActive, "Cannot withdraw yet");

        uint256 amount = poolParticipants[_poolId][pIndex].collateralDeposited +
                        poolParticipants[_poolId][pIndex].yieldAccrued;
        require(amount > 0, "Nothing to withdraw");

        poolParticipants[_poolId][pIndex].collateralDeposited = 0;
        poolParticipants[_poolId][pIndex].yieldAccrued = 0;

        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit CollateralWithdrawn(_poolId, msg.sender, amount);
    }

    /// @notice Close pool (only by owner)
    function closePool(uint256 _poolId) external onlyPoolOwner(_poolId) {
        pools[_poolId].isActive = false;
    }

    // ============ View Functions ============

    function getPool(uint256 _poolId) external view returns (PoolInfo memory) {
        require(_poolId < pools.length, "Pool not found");
        return pools[_poolId];
    }

    function getPoolCount() external view returns (uint256) {
        return pools.length;
    }

    function getActivePools() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < pools.length; i++) {
            if (pools[i].isActive) count++;
        }

        uint256[] memory activeIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < pools.length; i++) {
            if (pools[i].isActive) {
                activeIds[index++] = i;
            }
        }
        return activeIds;
    }

    function isParticipant(uint256 _poolId, address _wallet) public view returns (bool) {
        return isParticipantMap[_poolId][_wallet];
    }

    function getParticipant(uint256 _poolId, address _wallet) external view returns (Participant memory) {
        require(isParticipantMap[_poolId][_wallet], "Not participant");
        uint256 idx = participantIndex[_poolId][_wallet];
        return poolParticipants[_poolId][idx];
    }

    function getCollateralRequired(uint256 _poolId) external view returns (uint256) {
        PoolInfo memory pool = pools[_poolId];
        return (pool.iuranAmount * pool.collateralBps) / 10000;
    }

    function getWinners(uint256 _poolId) external view returns (address[] memory) {
        return poolWinners[_poolId];
    }

    function getParticipants(uint256 _poolId) external view returns (Participant[] memory) {
        PoolInfo memory pool = pools[_poolId];
        Participant[] memory result = new Participant[](pool.participantCount);
        for (uint256 i = 0; i < pool.participantCount; i++) {
            result[i] = poolParticipants[_poolId][i];
        }
        return result;
    }
}
