const hre = require('hardhat');

async function main() {
  const PaintTerk = await hre.ethers.getContractFactory('PaintTerk');
  const paintTerk = await PaintTerk.deploy();

  await paintTerk.deployed();

  console.log(`Deployed ${paintTerk.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
