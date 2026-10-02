const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FundFlow Smart Contract", function () {
  let fundFlow;
  let owner, organizer, donor1, donor2, attacker;

  beforeEach(async function () {
    [owner, organizer, donor1, donor2, attacker] = await ethers.getSigners();

    const FundFlowFactory = await ethers.getContractFactory("FundFlow");
    fundFlow = await FundFlowFactory.deploy();
    await fundFlow.waitForDeployment();
  });

  describe("Deployment & Initial State", function () {
    it("should initialize with zero campaigns and zero donations", async function () {
      expect(await fundFlow.campaignCount()).to.equal(0);
      expect(await fundFlow.totalDonationsCount()).to.equal(0);
      expect(await fundFlow.totalEthRaised()).to.equal(0);

      const [totalEth, totalDonations, totalCampaigns] = await fundFlow.getPlatformOverview();
      expect(totalEth).to.equal(0);
      expect(totalDonations).to.equal(0);
      expect(totalCampaigns).to.equal(0);
    });
  });

  describe("Campaign Creation", function () {
    it("should create a campaign successfully", async function () {
      const target = ethers.parseEther("5.0");
      const durationDays = 30;

      const tx = await fundFlow.connect(organizer).createCampaign(
        "Emergency Flood Relief",
        "Providing food and shelter to flood victims",
        "QmSampleIpfsHash123",
        2, // Category: Disaster
        target,
        durationDays
      );

      await expect(tx)
        .to.emit(fundFlow, "CampaignCreated")
        .withArgs(1, organizer.address, "Emergency Flood Relief", 2, target, (val) => val > 0);

      expect(await fundFlow.campaignCount()).to.equal(1);

      const campaign = await fundFlow.getCampaign(1);
      expect(campaign.id).to.equal(1);
      expect(campaign.organizer).to.equal(organizer.address);
      expect(campaign.title).to.equal("Emergency Flood Relief");
      expect(campaign.targetAmount).to.equal(target);
      expect(campaign.amountCollected).to.equal(0);
      expect(campaign.amountWithdrawn).to.equal(0);
      expect(campaign.isActive).to.be.true;
      expect(campaign.exists).to.be.true;
    });

    it("should reject campaign creation with invalid parameters", async function () {
      const target = ethers.parseEther("5.0");

      // Empty title
      await expect(
        fundFlow.connect(organizer).createCampaign("", "Desc", "hash", 0, target, 30)
      ).to.be.revertedWith("Title cannot be empty");

      // Zero target
      await expect(
        fundFlow.connect(organizer).createCampaign("Title", "Desc", "hash", 0, 0, 30)
      ).to.be.revertedWith("Target must be > 0");

      // Invalid duration (0 days or > 365 days)
      await expect(
        fundFlow.connect(organizer).createCampaign("Title", "Desc", "hash", 0, target, 0)
      ).to.be.revertedWith("Invalid duration (1-365 days)");

      await expect(
        fundFlow.connect(organizer).createCampaign("Title", "Desc", "hash", 0, target, 366)
      ).to.be.revertedWith("Invalid duration (1-365 days)");
    });
  });

  describe("Donations", function () {
    beforeEach(async function () {
      await fundFlow.connect(organizer).createCampaign(
        "Children Hospital Support",
        "Life-saving surgeries for pediatric patients",
        "QmMedicalHash456",
        0, // Category: Medical
        ethers.parseEther("10.0"),
        60
      );
    });

    it("should accept valid donations and update balances", async function () {
      const donationAmount = ethers.parseEther("1.5");

      const tx = await fundFlow.connect(donor1).donate(1, { value: donationAmount });

      await expect(tx)
        .to.emit(fundFlow, "Donated")
        .withArgs(1, donor1.address, donationAmount, (ts) => ts > 0);

      const campaign = await fundFlow.getCampaign(1);
      expect(campaign.amountCollected).to.equal(donationAmount);
      expect(await fundFlow.totalEthRaised()).to.equal(donationAmount);
      expect(await fundFlow.totalDonationsCount()).to.equal(1);

      // Verify donations list
      const donations = await fundFlow.getDonations(1);
      expect(donations.length).to.equal(1);
      expect(donations[0].donor).to.equal(donor1.address);
      expect(donations[0].amount).to.equal(donationAmount);

      // Verify donor history
      const history = await fundFlow.getDonorHistory(donor1.address);
      expect(history.length).to.equal(1);
      expect(history[0]).to.equal(1);
    });

    it("should reject 0 ETH donation", async function () {
      await expect(
        fundFlow.connect(donor1).donate(1, { value: 0 })
      ).to.be.revertedWith("Donation must be greater than 0");
    });

    it("should reject donation to non-existent campaign", async function () {
      await expect(
        fundFlow.connect(donor1).donate(999, { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Campaign does not exist");
    });

    it("should reject donation to an inactive campaign", async function () {
      await fundFlow.connect(organizer).toggleCampaignStatus(1);

      await expect(
        fundFlow.connect(donor1).donate(1, { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Campaign is closed");
    });
  });

  describe("Withdrawals & Milestone Proof", function () {
    const donationAmount = ethers.parseEther("2.0");

    beforeEach(async function () {
      await fundFlow.connect(organizer).createCampaign(
        "School Construction",
        "Building 5 classrooms in rural district",
        "QmSchoolHash789",
        1, // Category: Education
        ethers.parseEther("5.0"),
        90
      );

      await fundFlow.connect(donor1).donate(1, { value: donationAmount });
    });

    it("should allow organizer to withdraw funds with receipt proof", async function () {
      const withdrawAmount = ethers.parseEther("1.0");
      const purpose = "Purchased bricks and cement for foundation";
      const receiptHash = "QmReceiptFoundation123";

      const initialOrganizerBalance = await ethers.provider.getBalance(organizer.address);

      const tx = await fundFlow.connect(organizer).withdrawFunds(
        1,
        withdrawAmount,
        purpose,
        receiptHash
      );
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      await expect(tx)
        .to.emit(fundFlow, "FundsWithdrawn")
        .withArgs(1, organizer.address, withdrawAmount, purpose, receiptHash, (ts) => ts > 0);

      const finalOrganizerBalance = await ethers.provider.getBalance(organizer.address);
      expect(finalOrganizerBalance).to.equal(initialOrganizerBalance + withdrawAmount - gasUsed);

      const campaign = await fundFlow.getCampaign(1);
      expect(campaign.amountWithdrawn).to.equal(withdrawAmount);

      const withdrawals = await fundFlow.getWithdrawals(1);
      expect(withdrawals.length).to.equal(1);
      expect(withdrawals[0].amount).to.equal(withdrawAmount);
      expect(withdrawals[0].purpose).to.equal(purpose);
      expect(withdrawals[0].receiptIpfsHash).to.equal(receiptHash);
    });

    it("should reject withdrawal by non-organizer", async function () {
      await expect(
        fundFlow.connect(attacker).withdrawFunds(
          1,
          ethers.parseEther("0.5"),
          "Theft attempt",
          "fakeHash"
        )
      ).to.be.revertedWith("Unauthorized: Only organizer");
    });

    it("should reject withdrawal exceeding available balance", async function () {
      await expect(
        fundFlow.connect(organizer).withdrawFunds(
          1,
          ethers.parseEther("3.0"), // Only 2.0 collected
          "Exceeding amount",
          "fakeHash"
        )
      ).to.be.revertedWith("Insufficient campaign balance");
    });

    it("should reject withdrawal without purpose", async function () {
      await expect(
        fundFlow.connect(organizer).withdrawFunds(
          1,
          ethers.parseEther("0.5"),
          "",
          "hash"
        )
      ).to.be.revertedWith("Withdrawal purpose required");
    });
  });

  describe("Query & Platform Overview Methods", function () {
    it("should return all campaigns list", async function () {
      await fundFlow.connect(organizer).createCampaign(
        "Campaign 1", "Desc 1", "hash1", 0, ethers.parseEther("1"), 30
      );
      await fundFlow.connect(organizer).createCampaign(
        "Campaign 2", "Desc 2", "hash2", 1, ethers.parseEther("2"), 60
      );

      const all = await fundFlow.getAllCampaigns();
      expect(all.length).to.equal(2);
      expect(all[0].title).to.equal("Campaign 1");
      expect(all[1].title).to.equal("Campaign 2");
    });
  });
});
