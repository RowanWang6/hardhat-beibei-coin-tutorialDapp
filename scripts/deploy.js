const { ethers } = require("hardhat");

async function main() {
  // 获取第一个固定账户作为部署者
  const [deployer] = await ethers.getSigners();
  
  console.log("部署合约使用账户:", deployer.address);
  console.log("账户余额:", (await deployer.provider.getBalance(deployer.address)).toString());

  // 部署合约
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy();
  
  await myToken.waitForDeployment();
  
  const contractAddress = await myToken.getAddress();
  console.log("MyToken 合约部署到:", contractAddress);
  
  // 为了确保地址固定，我们可以计算预期的合约地址
  const expectedAddress = ethers.getCreateAddress({
    from: deployer.address,
    nonce: await deployer.provider.getTransactionCount(deployer.address) - 1
  });
  
  console.log("预期合约地址:", expectedAddress);
  console.log("实际合约地址:", contractAddress);
  console.log("地址匹配:", expectedAddress === contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });