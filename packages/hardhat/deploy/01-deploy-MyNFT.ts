import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const name = "CourseNFT";
  const symbol = "CNFT";
  const royaltyFee = 500; // 5%
  const mintPrice = ethers.parseEther("0.01");

  await deploy("MyNFT", {
    from: deployer,
    args: [name, symbol, royaltyFee, mintPrice],
    log: true,
    autoMine: true,
  });

  log("MyNFT deployed.");
};

export default func;
func.tags = ["MyNFT"];
