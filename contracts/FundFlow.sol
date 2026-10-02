// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FundFlow - Transparent Charity Donation Escrow
 * @author FundFlow Protocol Team
 * @notice Facilitates transparent fundraising, milestone-based withdrawals, and public tracking on Ethereum.
 */
contract FundFlow {
    // --- Data Structures ---
    enum Category { Medical, Education, Disaster, Food, Community }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    struct Withdrawal {
        uint256 amount;
        string purpose;
        string receiptIpfsHash; // Cryptographic / IPFS proof of expenditure
        uint256 timestamp;
    }

    struct Campaign {
        uint256 id;
        address payable organizer;
        string title;
        string description;
        string imageIpfsHash;
        Category category;
        uint256 targetAmount;
        uint256 amountCollected;
        uint256 amountWithdrawn;
        uint256 deadline;
        bool isActive;
        bool exists;
    }

    // --- State Variables ---
    uint256 public campaignCount;
    uint256 public totalDonationsCount;
    uint256 public totalEthRaised;
    
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Donation[]) public campaignDonations;
    mapping(uint256 => Withdrawal[]) public campaignWithdrawals;
    mapping(address => uint256[]) public donorCampaignHistory;

    // Custom Reentrancy Lock
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _reentrancyStatus;

    // --- Events for Indexing & Transparency ---
    event CampaignCreated(
        uint256 indexed id,
        address indexed organizer,
        string title,
        Category category,
        uint256 targetAmount,
        uint256 deadline
    );

    event Donated(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );

    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed organizer,
        uint256 amount,
        string purpose,
        string receiptIpfsHash,
        uint256 timestamp
    );

    event CampaignStateChanged(uint256 indexed campaignId, bool isActive);

    // --- Modifiers ---
    modifier nonReentrant() {
        require(_reentrancyStatus != _ENTERED, "ReentrancyGuard: reentrant call");
        _reentrancyStatus = _ENTERED;
        _;
        _reentrancyStatus = _NOT_ENTERED;
    }

    modifier onlyOrganizer(uint256 _campaignId) {
        require(campaigns[_campaignId].exists, "Campaign does not exist");
        require(msg.sender == campaigns[_campaignId].organizer, "Unauthorized: Only organizer");
        _;
    }

    constructor() {
        _reentrancyStatus = _NOT_ENTERED;
    }

    // --- Core Functions ---

    /**
     * @notice Launch a new fundraising campaign
     * @param _title Title of the campaign
     * @param _description Detailed explanation and humanitarian cause
     * @param _imageIpfsHash IPFS CID or media URL of campaign banner
     * @param _category Categorical classification (Medical, Education, etc.)
     * @param _targetAmount Funding target in Wei
     * @param _durationInDays Campaign active duration in days
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _imageIpfsHash,
        Category _category,
        uint256 _targetAmount,
        uint256 _durationInDays
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_targetAmount > 0, "Target must be > 0");
        require(_durationInDays > 0 && _durationInDays <= 365, "Invalid duration (1-365 days)");

        campaignCount++;
        uint256 campaignId = campaignCount;

        campaigns[campaignId] = Campaign({
            id: campaignId,
            organizer: payable(msg.sender),
            title: _title,
            description: _description,
            imageIpfsHash: _imageIpfsHash,
            category: _category,
            targetAmount: _targetAmount,
            amountCollected: 0,
            amountWithdrawn: 0,
            deadline: block.timestamp + (_durationInDays * 1 days),
            isActive: true,
            exists: true
        });

        emit CampaignCreated(
            campaignId,
            msg.sender,
            _title,
            _category,
            _targetAmount,
            block.timestamp + (_durationInDays * 1 days)
        );

        return campaignId;
    }

    /**
     * @notice Donate ETH to an active campaign
     * @param _campaignId ID of the campaign to support
     */
    function donate(uint256 _campaignId) external payable nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.exists, "Campaign does not exist");
        require(campaign.isActive, "Campaign is closed");
        require(block.timestamp <= campaign.deadline, "Campaign deadline has passed");
        require(msg.value > 0, "Donation must be greater than 0");

        campaign.amountCollected += msg.value;
        totalEthRaised += msg.value;
        totalDonationsCount++;

        campaignDonations[_campaignId].push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        donorCampaignHistory[msg.sender].push(_campaignId);

        emit Donated(_campaignId, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice Organizer withdraws funds with required transparent proof & reasoning
     * @param _campaignId ID of the campaign
     * @param _amount Amount in Wei to withdraw
     * @param _purpose Detailed reasoning for the expenditure
     * @param _receiptIpfsHash IPFS hash of invoice, medical bill, or purchase proof
     */
    function withdrawFunds(
        uint256 _campaignId,
        uint256 _amount,
        string memory _purpose,
        string memory _receiptIpfsHash
    ) external onlyOrganizer(_campaignId) nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        uint256 availableBalance = campaign.amountCollected - campaign.amountWithdrawn;
        require(_amount > 0 && _amount <= availableBalance, "Insufficient campaign balance");
        require(bytes(_purpose).length > 0, "Withdrawal purpose required");

        // Checks-Effects-Interactions pattern
        campaign.amountWithdrawn += _amount;

        campaignWithdrawals[_campaignId].push(Withdrawal({
            amount: _amount,
            purpose: _purpose,
            receiptIpfsHash: _receiptIpfsHash,
            timestamp: block.timestamp
        }));

        (bool success, ) = campaign.organizer.call{value: _amount}("");
        require(success, "ETH transfer failed");

        emit FundsWithdrawn(_campaignId, msg.sender, _amount, _purpose, _receiptIpfsHash, block.timestamp);
    }

    /**
     * @notice Toggle active state of a campaign
     * @param _campaignId ID of the campaign
     */
    function toggleCampaignStatus(uint256 _campaignId) external onlyOrganizer(_campaignId) {
        campaigns[_campaignId].isActive = !campaigns[_campaignId].isActive;
        emit CampaignStateChanged(_campaignId, campaigns[_campaignId].isActive);
    }

    // --- View Functions for Frontend UI & Auditing ---

    /**
     * @notice Fetch all campaigns in a single query
     */
    function getAllCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory all = new Campaign[](campaignCount);
        for (uint256 i = 1; i <= campaignCount; i++) {
            all[i - 1] = campaigns[i];
        }
        return all;
    }

    /**
     * @notice Fetch a specific campaign
     */
    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        require(campaigns[_campaignId].exists, "Campaign does not exist");
        return campaigns[_campaignId];
    }

    /**
     * @notice Fetch all donations made to a campaign
     */
    function getDonations(uint256 _campaignId) external view returns (Donation[] memory) {
        return campaignDonations[_campaignId];
    }

    /**
     * @notice Fetch all transparent withdrawals for a campaign
     */
    function getWithdrawals(uint256 _campaignId) external view returns (Withdrawal[] memory) {
        return campaignWithdrawals[_campaignId];
    }

    /**
     * @notice Fetch campaign IDs that a specific donor contributed to
     */
    function getDonorHistory(address _donor) external view returns (uint256[] memory) {
        return donorCampaignHistory[_donor];
    }

    /**
     * @notice High-level platform statistics for dashboard metric cards
     */
    function getPlatformOverview() external view returns (
        uint256 _totalEth,
        uint256 _totalDonations,
        uint256 _totalCampaigns
    ) {
        return (totalEthRaised, totalDonationsCount, campaignCount);
    }
}
