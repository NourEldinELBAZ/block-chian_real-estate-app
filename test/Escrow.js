const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Escrow", () => {
  let buyer, seller, inspector, lender;
  let realEstate, escrow;

  beforeEach(async () => {
    // setup accounts
    [buyer, seller, inspector, lender] = await ethers.getSigners();

    // deploy real estate
    const RealEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await RealEstate.deploy();

    // mint
    let transaction = await realEstate
      .connect(seller)
      .mint(
        "https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS"
      );
    await transaction.wait();

    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.address,
      seller.address,
      inspector.address,
      lender.address
    );
  });

  it("return nft address", async () => {
    const result = await escrow.nftAddress();
    expect(result).to.be.equal(realEstate.address);
  });
  it("return seller", async () => {
    const result = await escrow.seller();
    expect(result).to.be.equal(seller.address);
  });
  it("return inspector address", async () => {
    const result = await escrow.inspector();
    expect(result).to.be.equal(inspector.address);
  });
  it("return lender address", async () => {
    const result = await escrow.lender();
    expect(result).to.be.equal(lender.address);
  });
});
