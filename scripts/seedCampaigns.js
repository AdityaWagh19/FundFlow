const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("----------------------------------------------------");
  console.log("Seeding FundFlow Indian Humanitarian Causes on Sepolia...");
  console.log("----------------------------------------------------");

  // Read deployed address
  const addressFile = path.join(__dirname, "../frontend/src/utils/contractAddress.json");
  let contractAddress;

  if (fs.existsSync(addressFile)) {
    const data = JSON.parse(fs.readFileSync(addressFile, "utf-8"));
    contractAddress = data.contractAddress;
  }

  if (!contractAddress) {
    console.error("No contract address found. Please deploy first.");
    return;
  }

  const [deployer] = await hre.ethers.getSigners();
  const FundFlow = await hre.ethers.getContractFactory("FundFlow");
  const fundFlow = FundFlow.attach(contractAddress);

  console.log("Attached to contract at:", contractAddress);
  console.log("Signer address:", deployer.address);

  const indianCampaigns = [
    {
      title: "Save Rural Students: Pune & Nashik ZP School Grants",
      description: "Providing high-speed tablets, educational kits, and crisis scholarship grants for underprivileged Zilla Parishad school students across Maharashtra.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
      category: 1, // Education
      target: hre.ethers.parseEther("1.0"),
      duration: 45,
    },
    {
      title: "Kerala & Wayanad Monsoon Flood Emergency Relief",
      description: "Emergency rescue shelters, clean drinking water purifiers, and dry food supply kits for vulnerable families displaced by heavy monsoon landslides.",
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
      category: 2, // Disaster
      target: hre.ethers.parseEther("2.0"),
      duration: 30,
    },
    {
      title: "Pediatric Thalassemia & Cardiac Care (AIIMS & Sassoon Pune)",
      description: "Life-saving blood transfusions, pediatric cardiac surgeries, and rapid diagnostics for children admitted to government civic hospitals.",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      category: 0, // Medical
      target: hre.ethers.parseEther("0.5"),
      duration: 20,
    },
    {
      title: "Marathwada Drought Relief & Village Rainwater Harvesting",
      description: "Recharging dried agricultural borewells and building community rainwater harvesting recharge pits for smallholder farming families.",
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80",
      category: 4, // Community
      target: hre.ethers.parseEther("0.8"),
      duration: 60,
    },
  ];

  for (let i = 0; i < indianCampaigns.length; i++) {
    const c = indianCampaigns[i];
    console.log(`Creating Indian campaign ${i + 1}/${indianCampaigns.length}: "${c.title}"...`);
    const tx = await fundFlow.createCampaign(
      c.title,
      c.description,
      c.image,
      c.category,
      c.target,
      c.duration
    );
    await tx.wait(1);
    console.log(`Confirmed in block!`);
  }

  console.log("Making a live initial donation of 0.001 ETH to Campaign 1 (Rural Students)...");
  const donateTx = await fundFlow.donate(1, { value: hre.ethers.parseEther("0.001") });
  await donateTx.wait(1);
  console.log("Donation confirmed!");

  console.log("----------------------------------------------------");
  console.log(">>> Indian Campaigns Seeded Successfully on Sepolia!");
  console.log("----------------------------------------------------");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exitCode = 1;
});
