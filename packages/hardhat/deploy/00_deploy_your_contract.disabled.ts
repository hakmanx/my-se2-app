// CLEAN deploy script for YourContract (совместим с hardhat-deploy + ethers v6)
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("YourContract", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  log("YourContract deployed.");
};

export default func;
func.tags = ["YourContract"];
