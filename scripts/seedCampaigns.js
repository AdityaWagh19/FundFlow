const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("----------------------------------------------------");
  console.log("Seeding FundFlow Demo Campaigns on Sepolia...");
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

  const sampleCampaigns = [
    {
      title: "Save our students with your Donation!",
      description: "Emergency scholarship fund supporting underprivileged university students facing sudden tuition shortfalls and displacement.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      category: 1, // Education
      target: hre.ethers.parseEther("1.0"),
      duration: 45,
    },
    {
      title: "Los Angeles Flood Relief & Shelter",
      description: "Providing clean drinking water, dry rations, and temporary housing containers for families displaced by historic flooding.",
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
      category: 2, // Disaster
      target: hre.ethers.parseEther("2.0"),
      duration: 30,
    },
    {
      title: "Dengue Fever Pediatric Emergency Care",
      description: "Supplying rapid diagnostic test kits, intravenous fluids, and mosquito netting for pediatric community clinics in vulnerable regions.",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      category: 0, // Medical
      target: hre.ethers.parseEther("0.5"),
      duration: 20,
    },
    {
      title: "Road Repair & Village Bridge Donation",
      description: "Reconstructing a washed-out connecting bridge and damaged access road to allow ambulances and school buses to safely pass.",
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80",
      category: 4, // Community
      target: hre.ethers.parseEther("0.8"),
      duration: 60,
    },
  ];

  for (let i = 0; i < sampleCampaigns.length; i++) {
    const c = sampleCampaigns[i];
    console.log(`Creating campaign ${i + 1}/${sampleCampaigns.length}: "${c.title}"...`);
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

  console.log("Making a live initial donation of 0.001 ETH to Campaign 1...");
  const donateTx = await fundFlow.donate(1, { value: hre.ethers.parseEther("0.001") });
  await donateTx.wait(1);
  console.log("Donation confirmed!");

  console.log("----------------------------------------------------");
  console.log(">>> Sepolia Seeding Completed Successfully!");
  console.log("----------------------------------------------------");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exitCode = 1;
});
