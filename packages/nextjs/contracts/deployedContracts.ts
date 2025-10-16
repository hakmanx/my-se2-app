// Deployed contracts map — MyNFT on localhost (31337) with manual address.
// We use ABI from artifact and the address from the last deploy log.

import MyNFTArtifact from "./MyNFT.abi.json";

// адрес из вывода деплоя:
// deploying "MyNFT" ... deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3
const MYNFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const deployedContracts = {
  31337: {
    MyNFT: {
      address: MYNFT_ADDRESS,
      abi: (MyNFTArtifact as any).abi,
    },
  },
} as const;

export default deployedContracts;
