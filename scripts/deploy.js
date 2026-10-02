const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("----------------------------------------------------");
  console.log("Starting FundFlow Smart Contract Deployment...");
  console.log("----------------------------------------------------");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  const FundFlow = await hre.ethers.getContractFactory("FundFlow");
  const fundFlow = await FundFlow.deploy();
  await fundFlow.waitForDeployment();

  const contractAddress = await fundFlow.getAddress();
  console.log(">>> FundFlow successfully deployed to:", contractAddress);

  // Export deployment details to frontend configuration directory if available
  const deploymentData = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const outputDir = path.join(__dirname, "../frontend/src/utils");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, "contractAddress.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  console.log(">>> Contract address saved to frontend/src/utils/contractAddress.json");
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
