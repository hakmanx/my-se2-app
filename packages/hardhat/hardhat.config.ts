// CLEAN HARDHAT CONFIG (без toolbox)
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-deploy";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.23",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    ],
  },
  defaultNetwork: "localhost",
  networks: {
    hardhat: { chainId: 31337 },
    localhost: { url: "http://127.0.0.1:8545", chainId: 31337 },
  },
  namedAccounts: {
    deployer: { default: 0 },
  },
};

export default config;
