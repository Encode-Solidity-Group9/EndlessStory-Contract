import { expect } from "chai";
import { ethers } from "hardhat";
// https://github.com/dethcrypto/TypeChain
import { TextStore } from "../typechain-types";

// https://mochajs.org/#getting-started
describe("TextStore", function () {
  let storyContract: TextStore;
  let initialText: string = "Once upon a time...";

  // https://mochajs.org/#hooks
  beforeEach(async function () {
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const storyFactory = await ethers.getContractFactory("TextStore");
    // https://docs.ethers.io/v5/api/contract/contract-factory/#ContractFactory-deploy
    storyContract = await storyFactory.deploy(initialText) as TextStore;
    // https://docs.ethers.io/v5/api/contract/contract/#Contract-deployed
    await storyContract.deployed();
  });

  it("Should give a Initial Text", async function () {
    // https://docs.ethers.io/v5/api/contract/contract/#Contract-functionsCall
    const returnedText = await storyContract.getStory();
    // https://www.chaijs.com/api/bdd/#method_equal
    console.log("Initial text returned is :", returnedText);
    expect(returnedText).to.equal(initialText);
  });

  it("Should set owner to deployer account", async function () {
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const accounts = await ethers.getSigners();
    // https://docs.ethers.io/v5/api/contract/contract/#Contract-functionsCall
    const contractOwner = await storyContract.owner();
    // https://www.chaijs.com/api/bdd/#method_equal
    expect(contractOwner).to.equal(accounts[0].address);
  });

  it("Should not allow anyone other than owner to call transferOwnership", async function () {
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const accounts = await ethers.getSigners();
    // https://docs.ethers.io/v5/api/contract/contract/#Contract-connect
    // https://docs.ethers.io/v5/api/contract/contract/#contract-functionsSend
    // https://hardhat.org/hardhat-chai-matchers/docs/overview#reverts
    await expect(
      storyContract
        .connect(accounts[1])
        .transferOwnership(accounts[1].address)
    ).to.be.revertedWith("You are not the owner");
  });

  it("Should execute transferOwnership correctly", async function () {
    const accounts = await ethers.getSigners();
    let tx = await storyContract.connect(accounts[0]).transferOwnership(accounts[1].address);
    await tx.wait();

    const newOwner = await storyContract.owner();
    expect(newOwner).to.equal(accounts[1].address);
  });

  it("Should change text correctly", async function () {
    // TODO
    const appendedText = "The End";
    let tx = await storyContract.appendText(appendedText);
    await tx.wait();

    const updatedStory = await storyContract.getStory();
    console.log("Updated story returned is :", updatedStory);
    expect(updatedStory).to.equal(initialText + appendedText);
  });
});