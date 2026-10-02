# FundFlow: Blockchain-Based Transparent Charity Donation System

> **Academic Mini Project**  
> **Course:** Blockchain Technology (BCT)  
> **Affiliation:** Savitribai Phule Pune University (SPPU) — Department of Computer Engineering / Information Technology  

---

## 1. Abstract & Problem Statement

Traditional charitable donation mechanisms depend on centralized intermediaries, exposing donors to opaque financial management, high administrative overhead, and zero visibility into fund disbursement. 

**FundFlow** is a decentralized application (dApp) developed as an academic mini project for the **SPPU Blockchain Technology (BCT)** curriculum. It leverages the Ethereum blockchain to eliminate intermediary opacity. Donations are managed via an audited, immutable smart contract escrow on Ethereum Sepolia, providing real-time tracking, cryptographic proofs of expenditure, and publicly verifiable audit trails.

---

## 2. SPPU BCT Syllabus Mapping

| SPPU BCT Syllabus Unit | Core Curriculum Concept | Project Implementation in FundFlow |
| :--- | :--- | :--- |
| **Unit I: Blockchain Fundamentals** | Distributed Ledgers, P2P Networks, Cryptographic Hashing | Immutable on-chain transaction records; SHA-256/Keccak-256 transaction indexing on Ethereum. |
| **Unit II: Ethereum Architecture** | EVM (Ethereum Virtual Machine), Accounts, Gas Model, State Transitions | State variables (`mapping`, `struct`), gas-optimized transactions, Wei/Ether conversion. |
| **Unit III: Smart Contract Development** | Solidity Programming, Modifiers, Events, Fallback/Payable functions | `FundFlow.sol` written in Solidity `^0.8.20`; custom modifiers (`onlyOrganizer`, `nonReentrant`), indexed events. |
| **Unit IV: Security & Best Practices** | Reentrancy Vulnerabilities, Access Control, Overflow Checks | Checks-Effects-Interactions pattern, custom mutex reentrancy lock, native Solidity 0.8+ arithmetic checks. |
| **Unit V: Decentralized Storage** | Off-Chain Storage, Content Addressing, IPFS | IPFS integration (Pinata Gateway) for campaign media and proof-of-work withdrawal receipts. |
| **Unit VI: dApp Engineering** | Web3 Integration, Client Providers, Testnets, Wallets | Full-stack dApp built with React + Vite, Ethers.js v6, MetaMask EIP-1193 integration on Ethereum Sepolia. |

---

## 3. System Architecture & Data Flow

```text
+---------------------+       +-----------------------+       +-----------------------------+
|    Client (Donor/   | <===> |    Web3 Provider      | <===> |      Ethereum Network       |
|      Organizer)     |       | (MetaMask + Ethers.js)|       |      (Sepolia Testnet)      |
+---------------------+       +-----------------------+       +-----------------------------+
           |                                                                 |
           | Upload Image / Receipt Proof                                    | Emits Events
           v                                                                 v
+---------------------+                                       +-----------------------------+
|    IPFS Storage     |                                       |     FundFlow.sol Escrow     |
|   (Pinata / CID)    | ===================================> |    (Audit Logs & Balances)  |
+---------------------+         Stores Hash On-Chain          +-----------------------------+
```

---

## 4. Smart Contract Architecture (`FundFlow.sol`)

### 4.1 Data Structures
```solidity
enum Category { Medical, Education, Disaster, Food, Community }

struct Donation {
    address donor;
    uint256 amount;
    uint256 timestamp;
}

struct Withdrawal {
    uint256 amount;
    string purpose;
    string receiptIpfsHash; // Off-chain proof of expenditure
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
```

### 4.2 Key Contract Functions
- `createCampaign(...)`: Registers a new fundraising initiative with an target amount, duration, and IPFS metadata hash.
- `donate(uint256 _campaignId)`: *Payable* function accepting ETH, automatically updating contract escrow balance and emitting a `Donated` event.
- `withdrawFunds(uint256 _campaignId, uint256 _amount, string memory _purpose, string memory _receiptIpfsHash)`: Allows verified campaign organizers to withdraw collected funds upon logging expenditure purpose and receipt proof.
- `getPlatformOverview()`: Read-only view function returning aggregated metrics (total ETH raised, donations count, active campaigns).

---

## 5. Security & Academic Best Practices

1. **Reentrancy Protection:** All state modifications precede external value transfers (`Checks-Effects-Interactions` pattern), further reinforced by a custom `nonReentrant` lock.
2. **Access Control:** Restricted operations (fund withdrawals and campaign status toggling) strictly require `msg.sender == campaign.organizer`.
3. **Escrow Invariant:** Organizers can never withdraw more funds than `amountCollected - amountWithdrawn`.
4. **Decentralized Auditability:** Expenditure receipts are content-addressed on IPFS and permanently etched into blockchain state logs.

---

## 6. Live Testnet Deployment

| Parameter | Value |
| :--- | :--- |
| **Network** | Ethereum Sepolia Testnet (Chain ID: `11155111`) |
| **Contract Address** | `0xa96C6Da4CDDdE292918efCdA174F933BaBE918fa` |
| **Block Explorer** | [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xa96C6Da4CDDdE292918efCdA174F933BaBE918fa) |
| **Solidity Compiler** | `0.8.20` (Optimization: 200 runs, EVM: Paris) |

---

## 7. Setup & Execution Guide

### Prerequisites
- Node.js (v18+ or v20+)
- MetaMask browser extension configured for the Sepolia network

### 7.1 Smart Contract Compilation & Automated Tests
```bash
# Install root dependencies
npm install

# Run automated Hardhat test suite (12 unit tests)
npx hardhat test

# Optional: Deploy to local or Sepolia network
npx hardhat run scripts/deploy.js --network sepolia
```

### 7.2 Running the Frontend dApp
```bash
# Navigate to frontend and install dependencies
cd frontend
npm install

# Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to interact with the live platform.

---

## 8. Learning Outcomes (SPPU BCT)

Through the implementation of FundFlow, the following academic learning objectives were accomplished:
- Practical understanding of EVM state management and Solidity smart contract development.
- Hands-on experience with gas cost estimation and optimization patterns.
- Integration of decentralized storage (IPFS) with on-chain cryptographic hashes.
- End-to-end dApp development integrating frontend Web3 providers (Ethers.js v6) and browser wallets (MetaMask).
- Practical security auditing against reentrancy, integer errors, and unauthorized state mutation.

---
*Submitted as an academic mini project for the Blockchain Technology (BCT) laboratory curriculum, Savitribai Phule Pune University (SPPU).*
