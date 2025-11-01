const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying LeakGuard-AI Smart Contracts for Pytheas Energy...\n");

  // Deploy LeakGuard
  const LeakGuard = await hre.ethers.getContractFactory("LeakGuard");
  const leakGuard = await LeakGuard.deploy();
  await leakGuard.waitForDeployment();
  console.log("✅ LeakGuard deployed to:", await leakGuard.getAddress());

  // Deploy ESGCredit
  const ESGCredit = await hre.ethers.getContractFactory("ESGCredit");
  const esgCredit = await ESGCredit.deploy();
  await esgCredit.waitForDeployment();
  console.log("✅ ESGCredit deployed to:", await esgCredit.getAddress());

  // Deploy OpsBounty
  const OpsBounty = await hre.ethers.getContractFactory("OpsBounty");
  const opsBounty = await OpsBounty.deploy();
  await opsBounty.waitForDeployment();
  console.log("✅ OpsBounty deployed to:", await opsBounty.getAddress());

  // Deploy NodeRegistry
  const NodeRegistry = await hre.ethers.getContractFactory("NodeRegistry");
  const nodeRegistry = await NodeRegistry.deploy();
  await nodeRegistry.waitForDeployment();
  console.log("✅ NodeRegistry deployed to:", await nodeRegistry.getAddress());

  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("LeakGuard:     ", await leakGuard.getAddress());
  console.log("ESGCredit:     ", await esgCredit.getAddress());
  console.log("OpsBounty:     ", await opsBounty.getAddress());
  console.log("NodeRegistry:  ", await nodeRegistry.getAddress());
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n✨ Ready for Pytheas Energy production deployment!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

