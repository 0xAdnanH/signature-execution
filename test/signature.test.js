const { expect } = require("chai");

const { ethers } = require("hardhat");

let addr1;
let addr2;
let signatureContract;
before(async () => {
  [addr1, addr2] = await ethers.getSigners();
  const signatureFactory = await ethers.getContractFactory("CallBySignature");
  signatureContract = await signatureFactory.deploy(addr1.address);
});

describe("Calling the function with owner's signature", () => {
  it("should pass when signing correct string", async () => {
    const nonce = await signatureContract.nonce();

    const msgTosign = ethers.solidityPacked(
      ["string", "uint256", "address", "uint256"],
      ["iwantToincrement", nonce, signatureContract.target, 31337]
    );

    const signature = await addr1.signMessage(ethers.toBeArray(msgTosign));

    await signatureContract.incrementCallNumber(signature);

    expect(await signatureContract.count()).to.equal(1);
    expect(await signatureContract.nonce()).to.equal(1);
  });
  it("should revert when signing wrong string", async () => {
    const nonce = await signatureContract.nonce();

    const msgTosign = ethers.solidityPacked(
      ["string", "uint256", "address", "uint256"],
      ["wrongwrong", nonce, signatureContract.target, 31337]
    );

    const signature = await addr1.signMessage(msgTosign);
    await expect(
      signatureContract.incrementCallNumber(ethers.toBeArray(signature))
    ).to.be.revertedWith("address recovered not the owner");
  });

  it("should revert when signing wrong address", async () => {
    const nonce = await signatureContract.nonce();

    const msgTosign = ethers.solidityPacked(
      ["string", "uint256", "address", "uint256"],
      ["iwantToincrement", nonce, addr1.address, 31337]
    );

    const signature = await addr1.signMessage(msgTosign);
    await expect(
      signatureContract.incrementCallNumber(ethers.toBeArray(signature))
    ).to.be.revertedWith("address recovered not the owner");
  });

  it("should revert when owner call more than 1", async () => {
    const nonce = await signatureContract.nonce();

    const msgTosign = ethers.solidityPacked(
      ["string", "uint256", "address", "uint256"],
      ["iwantToincrement", nonce, signatureContract.target, 31337]
    );

    const signature = await addr1.signMessage(ethers.toBeArray(msgTosign));
    await signatureContract.incrementCallNumber(ethers.toBeArray(signature));

    // again
    await expect(
      signatureContract.incrementCallNumber(ethers.toBeArray(signature))
    ).to.be.reverted;
  });
});
describe("Calling the function with non-owner's signature", () => {
  it("should revert", async () => {
    const nonce = await signatureContract.nonce();

    const msgTosign = ethers.solidityPacked(
      ["string", "uint256", "address", "uint256"],
      ["iwantToincrement", nonce, signatureContract.target, 31337]
    );
    const signature = await addr2.signMessage(msgTosign);
    await expect(
      signatureContract.incrementCallNumber(ethers.toBeArray(signature))
    ).to.be.revertedWith("address recovered not the owner");
  });
});
