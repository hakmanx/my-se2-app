import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyNFT", function () {
  it("deploys with name, symbol, royalty and mint price", async () => {
    const [owner, user] = await ethers.getSigners();
    const MyNFT = await ethers.getContractFactory("MyNFT");
    const royalty = 500; // 5%
    const price = ethers.parseEther("0.01");
    const my = await MyNFT.deploy("MyNFT", "MNFT", royalty, price);
    await my.waitForDeployment();

    expect(await my.name()).to.equal("MyNFT");
    expect(await my.symbol()).to.equal("MNFT");

    const [receiver, amount] = await my.royaltyInfo(1, ethers.parseEther("1"));
    expect(receiver).to.equal(owner.address);
    expect(amount).to.equal(ethers.parseEther("0.05"));

    expect(await my.mintPrice()).to.equal(price);
    expect(await my.mintPaused()).to.equal(false);
  });

  it("mints token when value >= mintPrice and sets tokenURI", async () => {
    const [owner, user] = await ethers.getSigners();
    const MyNFT = await ethers.getContractFactory("MyNFT");
    const my = await MyNFT.deploy("MyNFT", "MNFT", 500, ethers.parseEther("0.01"));
    await my.waitForDeployment();

    const uri = "ipfs://demo";
    await expect(my.connect(user).mint(uri, { value: ethers.parseEther("0.01") }))
      .to.emit(my, "Transfer")
      .withArgs(ethers.ZeroAddress, user.address, 1n);

    expect(await my.ownerOf(1n)).to.equal(user.address);
    expect(await my.tokenURI(1n)).to.equal(uri);
  });

  it("reverts mint when paused", async () => {
    const [owner, user] = await ethers.getSigners();
    const MyNFT = await ethers.getContractFactory("MyNFT");
    const my = await MyNFT.deploy("MyNFT", "MNFT", 500, ethers.parseEther("0.01"));
    await my.waitForDeployment();

    await my.pauseMint(true);
    await expect(my.connect(user).mint("ipfs://x", { value: ethers.parseEther("0.01") }))
      .to.be.revertedWith("mint paused");

    await my.pauseMint(false);
    await expect(my.connect(user).mint("ipfs://x", { value: ethers.parseEther("0.01") }))
      .to.emit(my, "Transfer");
  });

  it("owner can change price and royalty", async () => {
    const [owner, user] = await ethers.getSigners();
    const MyNFT = await ethers.getContractFactory("MyNFT");
    const my = await MyNFT.deploy("MyNFT", "MNFT", 500, ethers.parseEther("0.01"));
    await my.waitForDeployment();

    await my.setMintPrice(ethers.parseEther("0.02"));
    expect(await my.mintPrice()).to.equal(ethers.parseEther("0.02"));

    await my.setRoyalty(user.address, 1000); // 10%
    const [receiver, amount] = await my.royaltyInfo(1, ethers.parseEther("1"));
    expect(receiver).to.equal(user.address);
    expect(amount).to.equal(ethers.parseEther("0.1"));
  });
});
