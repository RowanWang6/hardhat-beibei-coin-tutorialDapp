const { ethers } = require("hardhat");

async function main() {
  console.log("🎯 固定地址部署和测试脚本");
  console.log("=====================================");
  
  try {
    // 获取固定的部署者账户
    const [deployer] = await ethers.getSigners();
    console.log("📋 部署者账户:", deployer.address);
    
    // 获取账户余额
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 账户余额:", ethers.formatEther(balance), "ETH");
    
    // 获取当前 nonce
    const currentNonce = await deployer.provider.getTransactionCount(deployer.address);
    console.log("📊 当前 nonce:", currentNonce);
    
    // 计算预期的固定合约地址（nonce 0 对应的地址）
    const expectedAddress = ethers.getCreateAddress({
      from: deployer.address,
      nonce: 0  // 固定使用 nonce 0
    });
    console.log("🎯 固定合约地址:", expectedAddress);
    
    // 严格检查 nonce，非 0 时不执行
    if (currentNonce !== 0) {
      console.log("\n❌ 错误：当前 nonce 不是 0，无法获得固定地址");
      console.log("📊 当前 nonce:", currentNonce, "（必须为 0）");
      console.log("\n💡 解决方案：");
      console.log("   1. 停止当前 Hardhat 网络 (按 Ctrl+C)");
      console.log("   2. 重新启动网络: npx hardhat node");
      console.log("   3. 重新运行此脚本");
      console.log("\n⚠️  注意：确保重启网络后立即运行此脚本，不要执行其他交易");
      process.exit(1);
    }
    
    console.log("✅ nonce 检查通过，开始部署...");
    
    // 部署合约
    console.log("\n🔨 正在部署合约...");
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    
    await myToken.waitForDeployment();
    const contractAddress = await myToken.getAddress();
    
    console.log("✅ 合约部署成功!");
    console.log("📍 实际合约地址:", contractAddress);
    
    // 验证地址是否匹配预期
    const addressMatch = contractAddress === expectedAddress;
    console.log("🎯 地址验证:", addressMatch ? "✅ 匹配固定地址" : "❌ 地址不匹配");
    
    if (!addressMatch) {
      console.log("⚠️  警告：合约地址与预期不符！");
      console.log("   预期:", expectedAddress);
      console.log("   实际:", contractAddress);
    }
    
    // 自动更新前端配置
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(__dirname, '../frontend-react/src/config/wagmi.ts');
    
    try {
      let configContent = fs.readFileSync(configPath, 'utf8');
      const addressRegex = /export const CONTRACT_ADDRESS = '[^']+';/;
      const newAddressLine = `export const CONTRACT_ADDRESS = '${contractAddress}';`;
      
      if (addressRegex.test(configContent)) {
        configContent = configContent.replace(addressRegex, newAddressLine);
        fs.writeFileSync(configPath, configContent);
        console.log("🔄 前端配置已自动更新!");
      }
    } catch (err) {
      console.log("⚠️  无法自动更新前端配置:", err.message);
    }
    
    // 验证合约基本信息
    console.log("\n🔍 验证合约信息:");
    console.log("- 代币名称:", await myToken.name());
    console.log("- 代币符号:", await myToken.symbol());
    console.log("- 小数位数:", await myToken.decimals());
    console.log("- 合约拥有者:", await myToken.owner());
    console.log("- 总供应量:", ethers.formatEther(await myToken.totalSupply()));
    
    // 测试铸造功能
    console.log("\n🪙 测试铸造功能...");
    const mintAmount = ethers.parseEther("1000");
    await myToken.mint(deployer.address, mintAmount);
    console.log("✅ 铸造成功! 数量:", ethers.formatEther(mintAmount));
    
    // 验证余额
    const userBalance = await myToken.balanceOf(deployer.address);
    console.log("💳 用户余额:", ethers.formatEther(userBalance));
    
    // 测试转账功能
    console.log("\n💸 测试转账功能...");
    const [, secondUser] = await ethers.getSigners();
    const transferAmount = ethers.parseEther("100");
    await myToken.transfer(secondUser.address, transferAmount);
    
    const secondUserBalance = await myToken.balanceOf(secondUser.address);
    console.log("✅ 转账成功!");
    console.log("💳 接收者余额:", ethers.formatEther(secondUserBalance));
    
    // 测试销毁功能
    console.log("\n🔥 测试销毁功能...");
    const burnAmount = ethers.parseEther("50");
    await myToken.burn(burnAmount);
    
    const finalBalance = await myToken.balanceOf(deployer.address);
    const finalSupply = await myToken.totalSupply();
    console.log("✅ 销毁成功!");
    console.log("💳 部署者最终余额:", ethers.formatEther(finalBalance));
    console.log("📊 最终总供应量:", ethers.formatEther(finalSupply));
    
    console.log("\n🎉 部署和测试完成!");
    console.log("📋 前端配置信息:");
    console.log("- 合约地址:", contractAddress);
    console.log("- 部署者地址:", deployer.address);
    console.log("- 网络: localhost (31337)");
    
    if (addressMatch) {
      console.log("\n✅ 恭喜！使用固定地址部署成功!");
      console.log("💡 提示：要保持地址固定，请：");
      console.log("   1. 每次重启 Hardhat 网络: npx hardhat node");
      console.log("   2. 立即运行此脚本（不要执行其他交易）");
      console.log("   3. 使用相同的部署账户和 nonce 0");
    } else {
      console.log("\n⚠️  注意：当前使用的地址不是固定地址");
      console.log("💡 要获得固定地址，请重启 Hardhat 网络:");
      console.log("   npx hardhat node");
      console.log("   然后立即再次运行此脚本");
    }
    
  } catch (error) {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 错误:", error);
    process.exit(1);
  });